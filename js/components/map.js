/* ==========================================================================
   GlobeTrotter Leaflet Map Component
   ========================================================================== */

export function renderTripMap(containerId, cities = []) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  if (typeof L === 'undefined') {
    container.innerHTML = `<div class="empty-state"><p>Map library loading...</p></div>`;
    return null;
  }

  // Clear previous instance if any
  container.innerHTML = '';

  const defaultLat = cities.length > 0 ? cities[0].lat : 48.8566;
  const defaultLng = cities.length > 0 ? cities[0].lng : 2.3522;
  const zoom = cities.length > 1 ? 4 : 6;

  const map = L.map(containerId, {
    scrollWheelZoom: false
  }).setView([defaultLat, defaultLng], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const points = [];

  cities.forEach((city, index) => {
    if (city.lat && city.lng) {
      const latLng = [city.lat, city.lng];
      points.push(latLng);

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background: var(--primary); color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white;">${index + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(latLng, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="font-size: 0.95rem;">${city.name}</strong><br>
            <span style="color: #64748b; font-size: 0.8rem;">${city.country}</span>
          </div>
        `);
    }
  });

  if (points.length > 1) {
    const polyline = L.polyline(points, {
      color: '#ff5a5f',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.8
    }).addTo(map);

    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }

  return map;
}
