/* ==========================================================================
   GlobeTrotter SVG / Canvas Chart Rendering Engine
   ========================================================================== */

export function renderBudgetDonutChart(containerId, breakdown) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categories = Object.keys(breakdown);
  const values = Object.values(breakdown);
  const total = values.reduce((a, b) => a + b, 0);

  if (total === 0) {
    container.innerHTML = `<div class="empty-state"><p>No expenses logged yet</p></div>`;
    return;
  }

  const colors = {
    Transportation: '#3b82f6',
    Accommodation: '#f59e0b',
    Activities: '#10b981',
    Meals: '#ff5a5f',
    Miscellaneous: '#8b5cf6'
  };

  let cumulativeAngle = 0;
  const slices = categories.map(cat => {
    const val = breakdown[cat] || 0;
    const percentage = val / total;
    const angle = percentage * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return { category: cat, value: val, percentage, startAngle, angle, color: colors[cat] || '#94a3b8' };
  });

  // Generate SVG Donut
  const size = 180;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const svgPaths = slices.map(s => {
    const dashArray = `${(s.percentage * circumference)} ${circumference}`;
    const dashOffset = -offset;
    offset += s.percentage * circumference;

    return `
      <circle 
        cx="${center}" 
        cy="${center}" 
        r="${radius}" 
        fill="transparent" 
        stroke="${s.color}" 
        stroke-width="${strokeWidth}"
        stroke-dasharray="${dashArray}"
        stroke-dashoffset="${dashOffset}"
        transform="rotate(-90 ${center} ${center})"
        style="transition: all 0.5s ease;"
      />
    `;
  }).join('');

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 1.5rem;">
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          ${svgPaths}
        </svg>
        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total</span>
          <span style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--text-main);">$${total.toLocaleString()}</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 160px;">
        ${slices.map(s => `
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${s.color}; display: inline-block;"></span>
              <span>${s.category}</span>
            </div>
            <strong style="font-family: var(--font-heading);">$${s.value.toLocaleString()}</strong>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderDailySpendingBarChart(containerId, dailyData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const days = Object.keys(dailyData);
  const amounts = Object.values(dailyData);
  const maxAmount = Math.max(...amounts, 100);

  container.innerHTML = `
    <div style="display: flex; align-items: flex-end; gap: 0.75rem; height: 160px; padding-top: 1.5rem; border-bottom: 1px solid var(--border-color);">
      ${days.map(d => {
        const val = dailyData[d] || 0;
        const heightPct = Math.max(8, Math.round((val / maxAmount) * 100));
        return `
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; height: 100%; justify-content: flex-end;">
            <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-muted);">$${val}</span>
            <div style="width: 100%; max-width: 32px; height: ${heightPct}%; background: linear-gradient(180deg, var(--primary), #e0484d); border-radius: 4px 4px 0 0; transition: height 0.4s ease;" title="${d}: $${val}"></div>
            <span style="font-size: 0.7rem; color: var(--text-subtle); white-space: nowrap;">${d}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
