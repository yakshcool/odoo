/* ==========================================================================
   GlobeTrotter Shared Public Read-Only Itinerary View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';

export function renderSharedItineraryView(shareId) {
  const container = document.createElement('div');
  container.className = 'content-container';

  const trip = db.getTripById(shareId);

  if (!trip) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Itinerary Not Found</h2>
        <p style="color: var(--text-muted);">The requested public trip itinerary link is invalid or has expired.</p>
        <a href="#/dashboard" class="btn btn-primary">Go to GlobeTrotter Home</a>
      </div>
    `;
    return container;
  }

  const stops = db.getTripStops(trip.id);
  const stopCities = stops.map(s => db.getCityById(s.city_id)).filter(Boolean);
  const itineraryActivities = db.getItineraryActivitiesForTrip(trip.id);
  const totalDays = db.calculateDaysBetween(trip.start_date, trip.end_date);

  container.innerHTML = `
    <!-- Top Shared Public Header -->
    <div style="background: var(--bg-sidebar); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
        <i class="fa-solid fa-globe" style="color: var(--primary);"></i>
        <span>Public Shared Itinerary • GlobeTrotter</span>
      </div>
      <button id="btn-copy-shared-trip" class="btn btn-primary btn-sm">
        <i class="fa-solid fa-copy"></i> Copy Trip to My Account
      </button>
    </div>

    <!-- Hero Header -->
    <div style="height: 280px; position: relative; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 2rem;">
      <img src="${trip.cover_image}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 20%, rgba(15, 23, 42, 0.9) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem; color: white;">
        <span class="badge badge-accent" style="width: fit-content; margin-bottom: 0.5rem;">${totalDays} Days • Created by ${db.getCurrentUser().name}</span>
        <h1 style="font-size: 2.5rem; color: white; font-weight: 800;">${trip.name}</h1>
        <p style="color: #cbd5e1; font-size: 1rem;"><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${stopCities.map(c => c.name).join(' → ')}</p>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="stats-grid" style="margin-bottom: 2rem;">
      <div class="stat-card">
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">DATE RANGE</div>
          <strong style="font-size: 1.1rem;">${trip.start_date} to ${trip.end_date}</strong>
        </div>
      </div>
      <div class="stat-card">
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">DESTINATIONS</div>
          <strong style="font-size: 1.1rem;">${stopCities.length} Cities</strong>
        </div>
      </div>
      <div class="stat-card">
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">ESTIMATED BUDGET</div>
          <strong style="font-size: 1.1rem; color: var(--primary);">$${(trip.estimated_cost || trip.budget).toLocaleString()}</strong>
        </div>
      </div>
    </div>

    <!-- Day by Day Public View -->
    <div style="max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Day-by-Day Experience</h2>

      ${stops.map((stop, sIdx) => {
        const city = db.getCityById(stop.city_id);
        const dayActs = itineraryActivities.filter(ia => ia.trip_stop_id === stop.id);

        return `
          <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
              <img src="${city.image}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
              <div>
                <h3 style="font-size: 1.25rem;">Stop ${sIdx + 1}: ${city.name}, ${city.country}</h3>
                <span style="font-size: 0.85rem; color: var(--text-muted);">${stop.arrival_date} to ${stop.departure_date}</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${dayActs.map(ia => {
                const act = db.getActivityById(ia.activity_id);
                return `
                  <div style="display: flex; gap: 1rem; align-items: center; background: var(--bg-main); padding: 0.875rem; border-radius: var(--radius-md);">
                    <img src="${act ? act.image : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80'}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;">
                    <div style="flex: 1;">
                      <h4 style="font-size: 0.95rem;">${act ? act.name : 'Scheduled Activity'}</h4>
                      <span style="font-size: 0.75rem; color: var(--text-muted);">${ia.start_time || '10:00'} • ${act ? act.category : 'General'}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  setTimeout(() => {
    const copyBtn = container.querySelector('#btn-copy-shared-trip');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const duplicated = db.duplicateTrip(trip.id);
        if (duplicated) {
          showToast(`Copied "${trip.name}" to your account!`, 'success');
          window.location.hash = `#/itinerary/${duplicated.id}`;
        }
      };
    }
  }, 0);

  return container;
}
