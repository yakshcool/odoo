/* ==========================================================================
   GlobeTrotter City Discovery & Search View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';

export function renderCityDiscoveryView() {
  const container = document.createElement('div');
  container.className = 'content-container';

  let searchQuery = '';
  let selectedRegion = 'All';
  let selectedBudget = 'All';

  const cities = db.getCities();
  const trips = db.getTrips();

  function render() {
    const filtered = cities.filter(c => {
      const matchQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion = selectedRegion === 'All' || c.region === selectedRegion;
      const matchBudget = selectedBudget === 'All' || c.cost_index === selectedBudget;
      return matchQuery && matchRegion && matchBudget;
    });

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Discover Destinations</h1>
        <p style="color: var(--text-muted);">Explore world-renowned cities and add them directly to your travel itineraries</p>
      </div>

      <!-- Search & Filters Bar -->
      <div class="card" style="padding: 1.25rem; margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;">
        <div style="flex: 1; min-width: 260px;">
          <input type="text" id="city-search-input" class="form-input" placeholder="Search by city or country name..." value="${searchQuery}">
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <select id="region-filter" class="form-select" style="width: 150px;">
            <option value="All">All Regions</option>
            <option value="Europe" ${selectedRegion === 'Europe' ? 'selected' : ''}>Europe</option>
            <option value="Asia" ${selectedRegion === 'Asia' ? 'selected' : ''}>Asia</option>
            <option value="Middle East" ${selectedRegion === 'Middle East' ? 'selected' : ''}>Middle East</option>
            <option value="North America" ${selectedRegion === 'North America' ? 'selected' : ''}>North America</option>
          </select>

          <select id="budget-filter" class="form-select" style="width: 140px;">
            <option value="All">All Budgets</option>
            <option value="$$" ${selectedBudget === '$$' ? 'selected' : ''}>$$ (Moderate)</option>
            <option value="$$$" ${selectedBudget === '$$$' ? 'selected' : ''}>$$$ (High)</option>
            <option value="$$$$" ${selectedBudget === '$$$$' ? 'selected' : ''}>$$$$ (Luxury)</option>
          </select>
        </div>
      </div>

      <!-- City Cards Grid -->
      <div class="discovery-grid">
        ${filtered.map(c => `
          <div class="destination-card">
            <img src="${c.image}" alt="${c.name}" class="destination-img">
            <div class="destination-overlay">
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span class="badge badge-accent">${c.cost_index}</span>
                <span class="badge badge-success">★ ${c.popularity}</span>
              </div>
              <h3 style="font-size: 1.4rem; color: #ffffff;">${c.name}</h3>
              <p style="font-size: 0.85rem; color: #e2e8f0; margin-bottom: 0.5rem;">${c.country} • ${c.region}</p>
              <p style="font-size: 0.75rem; color: #cbd5e1; line-clamp: 2; margin-bottom: 1rem;">${c.description}</p>
              
              <button class="btn btn-primary btn-sm" onclick="window.handleAddCityToTripPrompt('${c.id}')">
                <i class="fa-solid fa-plus"></i> Add to Trip
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const searchInput = container.querySelector('#city-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        render();
      };
    }

    const regionSelect = container.querySelector('#region-filter');
    if (regionSelect) {
      regionSelect.onchange = (e) => {
        selectedRegion = e.target.value;
        render();
      };
    }

    const budgetSelect = container.querySelector('#budget-filter');
    if (budgetSelect) {
      budgetSelect.onchange = (e) => {
        selectedBudget = e.target.value;
        render();
      };
    }

    window.handleAddCityToTripPrompt = (cityId) => {
      if (trips.length === 0) {
        showToast('Please create a trip first!', 'warning');
        window.location.hash = '#/create-trip';
        return;
      }

      // Add to first trip by default or open selection prompt
      const targetTrip = trips[0];
      db.addCityToTrip(targetTrip.id, cityId);
      const c = db.getCityById(cityId);
      showToast(`Added ${c.name} to "${targetTrip.name}"!`, 'success');
    };
  }

  render();
  return container;
}
