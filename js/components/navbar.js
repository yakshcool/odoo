/* ==========================================================================
   GlobeTrotter Sidebar Navigation Component
   ========================================================================== */

import { db } from '../db.js';

export function renderNavbar(activeRoute) {
  const user = db.getCurrentUser();

  const navItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'fa-compass' },
    { route: 'my-trips', label: 'My Trips', icon: 'fa-suitcase-rolling' },
    { route: 'discover-cities', label: 'Explore Cities', icon: 'fa-earth-americas' },
    { route: 'discover-activities', label: 'Activities', icon: 'fa-ticket' },
    { route: 'calendar', label: 'Calendar', icon: 'fa-calendar-days' },
    { route: 'profile', label: 'Profile', icon: 'fa-user' },
    { route: 'admin', label: 'Analytics', icon: 'fa-chart-pie' }
  ];

  const desktopSidebar = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon"><i class="fa-solid fa-plane-departure"></i></div>
        <span class="sidebar-logo-text">GlobeTrotter</span>
      </div>

      <nav class="sidebar-nav">
        ${navItems.map(item => `
          <a href="#/${item.route}" class="nav-item ${activeRoute === item.route ? 'active' : ''}">
            <i class="fa-solid ${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>

      <div class="sidebar-user">
        <img src="${user.profile_image}" alt="${user.name}" class="user-avatar">
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-email">${user.email}</div>
        </div>
      </div>
    </aside>
  `;

  const mobileNav = `
    <nav class="mobile-bottom-nav">
      ${navItems.slice(0, 5).map(item => `
        <a href="#/${item.route}" class="mobile-nav-item ${activeRoute === item.route ? 'active' : ''}">
          <i class="fa-solid ${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      `).join('')}
    </nav>
  `;

  return { desktopSidebar, mobileNav };
}
