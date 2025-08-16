# Tab Age Tracker - Browser Extension

A Chrome extension that tracks and displays the age of opened tabs. Perfect for users who want to monitor how long they've had tabs open and manage their browsing sessions more effectively.

## Features

- **Real-time Tab Age Tracking**: Automatically tracks when each tab was opened
- **Beautiful Popup Interface**: Modern, gradient-styled popup showing all tab ages
- **Current Tab Highlight**: Shows the age of the currently active tab prominently
- **Click to Switch**: Click on any tab in the popup to switch to it
- **Visual Indicators**: Optional floating indicator on web pages showing tab age
- **Keyboard Shortcuts**: Use Ctrl+Alt+T to quickly check tab age
- **Auto-refresh**: Data updates automatically every 5 seconds
- **Persistent Storage**: Tab ages are saved and persist across browser sessions
- **Resizable Popup**: Drag to resize the popup window for better visibility
- **Smart Sorting**: Sort tabs by age in ascending or descending order
- **Old Tab Highlighting**: Tabs open for more than 60 minutes are highlighted in red

## Installation

### For Chrome/Edge/Brave:

1. **Download the Extension Files**
   - Download all files from this repository
   - Ensure the folder structure is maintained

2. **Replace Icon Placeholders**
   - Replace the placeholder files in the `icons/` folder with actual PNG icons:
     - `icon16.png` (16x16 pixels)
     - `icon64.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)
   - You can create simple clock icons or use any icon design tool

3. **Load the Extension**
   - Open Chrome/Edge/Brave
   - Navigate to `chrome://extensions/` (or `edge://extensions/` for Edge)
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the folder containing the extension files

4. **Pin the Extension**
   - Click the puzzle piece icon in the toolbar
   - Find "Tab Age Tracker" and click the pin icon
   - The extension icon will now appear in your toolbar

## Usage

### Basic Usage:
1. **Click the Extension Icon**: Click the Tab Age Tracker icon in your toolbar
2. **View Tab Ages**: The popup will show the age of your current tab and all other open tabs
3. **Switch Tabs**: Click on any tab in the list to switch to it
4. **Refresh**: Click the refresh button to update the data manually

### Advanced Features:
1. **Visual Indicator**: A small floating indicator appears on web pages showing tab age
   - Hover to make it more visible
   - Click to hide it
   - Auto-hides after 5 seconds
2. **Keyboard Shortcut**: Press `Ctrl+Alt+T` to quickly check the current tab's age
3. **Auto-updates**: The popup automatically refreshes every 5 seconds
4. **Resizable Interface**: Drag the bottom-right corner to resize the popup window
5. **Smart Sorting**: Use the dropdown to sort tabs by age (Oldest First or Newest First)
6. **Old Tab Alerts**: Tabs open for more than 60 minutes are highlighted with a red border

## File Structure

```
tab-age-tracker/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── popup.html            # Popup interface
├── popup.js              # Popup functionality
├── content.js            # Content script for web pages
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon64.png
│   └── icon128.png
└── README.md             # This file
```

## Technical Details

### Permissions Used:
- `tabs`: To access tab information and track tab events
- `storage`: To persist tab age data across sessions
- `activeTab`: To get information about the current tab

### How It Works:
1. **Background Script**: Tracks tab creation, updates, and removal events
2. **Storage**: Saves tab age data locally using Chrome's storage API
3. **Popup**: Displays formatted tab ages in a user-friendly interface
4. **Content Script**: Provides additional features like visual indicators

### Data Format:
Tab ages are stored as timestamps and converted to human-readable format:
- "Just now" for tabs opened within 30 seconds
- "X seconds ago" for tabs opened within a minute
- "X minutes ago" for tabs opened within an hour
- "X hours ago" for tabs opened within a day
- "X days ago" for older tabs

## Customization

### Styling:
- Modify the CSS in `popup.html` to change the appearance
- The extension uses a purple gradient theme by default
- All colors and styling can be customized

### Features:
- Edit `content.js` to modify or disable the floating indicator
- Modify `popup.js` to change the update frequency or display format
- Adjust `background.js` to change how tab events are handled

## Troubleshooting

### Extension Not Loading:
- Ensure all files are present and in the correct structure
- Check that `manifest.json` is valid JSON
- Verify that icon files are actual PNG images

### Tab Ages Not Showing:
- Refresh the extension by clicking the refresh button
- Check browser console for any error messages
- Ensure the extension has the necessary permissions

### Visual Indicator Issues:
- The indicator may not appear on some websites due to security restrictions
- You can disable it by commenting out the `addTabAgeIndicator()` call in `content.js`

## Browser Compatibility

This extension is designed for Chromium-based browsers:
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Brave Browser
- ✅ Opera
- ✅ Other Chromium-based browsers

## Privacy

- All data is stored locally on your device
- No data is sent to external servers
- The extension only tracks tab creation times and basic tab information
- You can clear the data by uninstalling the extension

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the extension!

## License

This project is open source and available under the MIT License.
