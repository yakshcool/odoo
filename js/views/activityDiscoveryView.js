/* ==========================================================================
   GlobeTrotter Activity Discovery View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';

export function renderActivityDiscoveryView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  let currentCategory = 'All';
  let searchQuery = '';

  const activities = db.getActivities();
  const trips = db.getTrips();

  function render() {
    const categories = ['All', 'Sightseeing', 'Food', 'Culture', 'Adventure', 'Relaxation'];

    const filtered = activities.filter(act => {
      const matchCat = currentCategory === 'All' || act.category === currentCategory;
      const matchQuery = act.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         act.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Explore Activities & Experiences</h1>
        <p style="color: var(--text-muted);">Curated tours, culinary masterclasses, and attractions</p>
      </div>

      <!-- Search & Category Tabs -->
      <div style="margin-bottom: 2rem;">
        <div style="max-width: 450px; margin-bottom: 1.5rem;">
          <input type="text" id="act-search-input" class="form-input" placeholder="Search experiences, tours..." value="${searchQuery}">
        </div>

        <div class="tabs">
          ${categories.map(cat => `
            <button class="tab-btn ${currentCategory === cat ? 'active' : ''}" onclick="window.setActCategory('${cat}')">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Activity Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        ${filtered.map(act => {
          const city = db.getCityById(act.city_id);
          return `
            <div class="card card-hover" style="display: flex; flex-direction: column;">
              <div style="height: 180px; position: relative; overflow: hidden;">
                <img src="${act.image}" alt="${act.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <span class="badge badge-info" style="position: absolute; top: 1rem; left: 1rem;">${act.category}</span>
                <span class="badge badge-accent" style="position: absolute; top: 1rem; right: 1rem;">★ ${act.rating}</span>
              </div>

              <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">${act.name}</h3>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                    <i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${city ? city.name : 'Destination'} • ${act.duration}
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); line-clamp: 2; margin-bottom: 1rem;">${act.description}</p>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-color-light);">
                  <div>
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">Est. Cost</div>
                    <div style="font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; color: var(--primary);">$${act.estimated_cost}</div>
                  </div>

                  <button class="btn btn-primary btn-sm" onclick="window.handleAddActToTrip('${act.id}')">
                    <i class="fa-solid fa-plus"></i> Add to Itinerary
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    window.setActCategory = (cat) => {
      currentCategory = cat;
      render();
    };

    const searchInput = container.querySelector('#act-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        render();
      };
    }

    window.handleAddActToTrip = (actId) => {
      if (trips.length === 0) {
        showToast('Please create a trip first!', 'warning');
        window.location.hash = '#/create-trip';
        return;
      }

      const targetTrip = trips[0];
      const stops = db.getTripStops(targetTrip.id);
      const act = db.getActivityById(actId);

      // Match city stop or add to first stop
      let stop = stops.find(s => s.city_id === act.city_id) || stops[0];
      if (!stop) {
        stop = db.addCityToTrip(targetTrip.id, act.city_id);
      }

      db.addActivityToItinerary(stop.id, actId, stop.arrival_date);
      showToast(`Added "${act.name}" to "${targetTrip.name}"!`, 'success');
    };
  }

  render();
  return container;
}
