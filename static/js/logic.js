// Create the Leaflet map
const map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch earthquake data from the USGS GeoJSON feed
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      // Extract earthquake properties
      const magnitude = feature.properties.mag;
      const depth = feature.geometry.coordinates[2];
      const latitude = feature.geometry.coordinates[1];
      const longitude = feature.geometry.coordinates[0];

      // Create a circle marker for each earthquake
      const marker = L.circleMarker([latitude, longitude], {
        radius: magnitude * 3,
        color: '',
        fillColor: getColorForDepth(depth),
        fillOpacity: 1
      });

      // Add a popup with earthquake details
      marker.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km`);
      
      marker.addTo(map);
    });
  });

// Function to determine marker color based on depth
function getColorForDepth(depth) {
  // Customize the color range based on your preferences
  return depth >= 90 ? 'red' :
         depth >= 70 && depth < 90 ? 'orange' :
         depth >= 50 && depth < 70 ? 'yellow' :
         depth >= 30 && depth < 50 ? 'lightgreen' :
         'green';
}
// Create a legend control
const legend = L.control({ position: 'bottomright' });

// Define the legend content
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const depths = [10, 30, 50, 70, 90];
  
  // Define the color gradient using CSS gradients
  div.innerHTML = '<div class="legend-title">Depth (km)</div>';
  for (let i = 0; i < depths.length; i++) {
    const color = getColorForDepth(depths[i] + 1);
    const backgroundStyle = `background: linear-gradient(to right, green, ${color});`;
    div.innerHTML +=
      `<div class="legend-item" style="${backgroundStyle}">
         ${depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+')}
       </div>`;
  }

  return div;
};

// Add the legend to the map
legend.addTo(map);

// Fetch tectonic plates data
fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
  .then(response => response.json())
  .then(data => {
    // Create a GeoJSON layer for tectonic plates
    const platesLayer = L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 2
      }
    });

    // Add the tectonic plates layer to the map
    platesLayer.addTo(map);
  });

  // Create layer controls for base maps and overlays
const baseMaps = {
  'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }),
  // Add other base maps if needed
};

const overlayMaps = {
  'Earthquakes': marker, // The earthquake marker layer from Part 1
  'Tectonic Plates': platesLayer // The tectonic plates layer from Part 2
  // Add other overlays if needed
};

// Add layer controls to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);
