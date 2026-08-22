/* ==========================================================================
   GlobeTrotter Admin & Startup Analytics Dashboard View
   ========================================================================== */

import { db } from '../db.js';

export function renderAdminView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  const trips = db.getTrips();
  const cities = db.getCities();
  const totalUsers = 1240; // Hackathon realistic metric
  const totalTripsCount = trips.length + 842;
  const avgBudget = 3120;

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Startup Analytics Dashboard</h1>
      <p style="color: var(--text-muted);">Overview of platform growth, user engagement, and popular destinations</p>
    </div>

    <!-- Overview Stats -->
    <div class="stats-grid" style="margin-bottom: 2.5rem;">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--info-light); color: var(--info);">
          <i class="fa-solid fa-users"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">ACTIVE USERS</div>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">${totalUsers.toLocaleString()}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: var(--primary-light); color: var(--primary);">
          <i class="fa-solid fa-plane-departure"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">TOTAL TRIPS CREATED</div>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">${totalTripsCount.toLocaleString()}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
          <i class="fa-solid fa-vault"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">AVG TRIP BUDGET</div>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">$${avgBudget.toLocaleString()}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: var(--accent-light); color: var(--accent);">
          <i class="fa-solid fa-fire"></i>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">TOP REGION</div>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">Europe (42%)</div>
        </div>
      </div>
    </div>

    <!-- Analytics Breakdown -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <div class="card" style="padding: 1.5rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 1.25rem;">Top Destination Cities</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${cities.slice(0, 5).map(c => `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${c.image}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;">
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem;">${c.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.country}</div>
                </div>
              </div>
              <span class="badge badge-success">★ ${c.popularity}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card" style="padding: 1.5rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 1.25rem;">Recent Platform Activity</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.875rem;">
          <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
            <i class="fa-solid fa-circle-check" style="color: var(--success); margin-top: 3px;"></i>
            <div>
              <strong>Meet created "European Summer Escape"</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">2 hours ago</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
            <i class="fa-solid fa-share-nodes" style="color: var(--info); margin-top: 3px;"></i>
            <div>
              <strong>Public link generated for "Japan Explorer"</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">5 hours ago</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
            <i class="fa-solid fa-user-plus" style="color: var(--accent); margin-top: 3px;"></i>
            <div>
              <strong>New user registration from Tokyo, JP</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return container;
}
