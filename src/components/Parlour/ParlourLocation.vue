<template>
    <div>
        <div id="map" style="height: 400px; width: 650px;"></div>
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
            <v-btn @click="confirmLocation">Confirm Location</v-btn>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';


// Import your custom icon
import markerIcon from '@/assets/icon3.png'; // Adjust the path as necessary

export default defineComponent({
    setup(_, { emit }) {
        const map = ref(null);
        const marker = ref(null);
        const markerPosition = ref(null);
        const searchQuery = ref('');
        const showSearch = ref(false);
        const locationName = ref('');

        // Create a custom icon
        const customIcon = L.icon({
            iconUrl: markerIcon, // Your custom icon image
            iconSize: [25, 41], // Size of the icon
            iconAnchor: [12, 41], // Anchor point of the icon
            popupAnchor: [1, -34], // Popup anchor point
            shadowUrl: null, // Optionally add a shadow
            shadowSize: null, // Size of the shadow
        });

        // Initialize the map
        onMounted(() => {
            if (!map.value) {
                map.value = L.map("map").setView([51.505, -0.09], 13);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map.value);

                // Set marker on map click
                map.value.on("click", (event) => {
                    if (marker.value) {
                        marker.value.setLatLng(event.latlng);
                    } else {
                        // Use the custom icon here
                        marker.value = L.marker(event.latlng, { icon: customIcon }).addTo(map.value);
                    }
                    markerPosition.value = event.latlng; // Set marker position to clicked location
                    showSearch.value = false; // Hide search input
                    locationName.value = 'Unnamed Location';
                });
            }
        });

        // Clean up map instance on unmount
        onBeforeUnmount(() => {
            if (map.value) {
                map.value.off();
                map.value.remove();
                map.value = null; // Ensure the map reference is cleared
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
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`);
                const results = await response.json();
                if (results.length > 0) {
                    const { lat, lon, display_name } = results[0];
                    if (marker.value) {
                        marker.value.setLatLng([lat, lon]);
                    } else {
                        marker.value = L.marker([lat, lon], { icon: customIcon }).addTo(map.value);
                    }
                    markerPosition.value = { lat, lng: lon };
                    map.value.setView([lat, lon], 13); // Center the map on the new marker
                    locationName.value = display_name; // Set the location name
                    showSearch.value = false; // Hide search input
                    searchQuery.value = ''; // Clear search query
                } else {
                    alert("Location not found!");
                }
            }
        };

        // Emit the coordinates when the user confirms location
        const confirmLocation = () => {
            //if (markerPosition.value) {
                emit('childValues', {
                    locationName: locationName.value || 'Unnamed location',
                    latitude: markerPosition.value.lat,
                    longitude: markerPosition.value.lng,
                });
                //alert(`Location Confirmed:\nName: ${locationName.value}\nLatitude: ${markerPosition.value.lat}\nLongitude: ${markerPosition.value.lng}`);
            
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
