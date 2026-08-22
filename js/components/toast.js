/* ==========================================================================
   GlobeTrotter Toast Notification System
   ========================================================================== */

export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
    error: 'fa-circle-xmark'
  };

  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || 'fa-circle-info'}" style="font-size: 1.2rem; color: var(--${type === 'error' ? 'primary' : type})"></i>
    <div style="flex: 1; font-weight: 500; font-size: 0.875rem;">${message}</div>
    <button onclick="this.parentElement.remove()" style="color: var(--text-subtle); padding: 0.2rem;"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
