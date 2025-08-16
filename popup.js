// Popup script for Tab Age Tracker
document.addEventListener('DOMContentLoaded', function() {
    loadTabData();
    
    // Refresh button functionality
    document.getElementById('refreshBtn').addEventListener('click', function() {
        // Show loading state
        this.textContent = '🔄 Refreshing...';
        this.disabled = true;
        
        // Reload data
        loadTabData().then(() => {
            // Restore button state after a short delay
            setTimeout(() => {
                this.textContent = '🔄 Refresh';
                this.disabled = false;
            }, 1000);
        }).catch(() => {
            // Restore button state on error
            this.textContent = '🔄 Refresh';
            this.disabled = false;
        });
    });

    // Sort functionality
    document.getElementById('sortOrder').addEventListener('change', function() {
        if (window.currentTabAges) {
            displayAllTabs(window.currentTabAges);
        }
    });

    // Resize functionality
    const resizeHandle = document.getElementById('resizeHandle');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = document.body.offsetWidth;
        startHeight = document.body.offsetHeight;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
    });

    function handleMouseMove(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newWidth = Math.max(400, Math.min(1200, startWidth + deltaX));
        const newHeight = Math.max(300, Math.min(2000, startHeight + deltaY));
        
        document.body.style.width = newWidth + 'px';
        document.body.style.height = newHeight + 'px';
    }

    function handleMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
});

// Load and display tab data
function loadTabData() {
    return new Promise((resolve, reject) => {
        let completedRequests = 0;
        const totalRequests = 2;
        
        // Get current tab age
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log('Popup: Current tab query result:', tabs[0]);
            if (tabs[0]) {
                chrome.runtime.sendMessage({action: 'getCurrentTabAge'}, function(response) {
                    console.log('Current tab age response:', response);
                    if (response && response.age !== undefined) {
                        const ageText = formatDuration(response.age);
                        console.log('Setting current tab age to:', ageText);
                        document.getElementById('currentTabAge').textContent = ageText;
                    } else {
                        console.log('No valid age response, setting to "Just opened"');
                        document.getElementById('currentTabAge').textContent = 'Just opened';
                    }
                    completedRequests++;
                    if (completedRequests === totalRequests) {
                        updateLastUpdatedTime();
                        resolve();
                    }
                });
            } else {
                console.log('No current tab found in popup');
                completedRequests++;
                if (completedRequests === totalRequests) {
                    updateLastUpdatedTime();
                    resolve();
                }
            }
        });

        // Get all tab ages
        chrome.runtime.sendMessage({action: 'getTabAges'}, function(response) {
            if (response && response.tabAges) {
                displayAllTabs(response.tabAges);
            } else {
                displayNoTabs();
            }
            completedRequests++;
            if (completedRequests === totalRequests) {
                updateLastUpdatedTime();
                resolve();
            }
        });
    });
}

// Update the last updated timestamp
function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('lastUpdated').textContent = `Last updated: ${timeString}`;
}

// Display all tabs with their ages
function displayAllTabs(tabAges) {
    const tabsList = document.getElementById('tabsList');
    
    // Store current tab ages for sorting
    window.currentTabAges = tabAges;
    
    // Get all tabs to match with our age data
    chrome.tabs.query({}, function(tabs) {
        const tabsWithAges = [];
        
        tabs.forEach(tab => {
            if (tabAges[tab.id]) {
                const age = Date.now() - tabAges[tab.id].created;
                tabsWithAges.push({
                    id: tab.id,
                    title: tab.title || 'New Tab',
                    url: tab.url,
                    age: age,
                    isActive: tab.active
                });
            }
        });

        // Get sort order
        const sortOrder = document.getElementById('sortOrder').value;
        
        // Sort by age
        if (sortOrder === 'desc') {
            tabsWithAges.sort((a, b) => b.age - a.age); // Oldest first
        } else {
            tabsWithAges.sort((a, b) => a.age - b.age); // Newest first
        }

        if (tabsWithAges.length === 0) {
            displayNoTabs();
            return;
        }

        // Create HTML for tabs
        let html = '';
        tabsWithAges.forEach(tab => {
            const ageText = formatDuration(tab.age);
            const activeClass = tab.isActive ? 'active-tab' : '';
            const oldTabClass = tab.age > 60 * 60 * 1000 ? 'old-tab' : ''; // 60 minutes in milliseconds
            
            html += `
                <div class="tab-item ${activeClass} ${oldTabClass}" data-tab-id="${tab.id}">
                    <div class="tab-title" title="${tab.title}">${tab.title}</div>
                    <div class="tab-age">🕒 ${ageText}</div>
                </div>
            `;
        });

        tabsList.innerHTML = html;

        // Add click handlers to switch to tabs
        document.querySelectorAll('.tab-item').forEach(item => {
            item.addEventListener('click', function() {
                const tabId = parseInt(this.dataset.tabId);
                chrome.tabs.update(tabId, {active: true});
                window.close();
            });
        });
    });
}

// Display message when no tabs are found
function displayNoTabs() {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = '<div class="no-tabs">No tabs found</div>';
}

// Format duration in a human-readable format
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds > 30) {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

// Update data periodically
setInterval(loadTabData, 5000); // Update every 5 seconds
