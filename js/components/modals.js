/* ==========================================================================
   GlobeTrotter Reusable Modal Dialogs
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from './toast.js';

export function createModalHTML() {
  return `
    <div id="app-modal-overlay" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 id="modal-title-text" class="modal-title">Modal Title</h3>
          <button id="modal-close-btn" class="btn btn-ghost btn-icon"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="modal-body-content" class="modal-body"></div>
        <div id="modal-footer-content" class="modal-footer"></div>
      </div>
    </div>
  `;
}

export function openModal(title, bodyHTML, footerHTML) {
  const overlay = document.getElementById('app-modal-overlay');
  const titleText = document.getElementById('modal-title-text');
  const body = document.getElementById('modal-body-content');
  const footer = document.getElementById('modal-footer-content');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay) return;

  titleText.textContent = title;
  body.innerHTML = bodyHTML;
  footer.innerHTML = footerHTML || '';

  overlay.classList.add('active');

  const closeFn = () => overlay.classList.remove('active');
  closeBtn.onclick = closeFn;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeFn();
  };
}

export function closeModal() {
  const overlay = document.getElementById('app-modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

export function openAddCityModal(tripId, onComplete) {
  const cities = db.getCities();
  const tripStops = db.getTripStops(tripId);
  const currentCityIds = tripStops.map(s => s.city_id);

  const bodyHTML = `
    <div class="form-group">
      <label class="form-label">Search Cities</label>
      <input type="text" id="city-modal-search" class="form-input" placeholder="Type city or country name...">
    </div>
    <div id="city-modal-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; max-height: 380px; overflow-y: auto;">
      ${cities.map(c => {
        const isAdded = currentCityIds.includes(c.id);
        return `
          <div class="card" style="padding: 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
            <img src="${c.image}" alt="${c.name}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;">
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 600; font-size: 0.9rem;">${c.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${c.country}</div>
            </div>
            <button class="btn btn-sm ${isAdded ? 'btn-outline' : 'btn-primary'}" ${isAdded ? 'disabled' : ''} onclick="window.handleAddCityClick('${tripId}', '${c.id}')">
              ${isAdded ? 'Added' : 'Add'}
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;

  openModal('Add Destination City', bodyHTML, `<button class="btn btn-outline" onclick="window.closeAppModal()">Close</button>`);

  window.handleAddCityClick = (tId, cId) => {
    db.addCityToTrip(tId, cId);
    showToast('City added to trip!', 'success');
    closeModal();
    if (onComplete) onComplete();
  };

  window.closeAppModal = closeModal;
}

export function openAddActivityModal(stopId, date, onComplete) {
  const stop = db.data.tripStops.find(s => s.id === stopId);
  if (!stop) return;
  const availableActivities = db.getActivities(stop.city_id);

  const bodyHTML = `
    <div style="margin-bottom: 1.25rem; font-size: 0.875rem; color: var(--text-muted);">
      Adding activity for date: <strong>${date || stop.arrival_date}</strong>
    </div>

    <div class="tabs" style="margin-bottom: 1rem;">
      <button class="tab-btn active" id="tab-opt-catalog" onclick="window.switchActTab('catalog')">From Catalog</button>
      <button class="tab-btn" id="tab-opt-custom" onclick="window.switchActTab('custom')">Custom Activity</button>
    </div>

    <div id="act-catalog-panel" style="display: grid; gap: 0.875rem; max-height: 320px; overflow-y: auto;">
      ${availableActivities.map(act => `
        <div class="card" style="padding: 0.875rem; display: flex; align-items: center; gap: 1rem;">
          <img src="${act.image}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 0.9rem;">${act.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${act.category} • ${act.duration} • $${act.estimated_cost}</div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="window.handleAddActivityClick('${stopId}', '${act.id}', '${date}')">
            Add
          </button>
        </div>
      `).join('')}
    </div>

    <div id="act-custom-panel" style="display: none; flex-direction: column; gap: 1rem;">
      <div class="form-group">
        <label class="form-label">Activity Name</label>
        <input type="text" id="custom-act-name" class="form-input" placeholder="e.g. Seine River Dinner Cruise">
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Start Time</label>
          <input type="time" id="custom-act-time" class="form-input" value="10:00">
        </div>
        <div class="form-group">
          <label class="form-label">Estimated Cost ($)</label>
          <input type="number" id="custom-act-cost" class="form-input" value="40">
        </div>
      </div>
    </div>
  `;

  openModal('Add Activity', bodyHTML, `
    <button class="btn btn-outline" onclick="window.closeAppModal()">Cancel</button>
    <button id="modal-submit-act-btn" class="btn btn-primary" style="display: none;" onclick="window.handleCustomActSubmit('${stopId}', '${date}')">Save Activity</button>
  `);

  window.switchActTab = (tab) => {
    const catalog = document.getElementById('act-catalog-panel');
    const custom = document.getElementById('act-custom-panel');
    const btnSubmit = document.getElementById('modal-submit-act-btn');
    document.getElementById('tab-opt-catalog').classList.toggle('active', tab === 'catalog');
    document.getElementById('tab-opt-custom').classList.toggle('active', tab === 'custom');

    if (tab === 'catalog') {
      catalog.style.display = 'grid';
      custom.style.display = 'none';
      btnSubmit.style.display = 'none';
    } else {
      catalog.style.display = 'none';
      custom.style.display = 'flex';
      btnSubmit.style.display = 'inline-flex';
    }
  };

  window.handleAddActivityClick = (sId, aId, d) => {
    db.addActivityToItinerary(sId, aId, d);
    showToast('Activity added!', 'success');
    closeModal();
    if (onComplete) onComplete();
  };

  window.handleCustomActSubmit = (sId, d) => {
    const name = document.getElementById('custom-act-name').value;
    const time = document.getElementById('custom-act-time').value;
    const cost = document.getElementById('custom-act-cost').value;

    if (!name) {
      showToast('Please enter an activity name', 'warning');
      return;
    }

    // Create a temporary activity in city
    const actId = `act-custom-${Date.now()}`;
    db.data.activities.push({
      id: actId,
      city_id: stop.city_id,
      name: name,
      category: 'Sightseeing',
      description: 'Custom activity',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
      duration: '2 hrs',
      estimated_cost: parseFloat(cost) || 0,
      rating: 5.0
    });

    db.addActivityToItinerary(sId, actId, d, time, cost);
    showToast('Custom activity added!', 'success');
    closeModal();
    if (onComplete) onComplete();
  };

  window.closeAppModal = closeModal;
}

export function openShareModal(trip) {
  const shareUrl = `${window.location.origin}${window.location.pathname}#/trip/${trip.share_id}`;
  
  const bodyHTML = `
    <div style="text-align: center; padding: 1rem 0;">
      <div style="width: 60px; height: 60px; background: var(--primary-light); color: var(--primary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1rem auto;">
        <i class="fa-solid fa-share-nodes"></i>
      </div>
      <h4 style="margin-bottom: 0.5rem;">Share Itinerary with Friends</h4>
      <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
        Anyone with this public link can view your itinerary, dates, and budget details in read-only mode.
      </p>
      
      <div style="display: flex; gap: 0.5rem; background: var(--bg-main); padding: 0.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <input type="text" id="share-url-input" class="form-input" value="${shareUrl}" readonly style="border: none; background: transparent; font-size: 0.85rem;">
        <button class="btn btn-primary btn-sm" onclick="window.copyShareLink()">
          <i class="fa-solid fa-copy"></i> Copy Link
        </button>
      </div>
    </div>
  `;

  openModal('Share Itinerary', bodyHTML, `<button class="btn btn-outline" onclick="window.closeAppModal()">Close</button>`);

  window.copyShareLink = () => {
    const input = document.getElementById('share-url-input');
    input.select();
    navigator.clipboard.writeText(shareUrl);
    showToast('Public itinerary link copied to clipboard!', 'success');
  };

  window.closeAppModal = closeModal;
}
