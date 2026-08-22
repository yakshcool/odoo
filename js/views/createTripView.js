/* ==========================================================================
   GlobeTrotter 3-Step Create Trip Wizard View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';

export function renderCreateTripView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  let currentStep = 1;
  const formData = {
    name: '',
    start_date: '2026-09-15',
    end_date: '2026-09-22',
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    cities: [],
    budget_level: 'Moderate',
    interests: [],
    travel_style: 'Solo'
  };

  const allCities = db.getCities();

  function updateWizardUI() {
    container.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Plan Your Next Adventure</h1>
          <p style="color: var(--text-muted);">Step ${currentStep} of 3 • Build a customized multi-city itinerary</p>
        </div>

        <!-- Step Indicator Bar -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${currentStep >= 1 ? 'var(--primary)' : 'var(--border-color)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
            <span style="font-weight: 600; font-size: 0.9rem; color: ${currentStep >= 1 ? 'var(--text-main)' : 'var(--text-subtle)'};">Details</span>
          </div>
          <div style="width: 60px; height: 2px; background: ${currentStep >= 2 ? 'var(--primary)' : 'var(--border-color)'};"></div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${currentStep >= 2 ? 'var(--primary)' : 'var(--border-color)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
            <span style="font-weight: 600; font-size: 0.9rem; color: ${currentStep >= 2 ? 'var(--text-main)' : 'var(--text-subtle)'};">Destinations</span>
          </div>
          <div style="width: 60px; height: 2px; background: ${currentStep >= 3 ? 'var(--primary)' : 'var(--border-color)'};"></div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${currentStep === 3 ? 'var(--primary)' : 'var(--border-color)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
            <span style="font-weight: 600; font-size: 0.9rem; color: ${currentStep === 3 ? 'var(--text-main)' : 'var(--text-subtle)'};">Preferences</span>
          </div>
        </div>

        <!-- Wizard Card Container -->
        <div class="card" style="padding: 2.5rem;">
          ${renderStepContent()}

          <!-- Navigation Controls -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
            ${currentStep > 1 ? `
              <button id="btn-wiz-prev" class="btn btn-outline"><i class="fa-solid fa-arrow-left"></i> Back</button>
            ` : `<div></div>`}
            
            ${currentStep < 3 ? `
              <button id="btn-wiz-next" class="btn btn-primary">Next: ${currentStep === 1 ? 'Add Destinations' : 'Preferences'} <i class="fa-solid fa-arrow-right"></i></button>
            ` : `
              <button id="btn-wiz-submit" class="btn btn-primary btn-lg"><i class="fa-solid fa-wand-magic-sparkles"></i> Create Trip & Build Itinerary</button>
            `}
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderStepContent() {
    if (currentStep === 1) {
      return `
        <h2 style="font-size: 1.35rem; margin-bottom: 1.5rem;">Step 1: Trip Basic Details</h2>
        <div class="form-group">
          <label class="form-label">Trip Name</label>
          <input type="text" id="wiz-name" class="form-input" placeholder="e.g. Autumn in Japan & Korea" value="${formData.name}">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input type="date" id="wiz-start" class="form-input" value="${formData.start_date}">
          </div>
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input type="date" id="wiz-end" class="form-input" value="${formData.end_date}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description / Travel Goals</label>
          <textarea id="wiz-desc" class="form-textarea" placeholder="Brief notes about what you want to experience...">${formData.description}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Cover Image URL</label>
          <input type="url" id="wiz-cover" class="form-input" value="${formData.cover_image}">
        </div>
      `;
    }

    if (currentStep === 2) {
      return `
        <h2 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Step 2: Add Destinations & Cities</h2>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">Select cities you plan to visit in order of travel.</p>

        <div style="margin-bottom: 1.5rem;">
          <label class="form-label">Selected Cities (${formData.cities.length}):</label>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; min-height: 40px; padding: 0.75rem; background: var(--bg-main); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            ${formData.cities.length === 0 ? `<span style="color: var(--text-subtle); font-size: 0.85rem;">No cities selected yet. Click cities below to add.</span>` : ''}
            ${formData.cities.map(cId => {
              const c = allCities.find(x => x.id === cId);
              return `
                <span class="badge badge-primary" style="padding: 0.4rem 0.75rem; font-size: 0.85rem;">
                  ${c ? c.name : cId} 
                  <i class="fa-solid fa-xmark" style="cursor: pointer; margin-left: 0.35rem;" onclick="window.removeWizCity('${cId}')"></i>
                </span>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; max-height: 320px; overflow-y: auto; padding-right: 0.5rem;">
          ${allCities.map(c => {
            const selected = formData.cities.includes(c.id);
            return `
              <div class="card" style="padding: 0.75rem; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; border-color: ${selected ? 'var(--primary)' : 'var(--border-color)'};" onclick="window.toggleWizCity('${c.id}')">
                <img src="${c.image}" alt="${c.name}" style="width: 55px; height: 55px; border-radius: var(--radius-sm); object-fit: cover;">
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 600; font-size: 0.9rem;">${c.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.country}</div>
                  <div style="font-size: 0.7rem; color: var(--accent); font-weight: 600;">${c.cost_index} • ★ ${c.popularity}</div>
                </div>
                <input type="checkbox" ${selected ? 'checked' : ''} style="accent-color: var(--primary);">
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (currentStep === 3) {
      return `
        <h2 style="font-size: 1.35rem; margin-bottom: 1.5rem;">Step 3: Travel Preferences & Style</h2>

        <div class="form-group">
          <label class="form-label">Target Budget Level</label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
            ${['Budget', 'Moderate', 'Luxury', 'Ultra'].map(b => `
              <button type="button" class="btn ${formData.budget_level === b ? 'btn-primary' : 'btn-outline'}" onclick="window.setWizBudget('${b}')">
                ${b}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Travel Style</label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
            ${['Solo', 'Couple', 'Family', 'Friends'].map(s => `
              <button type="button" class="btn ${formData.travel_style === s ? 'btn-secondary' : 'btn-outline'}" onclick="window.setWizStyle('${s}')">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  function attachEvents() {
    window.toggleWizCity = (cId) => {
      const idx = formData.cities.indexOf(cId);
      if (idx > -1) formData.cities.splice(idx, 1);
      else formData.cities.push(cId);
      updateWizardUI();
    };

    window.removeWizCity = (cId) => {
      formData.cities = formData.cities.filter(x => x !== cId);
      updateWizardUI();
    };

    window.setWizBudget = (b) => {
      formData.budget_level = b;
      updateWizardUI();
    };

    window.setWizStyle = (s) => {
      formData.travel_style = s;
      updateWizardUI();
    };

    const prevBtn = container.querySelector('#btn-wiz-prev');
    if (prevBtn) {
      prevBtn.onclick = () => {
        saveStepInputs();
        currentStep--;
        updateWizardUI();
      };
    }

    const nextBtn = container.querySelector('#btn-wiz-next');
    if (nextBtn) {
      nextBtn.onclick = () => {
        saveStepInputs();
        if (currentStep === 1 && !formData.name) {
          showToast('Please enter a trip name', 'warning');
          return;
        }
        if (currentStep === 2 && formData.cities.length === 0) {
          showToast('Please select at least one city destination', 'warning');
          return;
        }
        currentStep++;
        updateWizardUI();
      };
    }

    const submitBtn = container.querySelector('#btn-wiz-submit');
    if (submitBtn) {
      submitBtn.onclick = () => {
        saveStepInputs();
        const newTrip = db.createTrip(formData);
        showToast(`Trip "${newTrip.name}" created successfully!`, 'success');
        window.location.hash = `#/itinerary/${newTrip.id}`;
      };
    }
  }

  function saveStepInputs() {
    if (currentStep === 1) {
      const nameEl = container.querySelector('#wiz-name');
      const startEl = container.querySelector('#wiz-start');
      const endEl = container.querySelector('#wiz-end');
      const descEl = container.querySelector('#wiz-desc');
      const coverEl = container.querySelector('#wiz-cover');

      if (nameEl) formData.name = nameEl.value;
      if (startEl) formData.start_date = startEl.value;
      if (endEl) formData.end_date = endEl.value;
      if (descEl) formData.description = descEl.value;
      if (coverEl) formData.cover_image = coverEl.value;
    }
  }

  updateWizardUI();
  return container;
}
