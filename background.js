// Background service worker for Tab Age Tracker
let tabAges = {};

// Initialize when extension loads
chrome.runtime.onStartup.addListener(() => {
  loadTabAges();
});

chrome.runtime.onInstalled.addListener(() => {
  loadTabAges();
});

// Also load when the service worker starts
loadTabAges();

// Handle browser restart - ensure we have data for all existing tabs
chrome.runtime.onStartup.addListener(() => {
  // Small delay to ensure tabs are fully loaded
  setTimeout(() => {
    loadTabAges();
  }, 1000);
});

// Track tab creation
chrome.tabs.onCreated.addListener((tab) => {
  const timestamp = Date.now();
  tabAges[tab.id] = {
    created: timestamp,
    title: tab.title || 'New Tab',
    url: tab.url || ''
  };
  saveTabAges();
});

// Track tab updates (title/URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabAges[tabId]) {
    tabAges[tabId].title = tab.title || 'New Tab';
    tabAges[tabId].url = tab.url || '';
    saveTabAges();
  }
});

// Remove tab data when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabAges[tabId]) {
    delete tabAges[tabId];
    saveTabAges();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabAges') {
    // Ensure we have the latest data
    sendResponse({ tabAges: tabAges });
  } else if (request.action === 'getCurrentTabAge') {
    // Get the currently active tab instead of sender.tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log('Current tab query result:', tabs[0]);
      console.log('Available tab ages:', Object.keys(tabAges));
      
      if (tabs[0] && tabAges[tabs[0].id]) {
        const age = Date.now() - tabAges[tabs[0].id].created;
        console.log('Tab age found:', age, 'ms for tab', tabs[0].id);
        sendResponse({ age });
      } else if (tabs[0]) {
        // If tab doesn't exist in our data, create it now
        const timestamp = Date.now();
        tabAges[tabs[0].id] = {
          created: timestamp,
          title: tabs[0].title || 'New Tab',
          url: tabs[0].url || ''
        };
        console.log('Created new tab entry for:', tabs[0].id, tabs[0].title);
        saveTabAges();
        sendResponse({ age: 0 });
      } else {
        console.log('No current tab found');
        sendResponse({ age: 0 });
      }
         });
     return true; // Keep the message channel open for async response
  }
});

// Save tab ages to storage
function saveTabAges() {
  chrome.storage.local.set({ tabAges });
}

// Clean up old tab data
function cleanupOldTabData() {
  chrome.tabs.query({}, (currentTabs) => {
    const currentTabIds = currentTabs.map(tab => tab.id);
    let hasChanges = false;
    
    // Remove data for tabs that no longer exist
    Object.keys(tabAges).forEach(tabId => {
      if (!currentTabIds.includes(parseInt(tabId))) {
        delete tabAges[tabId];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      saveTabAges();
    }
  });
}

// Load tab ages from storage and initialize missing tabs
function loadTabAges() {
  chrome.storage.local.get(['tabAges'], (result) => {
    if (result.tabAges) {
      tabAges = result.tabAges;
    }
    
    // Clean up old tab data first
    cleanupOldTabData();
    
    // Initialize tab ages for existing tabs that don't have entries
    chrome.tabs.query({}, (tabs) => {
      const timestamp = Date.now();
      let hasNewTabs = false;
      
      tabs.forEach(tab => {
        if (!tabAges[tab.id]) {
          tabAges[tab.id] = {
            created: timestamp,
            title: tab.title || 'New Tab',
            url: tab.url || ''
          };
          hasNewTabs = true;
        }
      });
      
      // Only save if we added new tabs
      if (hasNewTabs) {
        saveTabAges();
      }
    });
  });
}
