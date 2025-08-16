// Content script for Tab Age Tracker
// This script runs on every page and can provide additional functionality

// Helper function to safely send messages to extension
function safeSendMessage(message, callback) {
    // Check if extension context is still valid
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        console.log('Extension context not available');
        if (callback) callback(null);
        return;
    }

    try {
        chrome.runtime.sendMessage(message, function(response) {
            // Check for runtime error
            if (chrome.runtime.lastError) {
                console.log('Extension context error:', chrome.runtime.lastError);
                if (callback) callback(null);
                return;
            }
            
            if (callback) callback(response);
        });
    } catch (error) {
        console.log('Error sending message to extension:', error);
        if (callback) callback(null);
    }
}

// Request current tab age from background script
safeSendMessage({action: 'getCurrentTabAge'}, function(response) {
    if (response && response.age) {
        // Store the age for potential use
        window.tabAge = response.age;
        
        // You can add visual indicators or other features here
        // For example, adding a small indicator to the page
        addTabAgeIndicator(response.age);
    }
});

// Add a small visual indicator to show tab age (optional feature)
function addTabAgeIndicator(age) {
    // Only add indicator if it doesn't already exist
    if (document.getElementById('tab-age-indicator')) {
        return;
    }

    const indicator = document.createElement('div');
    indicator.id = 'tab-age-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-family: Arial, sans-serif;
        z-index: 10000;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    `;
    
    indicator.textContent = `🕒 ${formatDuration(age)}`;
    indicator.title = 'Tab Age - Click to hide';
    
    // Hide on click
    indicator.addEventListener('click', function() {
        this.style.opacity = '0';
        setTimeout(() => this.remove(), 300);
    });
    
    // Show on hover
    indicator.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
    });
    
    indicator.addEventListener('mouseleave', function() {
        this.style.opacity = '0.7';
    });
    
    document.body.appendChild(indicator);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }
    }, 5000);
}

// Format duration in a human-readable format
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else if (seconds > 30) {
        return `${seconds}s`;
    } else {
        return 'now';
    }
}

// Listen for keyboard shortcuts (optional feature)
document.addEventListener('keydown', function(event) {
    // Ctrl+Alt+T to show tab age (if not already used by browser)
    if (event.ctrlKey && event.altKey && event.key === 'T') {
        event.preventDefault();
        safeSendMessage({action: 'getCurrentTabAge'}, function(response) {
            if (response && response.age) {
                alert(`This tab has been open for: ${formatDuration(response.age)}`);
            }
        });
    }
});

// Update tab age periodically
setInterval(() => {
    safeSendMessage({action: 'getCurrentTabAge'}, function(response) {
        if (response && response.age) {
            window.tabAge = response.age;
            const indicator = document.getElementById('tab-age-indicator');
            if (indicator) {
                indicator.textContent = `🕒 ${formatDuration(response.age)}`;
            }
        }
    });
}, 30000); // Update every 30 seconds
