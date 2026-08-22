/* ==========================================================================
   GlobeTrotter Profile & Supabase Cloud Connection Manager View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';
import { getSupabaseConfig, saveSupabaseConfig, getSupabase } from '../supabase.js';

export function renderProfileView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  const user = db.getCurrentUser();
  const savedDestinations = db.data.savedDestinations.map(sd => db.getCityById(sd.city_id)).filter(Boolean);
  const sbConfig = getSupabaseConfig();

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Account & Cloud Settings</h1>
      <p style="color: var(--text-muted);">Manage your profile credentials and Supabase database configuration</p>
    </div>

    <div style="display: grid; grid-template-columns: 320px 1fr; gap: 2rem; align-items: start;">
      
      <!-- Profile Card Sidebar -->
      <div class="card" style="padding: 2rem; text-align: center;">
        <img src="${user ? user.profile_image : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" alt="${user ? user.name : 'User'}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem auto; border: 3px solid var(--primary);">
        <h2 style="font-size: 1.35rem; margin-bottom: 0.25rem;">${user ? user.name : 'Guest User'}</h2>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">${user ? user.email : 'guest@globetrotter.io'}</p>
        <span class="badge badge-success"><i class="fa-solid fa-bolt"></i> Supabase Cloud Active</span>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); text-align: left; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Member Since</span>
            <strong>Jan 2026</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Language</span>
            <strong>${user ? user.language || 'English (US)' : 'English'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Currency</span>
            <strong>${user ? user.currency || 'USD ($)' : 'USD ($)'}</strong>
          </div>
        </div>
      </div>

      <!-- Settings & Supabase Configuration Right Side -->
      <div>
        
        <!-- Supabase Cloud Connection Panel -->
        <div class="card" style="padding: 1.5rem; margin-bottom: 2rem; border-left: 4px solid #10b981;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-database" style="color: #10b981;"></i> Supabase Database Integration
            </h3>
            <span class="badge badge-success">Connected</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Your GlobeTrotter account authentication and multi-city trip data are connected to Supabase cloud storage.
          </p>

          <form id="supabase-config-form">
            <div class="form-group">
              <label class="form-label">Supabase Project URL</label>
              <input type="text" id="sb-url-input" class="form-input" value="${sbConfig.url}">
            </div>
            <div class="form-group">
              <label class="form-label">Supabase API Anon/Publishable Key</label>
              <input type="text" id="sb-key-input" class="form-input" value="${sbConfig.key}">
            </div>
            <button type="submit" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-floppy-disk"></i> Save Supabase Settings
            </button>
          </form>
        </div>

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
              <input type="text" id="prof-name" class="form-input" value="${user ? user.name : 'Meet'}">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="prof-email" class="form-input" value="${user ? user.email : 'meet@globetrotter.io'}">
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
                <i class="fa-solid fa-rotate-left"></i> Reset Seed Data
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;

  setTimeout(() => {
    const sbForm = container.querySelector('#supabase-config-form');
    if (sbForm) {
      sbForm.onsubmit = (e) => {
        e.preventDefault();
        const url = container.querySelector('#sb-url-input').value;
        const key = container.querySelector('#sb-key-input').value;
        saveSupabaseConfig(url, key);
        showToast('Supabase project configuration updated!', 'success');
      };
    }

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
          localStorage.removeItem('GLOBETROTTER_DB_V2');
          db.init();
          showToast('Data reset to original state!', 'info');
          window.location.hash = '#/dashboard';
        }
      };
    }
  }, 0);

  return container;
}
