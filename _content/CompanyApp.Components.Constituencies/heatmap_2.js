// wwwroot/js/heatmap.js
export function initializeHeatmap(containerId, distributionData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Initialize Leaflet map
    const map = L.map(container).setView([-13.1339, 27.8493], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create heatmap layer
    const heatMapData = distributionData
        .filter(d => d.latitude && d.longitude)
        .map(d => [d.latitude, d.longitude, d.intensity]);

    const heatLayer = L.heatLayer(heatMapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
            0.2: 'blue',
            0.4: 'cyan',
            0.6: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        }
    }).addTo(map);

    // Add circle markers for each ward
    distributionData.forEach(ward => {
        if (ward.latitude && ward.longitude) {
            const color = getIntensityColor(ward.intensity);
            
            L.circleMarker([ward.latitude, ward.longitude], {
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                radius: Math.sqrt(ward.projectCount) * 3,
                weight: 2
            }).addTo(map)
            .bindPopup(`
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0;">${ward.ward}</h4>
                    <p style="margin: 4px 0;"><strong>Projects:</strong> ${ward.projectCount}</p>
                    <p style="margin: 4px 0;"><strong>Budget:</strong> K${ward.totalBudget.toLocaleString()}</p>
                    <p style="margin: 4px 0;"><strong>Beneficiaries:</strong> ${ward.totalBeneficiaries.toLocaleString()}</p>
                    <p style="margin: 4px 0;"><strong>Intensity:</strong> ${ward.intensity.toFixed(2)}</p>
                </div>
            `);
        }
    });

    // Fit map to show all data points
    const bounds = L.latLngBounds(distributionData
        .filter(d => d.latitude && d.longitude)
        .map(d => [d.latitude, d.longitude]));
    
    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
    }
}

function getIntensityColor(intensity) {
    if (intensity >= 4.0) return '#4CAF50'; // Green
    if (intensity >= 3.0) return '#8BC34A'; // Light Green
    if (intensity >= 2.0) return '#FFC107'; // Amber
    if (intensity >= 1.0) return '#FF9800'; // Orange
    return '#F44336'; // Red
}