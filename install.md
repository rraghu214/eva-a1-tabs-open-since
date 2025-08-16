# Quick Installation Guide

## Step-by-Step Installation

### 1. Prepare the Extension
- Ensure all files are in the correct folder structure
- Replace the placeholder icon files with actual PNG icons (16x16, 48x48, 128x128)

### 2. Load in Chrome/Edge/Brave

#### For Chrome:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list

#### For Edge:
1. Open Edge and go to `edge://extensions/`
2. Enable "Developer mode" (toggle in top-left)
3. Click "Load unpacked"
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list

#### For Brave:
1. Open Brave and go to `brave://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list

### 3. Pin the Extension
1. Click the puzzle piece icon in your browser toolbar
2. Find "Tab Age Tracker" in the dropdown
3. Click the pin icon next to it
4. The extension icon will now appear in your toolbar

### 4. Test the Extension
1. Open a few tabs in your browser
2. Click the Tab Age Tracker icon in your toolbar
3. You should see the popup with tab ages
4. Try clicking on different tabs in the popup to switch between them

## Troubleshooting

### Extension won't load:
- Check that all files are present
- Ensure `manifest.json` is valid JSON
- Verify icon files are actual PNG images
- Try refreshing the extensions page

### No tab ages showing:
- Click the refresh button in the popup
- Check browser console for errors
- Ensure the extension has necessary permissions

### Icons not showing:
- Replace placeholder files with actual PNG icons
- Ensure icon files are the correct sizes
- Check file permissions

## Quick Test
After installation, try this:
1. Open a new tab
2. Wait 1-2 minutes
3. Click the extension icon
4. You should see "1 minute ago" or "2 minutes ago" for the new tab
