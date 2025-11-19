// wwwroot/js/projectMapInterop.js
window.projectMapInterop = {
    mapInstance: null,
    marker: null,

    /**
     * Initialize a map for a single project location
     * @param {string} mapId - The DOM element ID for the map
     * @param {number} latitude - Project latitude
     * @param {number} longitude - Project longitude
     * @param {number} zoom - Initial zoom level
     */
    initializeProjectMap: function (mapId, latitude, longitude, zoom) {
        try {
            // Remove existing map if any
            if (this.mapInstance) {
                this.mapInstance.remove();
                this.mapInstance = null;
                this.marker = null;
            }

            // Initialize the map
            this.mapInstance = L.map(mapId).setView([latitude, longitude], zoom);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                minZoom: 3
            }).addTo(this.mapInstance);

            return true;
        } catch (error) {
            console.error('Error initializing project map:', error);
            return false;
        }
    },

    /**
     * Add a marker for the project location
     * @param {string} title - Project title
     * @param {number} latitude - Project latitude
     * @param {number} longitude - Project longitude
     * @param {string} iconType - Icon type (school, hospital, road, water, market, community, housing, circle)
     * @param {string} color - Marker color (hex color)
     * @param {string} popupHtml - HTML content for the popup
     */
    addProjectMarker: function (title, latitude, longitude, iconType, color, popupHtml) {
        try {
            if (!this.mapInstance) {
                console.error('Map not initialized');
                return false;
            }

            // Create custom icon
            const customIcon = this.createCustomIcon(iconType, color);

            // Create marker
            this.marker = L.marker([latitude, longitude], { 
                icon: customIcon,
                title: title 
            }).addTo(this.mapInstance);

            // Bind popup if HTML provided
            if (popupHtml) {
                this.marker.bindPopup(popupHtml, { 
                    maxWidth: 300,
                    className: 'project-popup'
                }).openPopup();
            }

            return true;
        } catch (error) {
            console.error('Error adding project marker:', error);
            return false;
        }
    },

    /**
     * Create a custom icon based on project type and status color
     * @param {string} iconType - Type of icon
     * @param {string} color - Hex color for the icon
     */
    createCustomIcon: function (iconType, color) {
        const svgContent = this.getSvgIcon(iconType, color);
        
        return L.divIcon({
            html: svgContent,
            className: 'custom-project-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    },

    /**
     * Get SVG icon based on type
     * @param {string} iconType - Icon type
     * @param {string} color - Icon color
     */
    getSvgIcon: function (iconType, color) {
        const shadowColor = this.adjustColorBrightness(color, -30);
        
        const icons = {
            school: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <path d="M20 12 L12 16.5 L12 24 L20 28 L28 24 L28 16.5 Z M20 18 L15 20 L15 23 L20 25 L25 23 L25 20 Z" fill="#fff"/>
                    </svg>
                </div>`,
            hospital: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <path d="M20 15 L20 21 L14 21 L14 24 L20 24 L20 30 L23 30 L23 24 L29 24 L29 21 L23 21 L23 15 Z" fill="#fff"/>
                    </svg>
                </div>`,
            road: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <path d="M18 15 L18 30 L22 30 L22 15 Z M19 17 L21 17 L21 19 L19 19 Z M19 21 L21 21 L21 23 L19 23 Z M19 25 L21 25 L21 27 L19 27 Z" fill="#fff"/>
                    </svg>
                </div>`,
            water: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <path d="M20 15 Q15 20 15 24 Q15 28 20 28 Q25 28 25 24 Q25 20 20 15 Z" fill="#fff"/>
                    </svg>
                </div>`,
            market: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <path d="M14 18 L14 28 L26 28 L26 18 L24 18 L24 16 L16 16 L16 18 Z M17 19 L17 27 L19 27 L19 19 Z M21 19 L21 27 L23 27 L23 19 Z" fill="#fff"/>
                    </svg>
                </div>`,
            community: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <circle cx="16" cy="20" r="2.5" fill="#fff"/>
                        <circle cx="24" cy="20" r="2.5" fill="#fff"/>
                        <path d="M13 24 Q13 26 16 26 Q16 28 13 28 Q10 28 10 25 Z M27 24 Q27 26 24 26 Q24 28 27 28 Q30 28 30 25 Z" fill="#fff"/>
                    </svg>
                </div>`,
            housing: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <path d="M20 16 L27 21 L27 29 L13 29 L13 21 Z M18 24 L18 28 L22 28 L22 24 Z" fill="#fff"/>
                    </svg>
                </div>`,
            circle: `
                <div style="position: relative;">
                    <svg viewBox="0 0 40 50" width="40" height="50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path d="M20 0 L35 10 L35 35 Q35 45 20 50 Q5 45 5 35 L5 10 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
                        <circle cx="20" cy="23" r="6" fill="#fff"/>
                    </svg>
                </div>`
        };

        return icons[iconType] || icons.circle;
    },

    /**
     * Adjust color brightness
     * @param {string} color - Hex color
     * @param {number} percent - Brightness adjustment (-100 to 100)
     */
    adjustColorBrightness: function (color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    },

    /**
     * Set the map view to specific coordinates
     * @param {number} latitude - Target latitude
     * @param {number} longitude - Target longitude
     * @param {number} zoom - Zoom level
     */
    setView: function (latitude, longitude, zoom) {
        try {
            if (this.mapInstance) {
                this.mapInstance.setView([latitude, longitude], zoom);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting map view:', error);
            return false;
        }
    },

    /**
     * Dispose of the map instance
     */
    dispose: function () {
        try {
            if (this.mapInstance) {
                this.mapInstance.remove();
                this.mapInstance = null;
                this.marker = null;
            }
            return true;
        } catch (error) {
            console.error('Error disposing map:', error);
            return false;
        }
    }
};
