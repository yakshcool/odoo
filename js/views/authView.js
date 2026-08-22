/* ==========================================================================
   GlobeTrotter Auth & Landing View (with Supabase Auth)
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';
import { supabaseSignIn, supabaseSignUp } from '../supabase.js';

export function renderAuthView() {
  const container = document.createElement('div');
  container.className = 'auth-page';

  let isSignUpMode = false;

  function renderForm() {
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
          <p class="auth-hero-subtitle">Visual, interactive, multi-city trip planning powered by intelligent discovery and Supabase storage.</p>
        </div>

        <div style="position: relative; z-index: 10; font-size: 0.85rem; color: #94a3b8;">
          © 2026 GlobeTrotter Inc. • Supabase Connected
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

          <h2 class="auth-title">${isSignUpMode ? 'Create your account' : 'Welcome back'}</h2>
          <p class="auth-subtitle">${isSignUpMode ? 'Sign up to start planning multi-city itineraries.' : 'Sign in to access your saved trips and itineraries.'}</p>

          <!-- Demo Login Banner -->
          <div class="alert alert-info" style="margin-bottom: 1.5rem;">
            <i class="fa-solid fa-wand-magic-sparkles" style="font-size: 1.2rem; margin-top: 2px;"></i>
            <div>
              <strong>Quick Demo Mode</strong>
              <p style="font-size: 0.8rem; margin-top: 0.25rem;">Skip password entry to explore the live prototype instantly.</p>
              <button id="btn-demo-login" class="btn btn-primary btn-sm" style="margin-top: 0.5rem; width: 100%;">
                <i class="fa-solid fa-bolt"></i> Instant Demo Login (Meet)
              </button>
            </div>
          </div>

          <form id="auth-form">
            ${isSignUpMode ? `
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="auth-name" class="form-input" placeholder="e.g. Meet" required>
              </div>
            ` : ''}

            <div class="form-group">
              <label class="form-label">Email address</label>
              <input type="email" id="auth-email" class="form-input" value="meet@globetrotter.io" required>
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label class="form-label">Password</label>
                ${!isSignUpMode ? `<a href="#" id="link-forgot" style="font-size: 0.8rem; color: var(--primary); font-weight: 500;">Forgot password?</a>` : ''}
              </div>
              <input type="password" id="auth-password" class="form-input" value="••••••••" required>
            </div>

            <button type="submit" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">
              ${isSignUpMode ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">
            ${isSignUpMode ? 'Already have an account?' : "Don't have an account?"} 
            <a href="#" id="link-toggle-mode" style="color: var(--primary); font-weight: 600;">
              ${isSignUpMode ? 'Sign in' : 'Sign up'}
            </a>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
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
      form.onsubmit = async (e) => {
        e.preventDefault();
        const email = container.querySelector('#auth-email').value;
        const password = container.querySelector('#auth-password').value;

        if (isSignUpMode) {
          const name = container.querySelector('#auth-name').value;
          const { user, error } = await supabaseSignUp(email, password, name);
          if (error) {
            showToast(error.message || 'Supabase signup note: Logging in demo user', 'info');
          } else {
            showToast('Account created with Supabase!', 'success');
          }
          db.loginDemoUser();
        } else {
          const { user, error } = await supabaseSignIn(email, password);
          if (error) {
            showToast('Supabase auth note: Logging in demo user session', 'info');
          } else {
            showToast('Signed in via Supabase!', 'success');
          }
          db.loginDemoUser();
        }

        window.location.hash = '#/dashboard';
      };
    }

    const toggleModeLink = container.querySelector('#link-toggle-mode');
    if (toggleModeLink) {
      toggleModeLink.onclick = (e) => {
        e.preventDefault();
        isSignUpMode = !isSignUpMode;
        renderForm();
      };
    }
  }

  renderForm();
  return container;
}
