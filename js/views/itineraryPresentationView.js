/* ==========================================================================
   GlobeTrotter Itinerary Presentation View (Read & Print Mode)
   ========================================================================== */

import { db } from '../db.js';
import { openShareModal } from '../components/modals.js';

export function renderItineraryPresentationView(tripId) {
  const container = document.createElement('div');
  container.className = 'content-container';

  let currentViewMode = 'timeline'; // 'timeline', 'calendar', 'list'
  const trip = db.getTripById(tripId);

  if (!trip) {
    container.innerHTML = `<div class="empty-state"><h2>Trip not found</h2></div>`;
    return container;
  }

  const stops = db.getTripStops(trip.id);
  const stopCities = stops.map(s => db.getCityById(s.city_id)).filter(Boolean);
  const itineraryActivities = db.getItineraryActivitiesForTrip(trip.id);
  const totalDays = db.calculateDaysBetween(trip.start_date, trip.end_date);

  function render() {
    container.innerHTML = `
      <!-- Hero Banner -->
      <div style="height: 280px; position: relative; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 2rem; box-shadow: var(--shadow-lg);">
        <img src="${trip.cover_image}" alt="${trip.name}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 20%, rgba(15, 23, 42, 0.9) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem; color: white;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-accent" style="margin-bottom: 0.5rem;">${totalDays} Days Trip</span>
              <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 0.25rem;">${trip.name}</h1>
              <p style="color: #cbd5e1; font-size: 1rem;"><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${stopCities.map(c => c.name).join(' → ')}</p>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button id="btn-print-itinerary" class="btn btn-outline" style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4); color: white;">
                <i class="fa-solid fa-print"></i> Print / PDF
              </button>
              <button id="btn-share-itinerary" class="btn btn-primary">
                <i class="fa-solid fa-share-nodes"></i> Share Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- View Mode Selector Tabs -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div class="tabs" style="margin-bottom: 0;">
          <button class="tab-btn ${currentViewMode === 'timeline' ? 'active' : ''}" onclick="window.setPresMode('timeline')">
            <i class="fa-solid fa-timeline"></i> Timeline View
          </button>
          <button class="tab-btn ${currentViewMode === 'list' ? 'active' : ''}" onclick="window.setPresMode('list')">
            <i class="fa-solid fa-list-check"></i> Summary List
          </button>
        </div>

        <a href="#/itinerary/${trip.id}" class="btn btn-outline btn-sm">
          <i class="fa-solid fa-pen-to-square"></i> Back to Builder
        </a>
      </div>

      <!-- Main Content Area -->
      ${renderContentMode()}
    `;

    attachEvents();
  }

  function renderContentMode() {
    if (currentViewMode === 'timeline') {
      let dayCounter = 1;
      return `
        <div style="max-width: 800px; margin: 0 auto; position: relative; padding-left: 2rem; border-left: 3px solid var(--primary-light);">
          ${stops.map(stop => {
            const city = db.getCityById(stop.city_id);
            const arr = new Date(stop.arrival_date);
            const dep = new Date(stop.departure_date);
            const numDays = Math.max(1, Math.ceil((dep - arr) / (1000 * 60 * 60 * 24)));

            return `
              <div style="margin-bottom: 3rem;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; margin-left: -2.85rem;">
                  <img src="${city.image}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);">
                  <div>
                    <h2 style="font-size: 1.4rem;">${city.name}, ${city.country}</h2>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">${stop.arrival_date} to ${stop.departure_date}</span>
                  </div>
                </div>

                ${Array.from({ length: numDays }).map((_, i) => {
                  const currentDateObj = new Date(arr);
                  currentDateObj.setDate(currentDateObj.getDate() + i);
                  const dateStr = currentDateObj.toISOString().split('T')[0];
                  const dayActs = itineraryActivities.filter(ia => ia.trip_stop_id === stop.id && ia.date === dateStr);
                  const currentDayNum = dayCounter++;

                  return `
                    <div style="margin-bottom: 2rem;">
                      <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 1rem;">Day ${currentDayNum} • ${dateStr}</h3>

                      <div style="display: flex; flex-direction: column; gap: 1rem;">
                        ${dayActs.length === 0 ? `
                          <div style="font-size: 0.85rem; color: var(--text-subtle); font-style: italic;">Relaxation & free exploration day.</div>
                        ` : dayActs.map(ia => {
                          const act = db.getActivityById(ia.activity_id);
                          if (!act) return '';
                          return `
                            <div class="card" style="padding: 1.25rem; display: flex; gap: 1.25rem; align-items: center;">
                              <img src="${act.image}" style="width: 80px; height: 80px; border-radius: var(--radius-md); object-fit: cover;">
                              <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                  <h4 style="font-size: 1.05rem;">${act.name}</h4>
                                  <strong style="color: var(--primary);">$${ia.custom_cost || act.estimated_cost}</strong>
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">
                                  <i class="fa-regular fa-clock"></i> ${ia.start_time || '10:00'} • ${act.duration} • <span class="badge badge-info">${act.category}</span>
                                </div>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">${act.description}</p>
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
          }).join('')}
        </div>
      `;
    }

    if (currentViewMode === 'list') {
      return `
        <div class="card" style="padding: 2rem;">
          <h2 style="font-size: 1.35rem; margin-bottom: 1.5rem;">Trip Itinerary Summary</h2>
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted);">
                <th style="padding: 0.75rem;">Date</th>
                <th style="padding: 0.75rem;">Time</th>
                <th style="padding: 0.75rem;">Activity</th>
                <th style="padding: 0.75rem;">Category</th>
                <th style="padding: 0.75rem; text-align: right;">Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              ${itineraryActivities.map(ia => {
                const act = db.getActivityById(ia.activity_id);
                return `
                  <tr style="border-bottom: 1px solid var(--border-color-light);">
                    <td style="padding: 0.75rem;">${ia.date}</td>
                    <td style="padding: 0.75rem;">${ia.start_time || '10:00'}</td>
                    <td style="padding: 0.75rem; font-weight: 600;">${act ? act.name : 'Custom Activity'}</td>
                    <td style="padding: 0.75rem;"><span class="badge badge-info">${act ? act.category : 'General'}</span></td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: var(--primary);">$${ia.custom_cost || (act ? act.estimated_cost : 0)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  function attachEvents() {
    window.setPresMode = (mode) => {
      currentViewMode = mode;
      render();
    };

    const shareBtn = container.querySelector('#btn-share-itinerary');
    if (shareBtn) shareBtn.onclick = () => openShareModal(trip);

    const printBtn = container.querySelector('#btn-print-itinerary');
    if (printBtn) printBtn.onclick = () => window.print();
  }

  render();
  return container;
}
