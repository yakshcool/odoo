/* ==========================================================================
   GlobeTrotter My Trips View (Filterable Grid & Actions)
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';
import { openShareModal } from '../components/modals.js';

export function renderMyTripsView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  let currentFilter = 'All';

  function renderGrid() {
    const trips = db.getTrips(currentFilter);

    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: 800;">My Trips</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Manage, edit and share all your travel itineraries</p>
        </div>
        <a href="#/create-trip" class="btn btn-primary">
          <i class="fa-solid fa-plus"></i> Plan New Trip
        </a>
      </div>

      <!-- Filter Tabs -->
      <div class="tabs">
        ${['All', 'Upcoming', 'Completed', 'Draft'].map(tab => `
          <button class="tab-btn ${currentFilter === tab ? 'active' : ''}" onclick="window.setMyTripsFilter('${tab}')">
            ${tab} Trips
          </button>
        `).join('')}
      </div>

      ${trips.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-suitcase"></i></div>
          <h3>No ${currentFilter !== 'All' ? currentFilter : ''} trips found</h3>
          <p style="color: var(--text-muted); max-width: 400px;">You haven't created any trips in this category yet. Start building your dream itinerary!</p>
          <a href="#/create-trip" class="btn btn-primary" style="margin-top: 0.5rem;">Create a Trip Now</a>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;">
          ${trips.map(trip => {
            const stops = db.getTripStops(trip.id);
            const stopCities = stops.map(s => db.getCityById(s.city_id)).filter(Boolean);
            const cityNames = stopCities.map(c => c.name).join(' → ') || 'Destinations pending';
            const days = db.calculateDaysBetween(trip.start_date, trip.end_date);

            return `
              <div class="card card-hover" style="display: flex; flex-direction: column;">
                <div style="height: 190px; position: relative; overflow: hidden;">
                  <img src="${trip.cover_image}" alt="${trip.name}" style="width: 100%; height: 100%; object-fit: cover;">
                  <span class="badge ${trip.status === 'Upcoming' ? 'badge-success' : 'badge-neutral'}" style="position: absolute; top: 1rem; right: 1rem; backdrop-filter: blur(4px);">
                    ${trip.status}
                  </span>
                </div>

                <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.35rem;">${trip.name}</h3>
                    <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.75rem;">
                      <i class="fa-solid fa-location-dot"></i> ${cityNames}
                    </div>
                    <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
                      <span><i class="fa-regular fa-calendar"></i> ${trip.start_date}</span>
                      <span><i class="fa-regular fa-clock"></i> ${days} Days</span>
                      <span><i class="fa-solid fa-wallet"></i> $${trip.estimated_cost || trip.budget}</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-color-light);">
                    <a href="#/itinerary/${trip.id}" class="btn btn-primary btn-sm">
                      <i class="fa-solid fa-eye"></i> View Itinerary
                    </a>

                    <div style="display: flex; gap: 0.35rem;">
                      <button class="btn btn-outline btn-sm btn-icon" title="Duplicate Trip" onclick="window.duplicateUserTrip('${trip.id}')">
                        <i class="fa-solid fa-copy"></i>
                      </button>
                      <button class="btn btn-outline btn-sm btn-icon" title="Share Link" onclick="window.shareUserTrip('${trip.id}')">
                        <i class="fa-solid fa-share-nodes"></i>
                      </button>
                      <button class="btn btn-outline btn-sm btn-icon" title="Delete Trip" style="color: var(--primary);" onclick="window.deleteUserTrip('${trip.id}')">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;

    attachEvents();
  }

  function attachEvents() {
    window.setMyTripsFilter = (filter) => {
      currentFilter = filter;
      renderGrid();
    };

    window.duplicateUserTrip = (tId) => {
      const dup = db.duplicateTrip(tId);
      if (dup) {
        showToast(`Duplicated trip as "${dup.name}"`, 'success');
        renderGrid();
      }
    };

    window.shareUserTrip = (tId) => {
      const trip = db.getTripById(tId);
      if (trip) openShareModal(trip);
    };

    window.deleteUserTrip = (tId) => {
      if (confirm('Are you sure you want to delete this trip itinerary?')) {
        db.deleteTrip(tId);
        showToast('Trip deleted', 'info');
        renderGrid();
      }
    };
  }

  renderGrid();
  return container;
}
