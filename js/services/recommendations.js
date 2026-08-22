/* ==========================================================================
   GlobeTrotter Smart AI Recommendation Engine Service
   ========================================================================== */

import { db } from '../db.js';

export function getRecommendedCities(limit = 6) {
  const cities = db.getCities();
  const user = db.getCurrentUser();

  // Score cities based on user preferences and popularity
  const scored = cities.map(c => {
    let score = c.popularity * 10;
    
    // Boost score based on user profile preferences
    if (user) {
      if (user.currency === 'EUR (€)' && c.region === 'Europe') score += 15;
      if (user.currency === 'JPY (¥)' && c.region === 'Asia') score += 15;
    }

    const matchPercent = Math.min(99, Math.round(score + Math.random() * 5));
    return { ...c, matchPercent };
  });

  return scored.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, limit);
}

export function getRecommendedActivitiesForCity(cityId, tripBudget = 3000) {
  const activities = db.getActivities(cityId);
  
  return activities.map(act => {
    const isWithinBudget = act.estimated_cost <= (tripBudget * 0.15);
    const score = (act.rating * 18) + (isWithinBudget ? 10 : 0);
    const matchPercent = Math.min(99, Math.round(score));
    return { ...act, matchPercent, isWithinBudget };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}

export function renderRecommendationBadge(matchPercent) {
  return `
    <span class="badge badge-accent" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(255, 90, 95, 0.2)); color: #f59e0b; font-weight: 700; border: 1px solid rgba(245, 158, 11, 0.4);">
      <i class="fa-solid fa-sparkles"></i> ${matchPercent}% AI Match
    </span>
  `;
}
