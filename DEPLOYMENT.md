# MEmory PWA Deployment Guide

## Stack

- **Frontend**: Single-file React PWA (no build step)
- **CDN**: React 18 via unpkg CDN
- **Storage**: Browser localStorage for API keys
- **Deployment**: Cloudflare Pages
- **PWA Features**: Service worker, manifest.json, installable on iOS Safari

## Files

- `index.html` — Main app with React components (SettingsPanel, AudioUpload)
- `manifest.json` — PWA metadata and icons
- `sw.js` — Service worker for offline support and caching
- `devo.config.json` — Devo workflow configuration

## Deployment to Cloudflare Pages

### Step 1: Create Repository

User must create the GitHub repository manually at `jennroma127/memory-pwa` and push the code.

### Step 2: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Pages** from the left sidebar
3. Click **Create a project** → **Connect to Git**
4. Select the `jennroma127/memory-pwa` repository
5. Set Build settings:
   - **Framework preset**: None
   - **Build command**: Leave blank (no build needed)
   - **Build output directory**: `/` (root)
6. Click **Save and Deploy**

### Step 3: Configure Custom Domain (Optional)

After deployment, you can add a custom domain in Cloudflare Pages settings.

## Testing PWA Installation

### iOS Safari (iPhone/iPad)

1. Open the app URL in Safari
2. Tap the **Share** button at the bottom
3. Select **Add to Home Screen**
4. Name it and tap **Add**
5. The app will open with no browser chrome

### Android Chrome

1. Open the app URL in Chrome
2. Tap the **menu** (three dots) → **Install app**
3. Confirm installation
4. The app will appear as a standalone app

## Features

### JRO-209: PWA Shell + API Key Settings

- Installable from Safari on iOS
- Settings panel with masked password inputs for API keys
- Keys persisted in localStorage
- Empty state prompts user to configure keys
- Responsive design with safe-area insets for notched devices

### JRO-210: Audio Upload + Whisper Transcription

- Drag-and-drop or tap-to-upload audio files
- Supports .m4a, .mp3, .wav formats
- Sends file to OpenAI Whisper API for transcription
- Loading spinner during transcription
- Displays transcript in scrollable panel
- Error handling for API failures and invalid files
- Option to upload new file and start over

## Environment Variables

API keys are entered by the user directly in the settings panel and stored in localStorage:

- `OPENAI_API_KEY` — OpenAI API key for Whisper transcription
- `ANTHROPIC_API_KEY` — Anthropic API key (for future features)

**Security Note**: Keys are stored client-side only. For production, consider:
- Using a backend proxy to hide API keys
- Implementing rate limiting
- Adding authentication

## Offline Support

The service worker caches:
- `index.html`
- `manifest.json`
- Static assets

Network requests (API calls to OpenAI) are not cached and will fail offline.

## Accessibility

- Proper heading hierarchy
- Semantic HTML
- Touch-friendly button sizes (min 44x44pt)
- Safe area insets for notched devices
- Color contrast meets WCAG AA

## Future Improvements

- Backend proxy for API key security
- Persistent transcript history
- Sync across devices (requires backend)
- Push notifications for completed tasks
- Dark mode (currently hardcoded to dark)
