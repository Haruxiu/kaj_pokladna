// Utility functions (formerly in RestaurantCashRegister class)

// Check and update connection status
export const checkConnectionStatus = () => {
    updateConnectionStatus(navigator.onLine);
};

export const updateConnectionStatus = (online) => {
    const connectionStatusElement = document.getElementById('connectionStatus');
    if (connectionStatusElement) {
        if (online) {
            connectionStatusElement.textContent = 'Online';
            connectionStatusElement.classList.remove('offline');
            connectionStatusElement.classList.add('online');
            console.log('Syncing offline data...'); // Keep console log for now
        } else {
            connectionStatusElement.textContent = 'Offline';
            connectionStatusElement.classList.remove('online');
            connectionStatusElement.classList.add('offline');
        }
    }
};
    
    // Get category text
export const getCategoryText = (category) => {
        switch(category) {
            case 'main': return 'Hlavní jídlo';
            case 'drink': return 'Nápoj';
            case 'dessert': return 'Dezert';
            default: return category;
        }
};

// Geolocation example
export const showLocation = async (showLocationModal) => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const locationInfo = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                };
                // Call the showLocationModal function passed from App.jsx
                showLocationModal(locationInfo);
            },
            (error) => {
                alert('Nelze získat polohu: ' + error.message);
            }
        );
    } else {
        alert('Geolokace není v tomto prohlížeči podporována.');
    }
};
    
    // Register service worker for offline functionality
export const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
            navigator.serviceWorker.register('/serviceWorker.js') // Corrected service worker path
                    .then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
};

// Remove the RestaurantCashRegister class and its initialization
// No longer needed as state is managed in React

// Initialize utility functions
document.addEventListener('DOMContentLoaded', () => {
    checkConnectionStatus();
    registerServiceWorker();
    
    // Remove all other initializations and DOM manipulation from here
    // React will handle rendering and event listeners
});