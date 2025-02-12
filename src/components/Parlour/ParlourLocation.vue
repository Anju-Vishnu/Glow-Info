<template>
    <div>
        <div id="map" style="height: 400px; width: 800px;"></div>
        <v-btn @click="toggleSearch">Select Location</v-btn>
        <div v-if="showSearch" class="search-container">
            <input
                v-model="searchQuery"
                @keyup.enter="searchLocation"
                placeholder="Enter location..."
                class="search-input"
            />
            <v-btn @click="searchLocation">Search</v-btn>
        </div>

        <!-- Display location details -->
        <div v-if="markerPosition" class="location-details">
            <p>Selected Location: {{ locationName }}</p>
            <v-btn @click="confirmLocation">Confirm Location</v-btn>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

// Import Leaflet's default marker icons
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default defineComponent({
    setup(_, { emit }) {
        const map = ref(null);
        const marker = ref(null);
        const markerPosition = ref(null);
        const searchQuery = ref('');
        const showSearch = ref(false);
        const locationName = ref('');

        // // Default Leaflet marker icon
        // const defaultIcon = L.icon({
        //     iconUrl: L.Icon.Default.prototype._getIconUrl('icon'),
        //     shadowUrl: markerShadow,
        //     iconSize: [25, 41],
        //     iconAnchor: [12, 41],
        //     popupAnchor: [1, -34],
        // });

        // Initialize the map
        onMounted(() => {
            if (!map.value) {
                map.value = L.map("map").setView([51.505, -0.09], 13);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map.value);

                // Set marker on map click
                map.value.on("click", async (event) => {
                    if (marker.value) {
                        marker.value.setLatLng(event.latlng);
                    } else {
                        marker.value = L.marker(event.latlng).addTo(map.value);
                     }
                    markerPosition.value = event.latlng;
                     
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${event.latlng.lat}&lon=${event.latlng.lng}`);
                        const data = await response.json();
                        locationName.value = data.display_name || "Unnamed Location"; // Get name from API
                    } catch (error) {
                        console.error("Reverse geocoding error:", error);
                        locationName.value = "Unnamed Location"; // Fallback
                    }
                });
            }
        });

        // Clean up map instance on unmount
        onBeforeUnmount(() => {
            if (map.value) {
                map.value.off();
                map.value.remove();
                map.value = null;
            }
        });

        // Toggle search input visibility
        const toggleSearch = () => {
            showSearch.value = !showSearch.value;
            if (showSearch.value) {
                searchQuery.value = ''; // Reset search query when showing the input
            }
        };

        // Search for a location
        const searchLocation = async () => {
            if (searchQuery.value) {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`);
                    const results = await response.json();
                
                    if (results.length > 0) {
                        const { lat, lon, display_name } = results[0]; // Keep 'display_name'
                    
                        if (marker.value) {
                            marker.value.setLatLng([lat, lon]);
                        } else {
                            marker.value = L.marker([lat, lon]).addTo(map.value);
                        }
                    
                        markerPosition.value = { lat, lng: lon };
                        map.value.setView([lat, lon], 13);
                    
                        locationName.value = display_name || searchQuery.value; // Use the fetched name or search input
                        showSearch.value = false;
                        searchQuery.value = '';
                    } else {
                        alert("Location not found!");
                    }
                } catch (error) {
                    console.error("Error fetching location:", error);
                    alert("An error occurred while searching for the location.");
                }
            }
        };

        // Emit the selected location
        const confirmLocation = () => {
            if (markerPosition.value) {
                emit('childValues', {
                    locationName: locationName.value || 'Unnamed location',
                    latitude: markerPosition.value.lat,
                    longitude: markerPosition.value.lng,
                });
            }
        };

        return {
            confirmLocation,
            toggleSearch,
            searchLocation,
            searchQuery,
            showSearch,
            markerPosition,
            locationName,
        };
    },
});
</script>

<style scoped>
#map {
    height: 400px;
    width: 800px;
}
.search-container {
    margin-top: 10px;
}
.search-input {
    padding: 5px;
    width: 70%;
}
.location-details {
    margin-top: 10px;
}
</style>
