/* ==========================================================================
   GlobeTrotter Auth & Landing View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';

export function renderAuthView() {
  const container = document.createElement('div');
  container.className = 'auth-page';

  container.innerHTML = `
    <div class="auth-hero-side">
      <div class="auth-hero-overlay"></div>
      <div class="auth-hero-content">
        <div style="display: flex; align-items: center; gap: 0.75rem; font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin-bottom: 3rem;">
          <div style="width: 40px; height: 40px; background: var(--primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
            <i class="fa-solid fa-plane-departure"></i>
          </div>
          <span>GlobeTrotter</span>
        </div>

        <h1 class="auth-hero-title">Plan Less.<br>Explore More.</h1>
        <p class="auth-hero-subtitle">Visual, interactive, multi-city trip planning powered by intelligent discovery and automated budget tracking.</p>
      </div>

      <div style="position: relative; z-index: 10; font-size: 0.85rem; color: #94a3b8;">
        © 2026 GlobeTrotter Inc. • Hackathon Edition
      </div>
    </div>

    <div class="auth-form-side">
      <div class="auth-box">
        <div class="auth-logo">
          <div style="width: 38px; height: 38px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
            <i class="fa-solid fa-earth-americas"></i>
          </div>
          <span>GlobeTrotter</span>
        </div>

        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-subtitle">Sign in to access your multi-city itineraries and travel plans.</p>

        <!-- Demo Login Banner for Judges -->
        <div class="alert alert-info" style="margin-bottom: 1.5rem;">
          <i class="fa-solid fa-wand-magic-sparkles" style="font-size: 1.2rem; margin-top: 2px;"></i>
          <div>
            <strong>Hackathon Judge Demo Mode</strong>
            <p style="font-size: 0.8rem; margin-top: 0.25rem;">Skip sign in to enter the live prototype instantly with realistic pre-loaded trips.</p>
            <button id="btn-demo-login" class="btn btn-primary btn-sm" style="margin-top: 0.5rem; width: 100%;">
              <i class="fa-solid fa-bolt"></i> Instant Demo Login (Meet)
            </button>
          </div>
        </div>

        <form id="auth-form">
          <div class="form-group">
            <label class="form-label">Email address</label>
            <input type="email" id="auth-email" class="form-input" value="meet@globetrotter.io" required>
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="form-label">Password</label>
              <a href="#" id="link-forgot" style="font-size: 0.8rem; color: var(--primary); font-weight: 500;">Forgot password?</a>
            </div>
            <input type="password" id="auth-password" class="form-input" value="••••••••" required>
          </div>

          <button type="submit" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">
            Sign In
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">
          Don't have an account? <a href="#" id="link-signup" style="color: var(--primary); font-weight: 600;">Sign up</a>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  setTimeout(() => {
    const demoBtn = container.querySelector('#btn-demo-login');
    if (demoBtn) {
      demoBtn.onclick = () => {
        db.loginDemoUser();
        showToast('Logged in as Meet (Demo User)', 'success');
        window.location.hash = '#/dashboard';
      };
    }

    const form = container.querySelector('#auth-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        db.loginDemoUser();
        showToast('Welcome back, Meet!', 'success');
        window.location.hash = '#/dashboard';
      };
    }

    const signupLink = container.querySelector('#link-signup');
    if (signupLink) {
      signupLink.onclick = (e) => {
        e.preventDefault();
        showToast('Sign up form submitted! Logging in demo user...', 'info');
        db.loginDemoUser();
        window.location.hash = '#/dashboard';
      };
    }

    const forgotLink = container.querySelector('#link-forgot');
    if (forgotLink) {
      forgotLink.onclick = (e) => {
        e.preventDefault();
        showToast('Password reset link sent to your email!', 'info');
      };
    }
  }, 0);

  return container;
}
