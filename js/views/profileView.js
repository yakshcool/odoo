/* ==========================================================================
   GlobeTrotter Profile & User Settings View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';

export function renderProfileView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  const user = db.getCurrentUser();
  const savedDestinations = db.data.savedDestinations.map(sd => db.getCityById(sd.city_id)).filter(Boolean);

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">User Profile & Settings</h1>
      <p style="color: var(--text-muted);">Manage your account details and travel preferences</p>
    </div>

    <div style="display: grid; grid-template-columns: 320px 1fr; gap: 2rem; align-items: start;">
      
      <!-- Profile Card Sidebar -->
      <div class="card" style="padding: 2rem; text-align: center;">
        <img src="${user.profile_image}" alt="${user.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem auto; border: 3px solid var(--primary);">
        <h2 style="font-size: 1.35rem; margin-bottom: 0.25rem;">${user.name}</h2>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">${user.email}</p>
        <span class="badge badge-accent"><i class="fa-solid fa-crown"></i> Pro Travel Planner</span>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); text-align: left; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Member Since</span>
            <strong>Jan 2026</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Language</span>
            <strong>${user.language || 'English (US)'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Currency</span>
            <strong>${user.currency || 'USD ($)'}</strong>
          </div>
        </div>
      </div>

      <!-- Settings & Saved Destinations Right Side -->
      <div>
        <!-- Saved Destinations -->
        <div class="card" style="padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 1rem;"><i class="fa-solid fa-heart" style="color: var(--primary);"></i> Saved Destinations</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
            ${savedDestinations.map(c => `
              <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-main); padding: 0.75rem; border-radius: var(--radius-md);">
                <img src="${c.image}" style="width: 45px; height: 45px; border-radius: var(--radius-sm); object-fit: cover;">
                <div>
                  <div style="font-weight: 600; font-size: 0.875rem;">${c.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.country}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Account Preferences -->
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 1.5rem;">Account Preferences</h3>

          <form id="profile-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="prof-name" class="form-input" value="${user.name}">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="prof-email" class="form-input" value="${user.email}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Preferred Currency</label>
                <select id="prof-curr" class="form-select">
                  <option value="USD ($)" selected>USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="JPY (¥)">JPY (¥)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Language</label>
                <select id="prof-lang" class="form-select">
                  <option value="English (US)" selected>English (US)</option>
                  <option value="French">French</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary">Save Profile Changes</button>
              <button type="button" id="btn-reset-demo-data" class="btn btn-outline" style="color: var(--primary);">
                <i class="fa-solid fa-rotate-left"></i> Reset Demo Data
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector('#profile-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const updated = {
          ...user,
          name: document.getElementById('prof-name').value,
          email: document.getElementById('prof-email').value,
          currency: document.getElementById('prof-curr').value,
          language: document.getElementById('prof-lang').value
        };
        db.setCurrentUser(updated);
        showToast('Profile settings updated successfully!', 'success');
      };
    }

    const resetBtn = container.querySelector('#btn-reset-demo-data');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm('Reset all trip data to initial seed demonstration data?')) {
          localStorage.removeItem('GLOBETROTTER_DB_V1');
          db.init();
          showToast('Data reset to original seed state!', 'info');
          window.location.hash = '#/dashboard';
        }
      };
    }
  }, 0);

  return container;
}
