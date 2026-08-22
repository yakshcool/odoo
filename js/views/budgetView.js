/* ==========================================================================
   GlobeTrotter Trip Budget & Financial Dashboard View
   ========================================================================== */

import { db } from '../db.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modals.js';
import { renderBudgetDonutChart, renderDailySpendingBarChart } from '../components/charts.js';

export function renderBudgetView(tripId) {
  const container = document.createElement('div');
  container.className = 'content-container';

  let trip = db.getTripById(tripId);

  if (!trip) {
    container.innerHTML = `<div class="empty-state"><h2>Trip not found</h2></div>`;
    return container;
  }

  function updateView() {
    trip = db.getTripById(tripId);
    const expenses = db.getExpenses(trip.id);
    const totalDays = db.calculateDaysBetween(trip.start_date, trip.end_date);
    const itinActs = db.getItineraryActivitiesForTrip(trip.id);

    // Calculate breakdown
    const breakdown = {
      Transportation: 0,
      Accommodation: 0,
      Activities: 0,
      Meals: 0,
      Miscellaneous: 0
    };

    if (expenses.length > 0) {
      expenses.forEach(e => {
        if (breakdown[e.category] !== undefined) breakdown[e.category] += e.amount;
        else breakdown['Miscellaneous'] += e.amount;
      });
    } else {
      // Default estimation from itinerary activities
      let actSum = itinActs.reduce((acc, curr) => acc + (curr.custom_cost || 0), 0);
      breakdown.Activities = actSum;
      breakdown.Accommodation = Math.round(trip.budget * 0.45);
      breakdown.Transportation = Math.round(trip.budget * 0.20);
      breakdown.Meals = Math.round(trip.budget * 0.20);
      breakdown.Miscellaneous = Math.round(trip.budget * 0.15);
    }

    const totalEstCost = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const remainingBudget = trip.budget - totalEstCost;
    const isOverBudget = totalEstCost > trip.budget;

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 2rem; font-weight: 800;">Budget & Financial Breakdown</h1>
            <p style="color: var(--text-muted);">${trip.name} • Target Budget: <strong>$${trip.budget.toLocaleString()}</strong></p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button id="btn-add-expense" class="btn btn-primary">
              <i class="fa-solid fa-plus"></i> Add Expense Line
            </button>
            <a href="#/itinerary/${trip.id}" class="btn btn-outline">
              <i class="fa-solid fa-arrow-left"></i> Itinerary Builder
            </a>
          </div>
        </div>
      </div>

      ${isOverBudget ? `
        <div class="alert alert-warning">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.25rem;"></i>
          <div>
            <strong>Over Budget Warning:</strong> Your current estimated trip cost ($${totalEstCost.toLocaleString()}) exceeds target budget by $${Math.abs(remainingBudget).toLocaleString()}.
          </div>
        </div>
      ` : ''}

      <!-- Financial Metrics Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-light); color: var(--primary);">
            <i class="fa-solid fa-calculator"></i>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">ESTIMATED TOTAL</div>
            <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: ${isOverBudget ? 'var(--primary)' : 'var(--text-main)'};">
              $${totalEstCost.toLocaleString()}
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
            <i class="fa-solid fa-piggy-bank"></i>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">REMAINING BUDGET</div>
            <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: ${remainingBudget < 0 ? 'var(--primary)' : 'var(--success)'};">
              $${remainingBudget.toLocaleString()}
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--info-light); color: var(--info);">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">COST PER DAY</div>
            <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800;">
              $${Math.round(totalEstCost / (totalDays || 1))}/day
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-wrapper">
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1.25rem;">Expense Category Distribution</h3>
          <div id="donut-chart-container"></div>
        </div>

        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1.25rem;">Daily Spending Projection</h3>
          <div id="bar-chart-container"></div>
        </div>
      </div>

      <!-- Expenses Table Ledger -->
      <div class="card" style="padding: 1.5rem; margin-top: 1.5rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem;">Detailed Expense Items</h3>
        ${expenses.length === 0 ? `
          <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">No custom expense items logged yet. Default estimations shown above.</div>
        ` : `
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); text-align: left;">
                <th style="padding: 0.75rem;">Category</th>
                <th style="padding: 0.75rem;">Description</th>
                <th style="padding: 0.75rem;">Date</th>
                <th style="padding: 0.75rem; text-align: right;">Amount</th>
                <th style="padding: 0.75rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(e => `
                <tr style="border-bottom: 1px solid var(--border-color-light);">
                  <td style="padding: 0.75rem;"><span class="badge badge-info">${e.category}</span></td>
                  <td style="padding: 0.75rem; font-weight: 500;">${e.description}</td>
                  <td style="padding: 0.75rem; color: var(--text-muted);">${e.date}</td>
                  <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: var(--primary);">$${e.amount}</td>
                  <td style="padding: 0.75rem; text-align: right;">
                    <button class="btn btn-ghost btn-icon" style="color: var(--primary);" onclick="window.handleDeleteExpense('${e.id}')">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    `;

    attachEvents();

    setTimeout(() => {
      renderBudgetDonutChart('donut-chart-container', breakdown);

      // Generate daily spending sample
      const dailyData = {};
      for (let i = 1; i <= Math.min(totalDays, 10); i++) {
        dailyData[`Day ${i}`] = Math.round((totalEstCost / totalDays) * (0.8 + Math.random() * 0.4));
      }
      renderDailySpendingBarChart('bar-chart-container', dailyData);
    }, 100);
  }

  function attachEvents() {
    const addBtn = container.querySelector('#btn-add-expense');
    if (addBtn) {
      addBtn.onclick = () => {
        const bodyHTML = `
          <div class="form-group">
            <label class="form-label">Category</label>
            <select id="exp-cat" class="form-select">
              <option value="Transportation">Transportation</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Activities">Activities</option>
              <option value="Meals">Meals</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" id="exp-desc" class="form-input" placeholder="e.g. Flight ticket or Michelin dinner">
          </div>
          <div class="form-group">
            <label class="form-label">Amount ($)</label>
            <input type="number" id="exp-amount" class="form-input" value="150">
          </div>
        `;

        openModal('Add Expense Item', bodyHTML, `
          <button class="btn btn-outline" onclick="window.closeAppModal()">Cancel</button>
          <button class="btn btn-primary" onclick="window.handleSaveExpenseSubmit('${trip.id}')">Save Expense</button>
        `);
      };
    }

    window.handleSaveExpenseSubmit = (tId) => {
      const cat = document.getElementById('exp-cat').value;
      const desc = document.getElementById('exp-desc').value;
      const amt = document.getElementById('exp-amount').value;

      if (!desc || !amt) {
        showToast('Please fill out description and amount', 'warning');
        return;
      }

      db.addExpense(tId, cat, amt, desc);
      showToast('Expense item saved!', 'success');
      closeModal();
      updateView();
    };

    window.handleDeleteExpense = (expId) => {
      db.deleteExpense(expId);
      showToast('Expense removed', 'info');
      updateView();
    };
  }

  updateView();
  return container;
}
