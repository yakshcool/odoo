/* ==========================================================================
   GlobeTrotter SPA Main Application & Client Router
   ========================================================================== */

import { db } from './db.js';
import { renderNavbar } from './components/navbar.js';
import { createModalHTML } from './components/modals.js';
import { renderAuthView } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderCreateTripView } from './views/createTripView.js';
import { renderMyTripsView } from './views/myTripsView.js';
import { renderItineraryView } from './views/itineraryView.js';
import { renderCityDiscoveryView } from './views/cityDiscoveryView.js';
import { renderActivityDiscoveryView } from './views/activityDiscoveryView.js';
import { renderItineraryPresentationView } from './views/itineraryPresentationView.js';
import { renderBudgetView } from './views/budgetView.js';
import { renderCalendarView } from './views/calendarView.js';
import { renderSharedItineraryView } from './views/sharedItineraryView.js';
import { renderProfileView } from './views/profileView.js';
import { renderAdminView } from './views/adminView.js';

class GlobeTrotterApp {
  constructor() {
    this.appRoot = document.getElementById('app-root');
    this.init();
  }

  init() {
    // Inject modal base container once
    if (!document.getElementById('app-modal-overlay')) {
      document.body.insertAdjacentHTML('beforeend', createModalHTML());
    }

    // Bind hash change listener
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Initial route dispatch
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || '#/dashboard';
    const parts = hash.replace('#/', '').split('/');
    const mainRoute = parts[0] || 'dashboard';
    const param = parts[1] || null;

    // Public share route exception
    if (mainRoute === 'trip' && param) {
      this.renderFullPage(renderSharedItineraryView(param));
      return;
    }

    // Auth screen exception
    if (mainRoute === 'auth') {
      this.renderFullPage(renderAuthView());
      return;
    }

    // Default to Auth if no user state
    const user = db.getCurrentUser();
    if (!user && mainRoute !== 'auth') {
      window.location.hash = '#/auth';
      return;
    }

    // Shell Layout with Navigation
    this.renderAppShell(mainRoute, param);
  }

  renderFullPage(viewElement) {
    this.appRoot.innerHTML = '';
    this.appRoot.appendChild(viewElement);
  }

  renderAppShell(route, param) {
    const { desktopSidebar, mobileNav } = renderNavbar(route);

    this.appRoot.innerHTML = `
      ${desktopSidebar}
      <main class="main-wrapper">
        <header class="top-header">
          <div class="header-left">
            <h2 style="font-size: 1.2rem; text-transform: capitalize;">${route.replace('-', ' ')}</h2>
          </div>
          <div class="header-right">
            <button id="btn-theme-toggle" class="btn btn-outline btn-icon" title="Toggle Theme">
              <i class="fa-solid fa-moon"></i>
            </button>
            <a href="#/profile" class="btn btn-ghost btn-sm" style="gap: 0.5rem;">
              <img src="${db.getCurrentUser().profile_image}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
              <span style="font-weight: 600; font-size: 0.875rem;">${db.getCurrentUser().name}</span>
            </a>
          </div>
        </header>
        <div id="content-mount"></div>
      </main>
      ${mobileNav}
    `;

    // Mount target view
    const mountPoint = document.getElementById('content-mount');
    let viewElement;

    switch (route) {
      case 'dashboard':
        viewElement = renderDashboardView();
        break;
      case 'create-trip':
        viewElement = renderCreateTripView();
        break;
      case 'my-trips':
        viewElement = renderMyTripsView();
        break;
      case 'itinerary':
        viewElement = renderItineraryView(param || 'trip-1');
        break;
      case 'discover-cities':
        viewElement = renderCityDiscoveryView();
        break;
      case 'discover-activities':
        viewElement = renderActivityDiscoveryView();
        break;
      case 'trip-presentation':
        viewElement = renderItineraryPresentationView(param || 'trip-1');
        break;
      case 'budget':
        viewElement = renderBudgetView(param || 'trip-1');
        break;
      case 'calendar':
        viewElement = renderCalendarView();
        break;
      case 'profile':
        viewElement = renderProfileView();
        break;
      case 'admin':
        viewElement = renderAdminView();
        break;
      default:
        viewElement = renderDashboardView();
    }

    mountPoint.appendChild(viewElement);

    // Theme Toggle Handler
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = `<i class="fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}"></i>`;
      };
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.globeTrotterApp = new GlobeTrotterApp();
});
