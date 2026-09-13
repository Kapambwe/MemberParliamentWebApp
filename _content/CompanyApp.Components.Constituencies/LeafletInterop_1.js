// wwwroot/js/leaflet-interop.js
window.leafletMap = {
    maps: {},

    initialize: function (mapId, dotNetHelper, latitude, longitude, zoom) {
        // Initialize map
        const map = L.map(mapId).setView([latitude, longitude], zoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        // Store map reference
        this.maps[mapId] = {
            map: map,
            markers: {},
            layers: {},
            dotNetHelper: dotNetHelper
        };

        return true;
    },

    addMarker: function (mapId, markerId, latitude, longitude, title, color, icon, popupContent) {
        const mapData = this.maps[mapId];
        if (!mapData) return false;

        // Create custom icon based on color and type
        const customIcon = this.createCustomIcon(color, icon);

        const marker = L.marker([latitude, longitude], { icon: customIcon })
            .addTo(mapData.map)
            .bindPopup(popupContent, { maxWidth: 300 });

        // Store marker reference
        mapData.markers[markerId] = marker;

        // Add click event
        marker.on('click', function () {
            mapData.dotNetHelper.invokeMethodAsync('OnMarkerClicked', markerId);
        });

        return true;
    },

    createCustomIcon: function (color, iconType) {
        // Create SVG icons for different project types
        const svgContent = this.getSvgIcon(iconType, color);
        
        return L.divIcon({
            html: svgContent,
            className: 'custom-leaflet-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
    },

    getSvgIcon: function (iconType, color) {
        const icons = {
            school: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>`,
            hospital: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
            </svg>`,
            road: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <path d="M18.5 10.2c0 2.57-2.1 5.79-6.16 9.51l-.34.3-.34-.3C7.6 15.99 5.5 12.77 5.5 10.2c0-3.84 2.82-6.7 6.5-6.7s6.5 2.85 6.5 6.7z"/>
            </svg>`,
            water: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/>
            </svg>`,
            market: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>`,
            community: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>`,
            housing: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>`,
            circle: `<svg viewBox="0 0 24 24" fill="${color}" width="24" height="24">
                <circle cx="12" cy="12" r="8"/>
            </svg>`
        };

        return icons[iconType] || icons.circle;
    },

    clearMarkers: function (mapId) {
        const mapData = this.maps[mapId];
        if (!mapData) return;

        Object.values(mapData.markers).forEach(marker => {
            mapData.map.removeLayer(marker);
        });
        mapData.markers = {};
    },

    addLayer: function (mapId, layerId, markers) {
        const mapData = this.maps[mapId];
        if (!mapData) return;

        const layerGroup = L.layerGroup();
        
        markers.forEach(marker => {
            const customIcon = this.createCustomIcon(marker.color, marker.icon);
            const leafletMarker = L.marker([marker.latitude, marker.longitude], { icon: customIcon })
                .bindPopup(marker.popupContent, { maxWidth: 300 });

            leafletMarker.on('click', function () {
                mapData.dotNetHelper.invokeMethodAsync('OnMarkerClicked', marker.projectId);
            });

            layerGroup.addLayer(leafletMarker);
        });

        mapData.layers[layerId] = layerGroup;
        layerGroup.addTo(mapData.map);
    },

    toggleLayer: function (mapId, layerId, visible) {
        const mapData = this.maps[mapId];
        if (!mapData || !mapData.layers[layerId]) return;

        if (visible) {
            mapData.map.addLayer(mapData.layers[layerId]);
        } else {
            mapData.map.removeLayer(mapData.layers[layerId]);
        }
    },

    setView: function (mapId, latitude, longitude, zoom) {
        const mapData = this.maps[mapId];
        if (!mapData) return;

        mapData.map.setView([latitude, longitude], zoom);
    },

    fitBounds: function (mapId, markers) {
        const mapData = this.maps[mapId];
        if (!mapData || !markers.length) return;

        const bounds = L.latLngBounds(markers.map(m => [m.latitude, m.longitude]));
        mapData.map.fitBounds(bounds, { padding: [20, 20] });
    },

    dispose: function (mapId) {
        const mapData = this.maps[mapId];
        if (!mapData) return;

        mapData.map.remove();
        delete this.maps[mapId];
    }
};