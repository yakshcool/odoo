/* ==========================================================================
   GlobeTrotter Dashboard & Home View
   ========================================================================== */

import { db } from '../db.js';

export function renderDashboardView() {
  const user = db.getCurrentUser();
  const trips = db.getTrips();
  const cities = db.getCities().slice(0, 4);

  const totalTrips = trips.length;
  const upcomingTrips = trips.filter(t => t.status === 'Upcoming');
  const nextTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : null;
  const totalBudget = trips.reduce((acc, curr) => acc + (curr.estimated_cost || curr.budget), 0);

  const container = document.createElement('div');
  container.className = 'content-container';

  container.innerHTML = `
    <div class="welcome-banner">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; position: relative; z-index: 2;">
        <div>
          <span class="badge badge-accent" style="margin-bottom: 0.75rem;"><i class="fa-solid fa-sparkles"></i> Welcome Back</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">Good morning, ${user.name}!</h1>
          <p style="color: #cbd5e1; font-size: 1.05rem;">Where are you traveling next?</p>
        </div>
        <a href="#/create-trip" class="btn btn-primary btn-lg">
          <i class="fa-solid fa-circle-plus"></i> Plan New Trip
        </a>
      </div>
    </div>

    <!-- Stat Highlights -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--primary-light); color: var(--primary);">
          <i class="fa-solid fa-suitcase-rolling"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Trips</div>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">${totalTrips} Planned</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: var(--accent-light); color: var(--accent);">
          <i class="fa-solid fa-plane-arrival"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Next Departure</div>
          <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; white-space: nowrap;">
            ${nextTrip ? nextTrip.start_date : 'None Scheduled'}
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
          <i class="fa-solid fa-wallet"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Budget</div>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">$${totalBudget.toLocaleString()}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: var(--info-light); color: var(--info);">
          <i class="fa-solid fa-heart"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Saved Cities</div>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">3 Saved</div>
        </div>
      </div>
    </div>

    <!-- Upcoming Trips Section -->
    <div style="margin-bottom: 3rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
        <div>
          <h2 style="font-size: 1.5rem;">Upcoming Itineraries</h2>
          <p style="color: var(--text-muted); font-size: 0.875rem;">Your active multi-city adventures</p>
        </div>
        <a href="#/my-trips" class="btn btn-outline btn-sm">View All Trips (${totalTrips})</a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;">
        ${trips.map(trip => {
          const stops = db.getTripStops(trip.id);
          const stopCities = stops.map(s => db.getCityById(s.city_id)).filter(Boolean);
          const cityNames = stopCities.map(c => c.name).join(' → ') || 'Destinations pending';
          const days = db.calculateDaysBetween(trip.start_date, trip.end_date);

          return `
            <div class="card card-hover" style="display: flex; flex-direction: column;">
              <div style="height: 180px; position: relative; overflow: hidden;">
                <img src="${trip.cover_image}" alt="${trip.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <span class="badge ${trip.status === 'Upcoming' ? 'badge-success' : 'badge-neutral'}" style="position: absolute; top: 1rem; right: 1rem; backdrop-filter: blur(4px);">
                  ${trip.status}
                </span>
              </div>

              <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <h3 style="font-size: 1.2rem; margin-bottom: 0.35rem;">${trip.name}</h3>
                  <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.75rem;">
                    <i class="fa-solid fa-location-dot"></i> ${cityNames}
                  </div>
                  <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
                    <span><i class="fa-regular fa-calendar"></i> ${trip.start_date} to ${trip.end_date}</span>
                    <span><i class="fa-regular fa-clock"></i> ${days} Days</span>
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-color-light);">
                  <div>
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">Est. Budget</div>
                    <div style="font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; color: var(--text-main);">$${trip.estimated_cost || trip.budget}</div>
                  </div>
                  <a href="#/itinerary/${trip.id}" class="btn btn-primary btn-sm">
                    View Trip <i class="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Recommended Destinations -->
    <div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
        <div>
          <h2 style="font-size: 1.5rem;">Recommended Destinations</h2>
          <p style="color: var(--text-muted); font-size: 0.875rem;">Popular cities for your next getaway</p>
        </div>
        <a href="#/discover-cities" class="btn btn-outline btn-sm">Explore All Destinations</a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;">
        ${cities.map(city => `
          <div class="destination-card">
            <img src="${city.image}" alt="${city.name}" class="destination-img">
            <div class="destination-overlay">
              <span class="badge badge-accent" style="width: fit-content; margin-bottom: 0.5rem;">${city.cost_index} • ★ ${city.popularity}</span>
              <h3 style="font-size: 1.35rem; color: #ffffff;">${city.name}</h3>
              <p style="font-size: 0.8rem; color: #e2e8f0; margin-bottom: 1rem;">${city.country}</p>
              <a href="#/discover-cities" class="btn btn-outline btn-sm" style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4); color: white;">
                View Details
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return container;
}
