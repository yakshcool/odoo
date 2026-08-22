/* ==========================================================================
   GlobeTrotter Relational Local Database Layer
   ========================================================================== */

import {
  INITIAL_USER,
  INITIAL_CITIES,
  INITIAL_ACTIVITIES,
  INITIAL_TRIPS,
  INITIAL_TRIP_STOPS,
  INITIAL_ITINERARY_ACTIVITIES,
  INITIAL_EXPENSES,
  INITIAL_SAVED_DESTINATIONS
} from './mockData.js';

const STORAGE_KEY = 'GLOBETROTTER_DB_V2';

class LocalDatabase {
  constructor() {
    this.data = {
      users: [],
      trips: [],
      tripStops: [],
      cities: [],
      activities: [],
      itineraryActivities: [],
      expenses: [],
      savedDestinations: [],
      currentUser: null
    };
    this.init();
  }

  init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.data = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored DB, resetting to initial seed data", e);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  seedInitialData() {
    this.data = {
      users: [INITIAL_USER],
      trips: [...INITIAL_TRIPS],
      tripStops: [...INITIAL_TRIP_STOPS],
      cities: [...INITIAL_CITIES],
      activities: [...INITIAL_ACTIVITIES],
      itineraryActivities: [...INITIAL_ITINERARY_ACTIVITIES],
      expenses: [...INITIAL_EXPENSES],
      savedDestinations: [...INITIAL_SAVED_DESTINATIONS],
      currentUser: null // Guest mode by default; prompts sign in / sign up
    };
    this.save();
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  // --- Auth & User ---
  getCurrentUser() {
    return this.data.currentUser || null;
  }

  setCurrentUser(user) {
    this.data.currentUser = user;
    this.save();
  }

  loginDemoUser() {
    this.data.currentUser = INITIAL_USER;
    this.save();
    return INITIAL_USER;
  }

  logout() {
    this.data.currentUser = null;
    this.save();
  }

  // --- Cities ---
  getCities() {
    return this.data.cities;
  }

  getCityById(id) {
    return this.data.cities.find(c => c.id === id);
  }

  // --- Activities ---
  getActivities(cityId = null) {
    if (!cityId) return this.data.activities;
    return this.data.activities.filter(a => a.city_id === cityId);
  }

  getActivityById(id) {
    return this.data.activities.find(a => a.id === id);
  }

  // --- Trips ---
  getTrips(statusFilter = 'All') {
    if (statusFilter === 'All') return this.data.trips;
    return this.data.trips.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
  }

  getTripById(id) {
    return this.data.trips.find(t => t.id === id || t.share_id === id);
  }

  createTrip(tripData) {
    const user = this.getCurrentUser();
    const newTrip = {
      id: `trip-${Date.now()}`,
      user_id: user ? user.id : 'user-guest',
      name: tripData.name || "Untitled Trip",
      description: tripData.description || "",
      cover_image: tripData.cover_image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      start_date: tripData.start_date,
      end_date: tripData.end_date,
      budget: parseFloat(tripData.budget) || 2500,
      estimated_cost: 0,
      status: "Upcoming",
      share_id: `share-${Math.random().toString(36).substring(2, 9)}`,
      created_at: new Date().toISOString()
    };

    this.data.trips.push(newTrip);

    // If initial cities were passed
    if (tripData.cities && tripData.cities.length > 0) {
      let currentDate = new Date(tripData.start_date);
      const daysPerCity = Math.max(1, Math.floor(this.calculateDaysBetween(tripData.start_date, tripData.end_date) / tripData.cities.length));

      tripData.cities.forEach((cityId, index) => {
        const arrDate = new Date(currentDate);
        const depDate = new Date(currentDate);
        depDate.setDate(depDate.getDate() + daysPerCity);

        this.data.tripStops.push({
          id: `stop-${Date.now()}-${index}`,
          trip_id: newTrip.id,
          city_id: cityId,
          arrival_date: arrDate.toISOString().split('T')[0],
          departure_date: depDate.toISOString().split('T')[0],
          order_index: index
        });

        currentDate = depDate;
      });
    }

    this.recalculateTripCost(newTrip.id);
    this.save();
    return newTrip;
  }

  updateTrip(tripId, updates) {
    const index = this.data.trips.findIndex(t => t.id === tripId);
    if (index !== -1) {
      this.data.trips[index] = { ...this.data.trips[index], ...updates };
      this.recalculateTripCost(tripId);
      this.save();
    }
  }

  deleteTrip(tripId) {
    this.data.trips = this.data.trips.filter(t => t.id !== tripId);
    this.data.tripStops = this.data.tripStops.filter(s => s.trip_id !== tripId);
    this.data.expenses = this.data.expenses.filter(e => e.trip_id !== tripId);
    this.save();
  }

  duplicateTrip(tripId) {
    const original = this.getTripById(tripId);
    if (!original) return null;

    const newTripId = `trip-${Date.now()}`;
    const duplicatedTrip = {
      ...original,
      id: newTripId,
      name: `${original.name} (Copy)`,
      share_id: `share-${Math.random().toString(36).substring(2, 9)}`,
      created_at: new Date().toISOString()
    };
    this.data.trips.push(duplicatedTrip);

    // Duplicate stops
    const stops = this.getTripStops(tripId);
    stops.forEach((stop, idx) => {
      const newStopId = `stop-${Date.now()}-${idx}`;
      this.data.tripStops.push({
        ...stop,
        id: newStopId,
        trip_id: newTripId
      });

      // Duplicate itinerary activities for this stop
      const itinActs = this.data.itineraryActivities.filter(ia => ia.trip_stop_id === stop.id);
      itinActs.forEach((ia, iIdx) => {
        this.data.itineraryActivities.push({
          ...ia,
          id: `itin-act-${Date.now()}-${iIdx}`,
          trip_stop_id: newStopId
        });
      });
    });

    // Duplicate expenses
    const expenses = this.getExpenses(tripId);
    expenses.forEach((exp, eIdx) => {
      this.data.expenses.push({
        ...exp,
        id: `exp-${Date.now()}-${eIdx}`,
        trip_id: newTripId
      });
    });

    this.recalculateTripCost(newTripId);
    this.save();
    return duplicatedTrip;
  }

  // --- Trip Stops ---
  getTripStops(tripId) {
    return this.data.tripStops
      .filter(s => s.trip_id === tripId)
      .sort((a, b) => a.order_index - b.order_index);
  }

  addCityToTrip(tripId, cityId) {
    const stops = this.getTripStops(tripId);
    const trip = this.getTripById(tripId);

    let arrDate = trip.start_date;
    if (stops.length > 0) {
      arrDate = stops[stops.length - 1].departure_date;
    }
    const depDateObj = new Date(arrDate);
    depDateObj.setDate(depDateObj.getDate() + 3);
    const depDate = depDateObj.toISOString().split('T')[0];

    const newStop = {
      id: `stop-${Date.now()}`,
      trip_id: tripId,
      city_id: cityId,
      arrival_date: arrDate,
      departure_date: depDate,
      order_index: stops.length
    };
    this.data.tripStops.push(newStop);

    if (new Date(depDate) > new Date(trip.end_date)) {
      trip.end_date = depDate;
    }

    this.recalculateTripCost(tripId);
    this.save();
    return newStop;
  }

  removeCityFromTrip(stopId) {
    const stop = this.data.tripStops.find(s => s.id === stopId);
    if (!stop) return;

    this.data.tripStops = this.data.tripStops.filter(s => s.id !== stopId);
    this.data.itineraryActivities = this.data.itineraryActivities.filter(ia => ia.trip_stop_id !== stopId);
    
    this.recalculateTripCost(stop.trip_id);
    this.save();
  }

  // --- Itinerary Activities ---
  getItineraryActivitiesForStop(stopId) {
    return this.data.itineraryActivities.filter(ia => ia.trip_stop_id === stopId);
  }

  getItineraryActivitiesForTrip(tripId) {
    const stops = this.getTripStops(tripId);
    const stopIds = stops.map(s => s.id);
    return this.data.itineraryActivities.filter(ia => stopIds.includes(ia.trip_stop_id));
  }

  addActivityToItinerary(stopId, activityId, date, time = "10:00", customCost = null) {
    const act = this.getActivityById(activityId);
    const stop = this.data.tripStops.find(s => s.id === stopId);
    if (!act || !stop) return null;

    const newItinAct = {
      id: `itin-act-${Date.now()}`,
      trip_stop_id: stopId,
      activity_id: activityId,
      date: date || stop.arrival_date,
      start_time: time,
      order_index: this.getItineraryActivitiesForStop(stopId).length,
      custom_cost: customCost !== null ? parseFloat(customCost) : act.estimated_cost
    };

    this.data.itineraryActivities.push(newItinAct);
    this.recalculateTripCost(stop.trip_id);
    this.save();
    return newItinAct;
  }

  removeActivityFromItinerary(itinActId) {
    const itinAct = this.data.itineraryActivities.find(ia => ia.id === itinActId);
    if (!itinAct) return;

    const stop = this.data.tripStops.find(s => s.id === itinAct.trip_stop_id);
    this.data.itineraryActivities = this.data.itineraryActivities.filter(ia => ia.id !== itinActId);

    if (stop) {
      this.recalculateTripCost(stop.trip_id);
    }
    this.save();
  }

  // --- Expenses ---
  getExpenses(tripId) {
    return this.data.expenses.filter(e => e.trip_id === tripId);
  }

  addExpense(tripId, category, amount, description, date) {
    const newExp = {
      id: `exp-${Date.now()}`,
      trip_id: tripId,
      category,
      amount: parseFloat(amount),
      description,
      date: date || new Date().toISOString().split('T')[0]
    };
    this.data.expenses.push(newExp);
    this.recalculateTripCost(tripId);
    this.save();
    return newExp;
  }

  deleteExpense(expId) {
    const exp = this.data.expenses.find(e => e.id === expId);
    if (!exp) return;
    this.data.expenses = this.data.expenses.filter(e => e.id !== expId);
    this.recalculateTripCost(exp.trip_id);
    this.save();
  }

  // --- Calculations ---
  recalculateTripCost(tripId) {
    const trip = this.getTripById(tripId);
    if (!trip) return;

    const expenses = this.getExpenses(tripId);
    let totalExpenseSum = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const itinActs = this.getItineraryActivitiesForTrip(tripId);
    let totalActSum = itinActs.reduce((acc, curr) => acc + (curr.custom_cost || 0), 0);

    trip.estimated_cost = totalExpenseSum + (expenses.length > 0 ? 0 : totalActSum);
    this.save();
  }

  calculateDaysBetween(startDateStr, endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }
}

export const db = new LocalDatabase();
