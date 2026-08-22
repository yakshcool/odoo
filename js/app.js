/* ==========================================================================
   GlobeTrotter SPA Main Application & Client Router (Auth Enforcement)
   ========================================================================== */

import { db } from './db.js';
import { renderNavbar } from './components/navbar.js';
import { createModalHTML } from './components/modals.js';
import { renderChatbotWidget } from './components/chatbot.js';
import { showToast } from './components/toast.js';
import { initSupabase } from './supabase.js';

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
    // Initialize Supabase Client
    initSupabase();

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
    const hash = window.location.hash || '#/auth';
    const parts = hash.replace('#/', '').split('/');
    const mainRoute = parts[0] || 'auth';
    const param = parts[1] || null;

    // Public share route exception (viewable by anyone)
    if (mainRoute === 'trip' && param) {
      this.renderFullPage(renderSharedItineraryView(param));
      return;
    }

    // Auth screen route
    if (mainRoute === 'auth') {
      this.renderFullPage(renderAuthView());
      return;
    }

    // Require Auth for all protected features: create-trip, my-trips, itinerary, budget, etc.
    const user = db.getCurrentUser();
    if (!user) {
      showToast('Please sign in or create an account to start planning trips.', 'info');
      window.location.hash = '#/auth';
      this.renderFullPage(renderAuthView());
      return;
    }

    // Shell Layout for Logged-In Users
    this.renderAppShell(mainRoute, param);
  }

  renderFullPage(viewElement) {
    this.appRoot.innerHTML = '';
    this.appRoot.appendChild(viewElement);
    
    // Remove chatbot widget if on full page auth
    const botWidget = document.getElementById('ai-chatbot-widget');
    if (botWidget && window.location.hash.includes('auth')) {
      botWidget.style.display = 'none';
    }
  }

  renderAppShell(route, param) {
    const user = db.getCurrentUser();
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
              <img src="${user ? user.profile_image : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
              <span style="font-weight: 600; font-size: 0.875rem;">${user ? user.name : 'Account'}</span>
            </a>
            <button id="btn-logout-header" class="btn btn-outline btn-sm" title="Sign Out">
              <i class="fa-solid fa-right-from-bracket"></i> Sign Out
            </button>
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

    // Mount AI Chatbot Widget globally
    let botWidget = document.getElementById('ai-chatbot-widget');
    if (!botWidget) {
      botWidget = renderChatbotWidget();
      document.body.appendChild(botWidget);
    }
    botWidget.style.display = 'block';

    // Theme Toggle Handler
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = `<i class="fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}"></i>`;
      };
    }

    // Logout Handler
    const logoutBtn = document.getElementById('btn-logout-header');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        db.logout();
        showToast('Signed out successfully.', 'info');
        window.location.hash = '#/auth';
      };
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.globeTrotterApp = new GlobeTrotterApp();
});
