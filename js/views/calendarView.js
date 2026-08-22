/* ==========================================================================
   GlobeTrotter Calendar & Timeline View
   ========================================================================== */

import { db } from '../db.js';

export function renderCalendarView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  const trips = db.getTrips();
  const allItinActs = trips.flatMap(t => db.getItineraryActivitiesForTrip(t.id));

  // Current calendar month view (September 2026 for demo matching sample dates)
  const daysInMonth = 30;
  const monthName = "September 2026";

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: 800;">Travel Calendar</h1>
          <p style="color: var(--text-muted);">Visual timeline of upcoming trip dates and scheduled activities</p>
        </div>

        <div style="display: flex; align-items: center; gap: 1rem;">
          <h3 style="font-size: 1.2rem; font-family: var(--font-heading);">${monthName}</h3>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid">
      ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `
        <div class="calendar-day-head">${d}</div>
      `).join('')}

      <!-- Empty padding days -->
      <div class="calendar-cell" style="opacity: 0.3;"><span style="font-size: 0.8rem;">30</span></div>
      <div class="calendar-cell" style="opacity: 0.3;"><span style="font-size: 0.8rem;">31</span></div>

      <!-- Days 1 to 30 -->
      ${Array.from({ length: daysInMonth }).map((_, i) => {
        const dayNum = i + 1;
        const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
        const activeTrip = trips.find(t => dateStr >= t.start_date && dateStr <= t.end_date);
        const dayActivities = allItinActs.filter(ia => ia.date === dateStr);

        return `
          <div class="calendar-cell ${activeTrip ? 'has-trip' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 700; color: ${activeTrip ? 'var(--primary)' : 'var(--text-main)'};">${dayNum}</span>
              ${activeTrip ? `<span style="font-size: 0.65rem; color: var(--primary); font-weight: 600;">Trip</span>` : ''}
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.25rem; overflow: hidden;">
              ${dayActivities.map(ia => {
                const act = db.getActivityById(ia.activity_id);
                return `
                  <div class="calendar-activity-pill" title="${act ? act.name : 'Activity'}">
                    ${ia.start_time || '10:00'} ${act ? act.name : 'Activity'}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return container;
}
