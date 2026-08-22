/* ==========================================================================
   GlobeTrotter Flagship Interactive Itinerary Builder View (with Drag & Drop)
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';
import { openAddCityModal, openAddActivityModal, openShareModal } from '../components/modals.js';
import { renderTripMap } from '../components/map.js';

export function renderItineraryView(tripId) {
  const container = document.createElement('div');
  container.className = 'content-container';

  let trip = db.getTripById(tripId);
  if (!trip) {
    container.innerHTML = `<div class="empty-state"><h2>Trip not found</h2><a href="#/dashboard" class="btn btn-primary">Return to Dashboard</a></div>`;
    return container;
  }

  function updateView() {
    trip = db.getTripById(tripId);
    const stops = db.getTripStops(trip.id);
    const stopCities = stops.map(s => db.getCityById(s.city_id)).filter(Boolean);
    const itineraryActivities = db.getItineraryActivitiesForTrip(trip.id);
    const totalDays = db.calculateDaysBetween(trip.start_date, trip.end_date);

    // Calculate budget breakdown
    const totalEstCost = trip.estimated_cost || 0;
    const isOverBudget = totalEstCost > trip.budget;

    container.innerHTML = `
      <!-- Trip Header & Sub-Nav -->
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
              <h1 style="font-size: 2rem; font-weight: 800;">${trip.name}</h1>
              <span class="badge ${trip.status === 'Upcoming' ? 'badge-success' : 'badge-neutral'}">${trip.status}</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">
              <i class="fa-regular fa-calendar"></i> ${trip.start_date} to ${trip.end_date} • <strong>${totalDays} Days</strong> • ${stopCities.map(c => c.name).join(' → ')}
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="#/trip-presentation/${trip.id}" class="btn btn-outline">
              <i class="fa-solid fa-eye"></i> Presentation Mode
            </a>
            <a href="#/budget/${trip.id}" class="btn btn-outline">
              <i class="fa-solid fa-chart-pie"></i> Budget & Expenses
            </a>
            <button id="btn-share-itinerary" class="btn btn-primary">
              <i class="fa-solid fa-share-nodes"></i> Share Trip
            </button>
          </div>
        </div>

        <!-- Over budget warning banner -->
        ${isOverBudget ? `
          <div class="alert alert-warning">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.25rem; margin-top: 2px;"></i>
            <div>
              <strong>Budget Warning:</strong> Estimated expenses ($${totalEstCost.toLocaleString()}) exceed your target budget ($${trip.budget.toLocaleString()}) by $${(totalEstCost - trip.budget).toLocaleString()}.
            </div>
          </div>
        ` : ''}
      </div>

      <!-- 3-Column Itinerary Builder Layout -->
      <div class="itinerary-layout">
        
        <!-- LEFT COLUMN: Cities & Stops Panel -->
        <div class="stops-panel">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.1rem;"><i class="fa-solid fa-route" style="color: var(--primary);"></i> Route Stops</h3>
            <span class="badge badge-neutral">${stops.length} Cities</span>
          </div>

          <div id="stops-list-container">
            ${stops.length === 0 ? `
              <div style="text-align: center; padding: 1.5rem 0; color: var(--text-muted); font-size: 0.85rem;">No destinations added yet.</div>
            ` : stops.map((stop, idx) => {
              const city = db.getCityById(stop.city_id);
              const nights = db.calculateDaysBetween(stop.arrival_date, stop.departure_date);

              return `
                <div class="city-stop-item" data-stop-id="${stop.id}">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">${idx + 1}.</span>
                    <img src="${city.image}" alt="${city.name}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover;">
                    <div>
                      <div style="font-weight: 600; font-size: 0.9rem;">${city.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${nights} Nights (${stop.arrival_date.slice(5)})</div>
                    </div>
                  </div>
                  <button class="btn btn-ghost btn-icon" style="color: var(--text-subtle); width: 28px; height: 28px;" onclick="window.handleRemoveStop('${stop.id}')" title="Remove city">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              `;
            }).join('')}
          </div>

          <button id="btn-add-city-stop" class="btn btn-outline" style="width: 100%; margin-top: 0.75rem;">
            <i class="fa-solid fa-plus"></i> Add Destination
          </button>

          <!-- Interactive Map Container -->
          <div style="margin-top: 1.5rem;">
            <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted);">Route Map</div>
            <div id="trip-map-container" style="height: 200px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color);"></div>
          </div>
        </div>

        <!-- CENTER COLUMN: Day-by-Day Itinerary -->
        <div class="main-itinerary-panel">
          ${stops.length === 0 ? `
            <div class="card empty-state">
              <div class="empty-state-icon"><i class="fa-solid fa-map-location-dot"></i></div>
              <h3>Start Building Your Itinerary</h3>
              <p style="color: var(--text-muted);">Add your first destination city on the left panel to generate day-by-day activity slots.</p>
              <button class="btn btn-primary" onclick="window.handleAddCityClickModal()">Add First City</button>
            </div>
          ` : renderDayByDayItinerary(trip, stops, itineraryActivities)}
        </div>

        <!-- RIGHT COLUMN: Financial & Trip Summary Sidebar -->
        <div class="summary-sidebar">
          <h3 style="font-size: 1.1rem; margin-bottom: 1rem;"><i class="fa-solid fa-wallet" style="color: var(--accent);"></i> Trip Summary</h3>

          <div style="margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
              <span style="color: var(--text-muted);">Estimated Total</span>
              <strong style="font-family: var(--font-heading); color: ${isOverBudget ? 'var(--primary)' : 'var(--text-main)'};">$${totalEstCost.toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Target Budget</span>
              <span style="font-family: var(--font-heading); font-weight: 600;">$${trip.budget.toLocaleString()}</span>
            </div>

            <!-- Progress bar -->
            <div style="width: 100%; height: 8px; background: var(--border-color-light); border-radius: 4px; overflow: hidden;">
              <div style="width: ${Math.min(100, Math.round((totalEstCost / trip.budget) * 100))}%; height: 100%; background: ${isOverBudget ? 'var(--primary)' : 'var(--success)'}; transition: width 0.4s ease;"></div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Daily Cost Average</span>
              <strong>$${Math.round(totalEstCost / (totalDays || 1))}/day</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Total Activities</span>
              <strong>${itineraryActivities.length} Scheduled</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Total Destinations</span>
              <strong>${stopCities.length} Cities</strong>
            </div>
          </div>

          <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <a href="#/discover-activities" class="btn btn-outline btn-sm" style="width: 100%;">
              <i class="fa-solid fa-magnifying-glass"></i> Discover Activities
            </a>
            <a href="#/calendar" class="btn btn-outline btn-sm" style="width: 100%;">
              <i class="fa-solid fa-calendar"></i> View Calendar
            </a>
          </div>
        </div>

      </div>
    `;

    attachEvents();
    setTimeout(() => {
      renderTripMap('trip-map-container', stopCities);
    }, 100);
  }

  function renderDayByDayItinerary(tripObj, stops, itinActivities) {
    let dayCounter = 1;
    let html = '';

    stops.forEach(stop => {
      const city = db.getCityById(stop.city_id);
      const arr = new Date(stop.arrival_date);
      const dep = new Date(stop.departure_date);
      const numDays = Math.max(1, Math.ceil((dep - arr) / (1000 * 60 * 60 * 24)));

      html += `
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-sidebar); color: white; padding: 1rem 1.25rem; border-radius: var(--radius-lg); margin-bottom: 1.25rem;">
            <img src="${city.image}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
            <div>
              <h3 style="font-size: 1.15rem; color: white;">${city.name}, ${city.country}</h3>
              <div style="font-size: 0.75rem; color: #94a3b8;">${stop.arrival_date} to ${stop.departure_date} • ${numDays} Nights</div>
            </div>
          </div>
      `;

      for (let i = 0; i < numDays; i++) {
        const currentDateObj = new Date(arr);
        currentDateObj.setDate(currentDateObj.getDate() + i);
        const dateStr = currentDateObj.toISOString().split('T')[0];

        // Filter activities for this stop and date
        const dayActivities = itinActivities.filter(ia => ia.trip_stop_id === stop.id && ia.date === dateStr);

        html += `
          <div class="day-section" data-date="${dateStr}" data-stop-id="${stop.id}">
            <div class="day-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--primary);">Day ${dayCounter}</span>
                <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">(${dateStr})</span>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.handleOpenAddActModal('${stop.id}', '${dateStr}')">
                <i class="fa-solid fa-plus"></i> Add Activity
              </button>
            </div>

            <div class="day-activities-list">
              ${dayActivities.length === 0 ? `
                <div style="text-align: center; padding: 1.25rem; background: var(--bg-main); border-radius: var(--radius-md); border: 1px dashed var(--border-color); color: var(--text-subtle); font-size: 0.85rem;">
                  No activities scheduled for Day ${dayCounter}. Click "+ Add Activity" to add sightseeing or dining.
                </div>
              ` : dayActivities.map(ia => {
                const act = db.getActivityById(ia.activity_id);
                if (!act) return '';
                return `
                  <div class="activity-card" draggable="true" data-itin-id="${ia.id}">
                    <span class="drag-handle" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></span>
                    <img src="${act.image}" alt="${act.name}" class="activity-thumb">
                    <div style="flex: 1; min-width: 0;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                        <h4 style="font-size: 1rem;">${act.name}</h4>
                        <span style="font-family: var(--font-heading); font-weight: 700; color: var(--primary);">$${ia.custom_cost || act.estimated_cost}</span>
                      </div>
                      <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                        <span><i class="fa-regular fa-clock"></i> ${ia.start_time || '10:00'} (${act.duration})</span>
                        <span class="badge badge-info">${act.category}</span>
                      </div>
                      <p style="font-size: 0.825rem; color: var(--text-muted); line-clamp: 2;">${act.description}</p>
                    </div>
                    <button class="btn btn-ghost btn-icon" style="color: var(--text-subtle); align-self: flex-start;" onclick="window.handleRemoveAct('${ia.id}')" title="Delete Activity">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;

        dayCounter++;
      }

      html += `</div>`;
    });

    return html;
  }

  function attachEvents() {
    window.handleAddCityClickModal = () => {
      openAddCityModal(trip.id, () => updateView());
    };

    const addCityBtn = container.querySelector('#btn-add-city-stop');
    if (addCityBtn) addCityBtn.onclick = window.handleAddCityClickModal;

    const shareBtn = container.querySelector('#btn-share-itinerary');
    if (shareBtn) shareBtn.onclick = () => openShareModal(trip);

    window.handleRemoveStop = (stopId) => {
      db.removeCityFromTrip(stopId);
      showToast('City removed from trip itinerary', 'info');
      updateView();
    };

    window.handleOpenAddActModal = (stopId, dateStr) => {
      openAddActivityModal(stopId, dateStr, () => updateView());
    };

    window.handleRemoveAct = (itinActId) => {
      db.removeActivityFromItinerary(itinActId);
      showToast('Activity removed', 'info');
      updateView();
    };

    // Attach HTML5 Drag & Drop Listeners for Activity Cards
    setTimeout(() => {
      const cards = container.querySelectorAll('.activity-card[draggable="true"]');
      let draggedId = null;

      cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
          draggedId = card.getAttribute('data-itin-id');
          card.style.opacity = '0.4';
          e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
          card.style.opacity = '1';
        });
      });

      const daySections = container.querySelectorAll('.day-section');
      daySections.forEach(section => {
        section.addEventListener('dragover', (e) => {
          e.preventDefault();
          section.style.borderColor = 'var(--primary)';
        });

        section.addEventListener('dragleave', () => {
          section.style.borderColor = 'var(--border-color)';
        });

        section.addEventListener('drop', (e) => {
          e.preventDefault();
          section.style.borderColor = 'var(--border-color)';
          const targetDate = section.getAttribute('data-date');
          const targetStopId = section.getAttribute('data-stop-id');

          if (draggedId && targetDate && targetStopId) {
            const itinAct = db.data.itineraryActivities.find(ia => ia.id === draggedId);
            if (itinAct) {
              itinAct.date = targetDate;
              itinAct.trip_stop_id = targetStopId;
              db.save();
              showToast('Activity moved to new day!', 'success');
              updateView();
            }
          }
        });
      });
    }, 100);
  }

  updateView();
  return container;
}
