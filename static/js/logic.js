// Create the Leaflet map
const map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a marker cluster group
const markers = L.markerClusterGroup();

// Fetch earthquake data from the USGS GeoJSON feed
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const magnitude = feature.properties.mag;
      const depth = feature.geometry.coordinates[2];
      const latitude = feature.geometry.coordinates[1];
      const longitude = feature.geometry.coordinates[0];

      const popup = `Magnitude: ${magnitude}<br>Depth: ${depth} km`;

      // Create a circle marker for each earthquake
      const marker = L.circleMarker([latitude, longitude], {
        radius: magnitude * 2,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.6
      }).bindPopup(popup);

      markers.addLayer(marker);
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);
  });
