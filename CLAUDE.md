# MEmory PWA — Codebase Documentation

## Project Overview

MEmory is a self-hosted PWA (Progressive Web App) that replaces the Plaud Pro AI subscription service. It provides audio transcription using OpenAI's Whisper API and AI analysis using Anthropic's Claude API — all running client-side with no backend infrastructure.

**Status**: JRO-209 and JRO-210 implemented (basic shell + audio upload + transcription)

## Architecture

### Single-File Design

All React code lives in `index.html` via Babel standalone. No build step, no bundler.

```
index.html
├── React 18 (via unpkg CDN)
├── Babel standalone (transpilation)
├── CSS (inline)
└── React components (all in one script tag)
```

### Components

1. **SettingsPanel** — Modal for entering and saving API keys
   - OpenAI API key input (for Whisper)
   - Anthropic API key input (for future features)
   - Masked password inputs
   - localStorage persistence

2. **AudioUpload** — File upload and transcription
   - Drag-drop or tap-to-upload
   - Validates file types (.m4a, .mp3, .wav)
   - Calls OpenAI Whisper API
   - Shows loading spinner during transcription
   - Displays transcript in scrollable panel
   - Error handling and retry

3. **MEmory** (Main) — App shell
   - Header with settings button
   - Empty state when no API keys configured
   - Content area for audio upload or transcript
   - Manages localStorage checks

## File Structure

```
memory-pwa/
├── index.html              # Main PWA app
├── manifest.json           # PWA metadata and icons
├── sw.js                   # Service worker
├── wrangler.toml           # Cloudflare Pages config (optional)
├── devo.config.json        # Devo workflow config
├── .gitignore              # Git ignore rules
└── DEPLOYMENT.md           # Deployment guide
```

## Key Technologies

- **React 18** — UI framework (via CDN)
- **Babel Standalone** — JSX transpilation
- **localStorage** — Client-side API key storage
- **Service Worker** — Offline caching and PWA features
- **OpenAI Whisper API** — Audio transcription
- **Anthropic Claude API** — (Future: summarization/chat)

## API Integration

### OpenAI Whisper

Endpoint: `https://api.openai.com/v1/audio/transcriptions`

```javascript
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('model', 'whisper-1');

fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData
});
```

Supported formats: .m4a, .mp3, .wav (max 25MB)

### Anthropic Claude

(Not yet integrated — reserved for JRO-211, JRO-212, JRO-213)

## Storage

### localStorage Keys

- `OPENAI_API_KEY` — User's OpenAI API key
- `ANTHROPIC_API_KEY` — User's Anthropic API key (future)

Keys are plaintext and persist across browser sessions. No encryption is applied (consider this for production).

## PWA Features

### Installation

- **iOS Safari**: Share → Add to Home Screen
- **Android Chrome**: Menu → Install app

### Service Worker

Caches:
- `index.html`
- `manifest.json`
- Static assets

Strategy: Network first, fall back to cache. API requests are not cached.

### Manifest

- Standalone display mode (no browser chrome)
- Dark theme (black background)
- iPhone/iPad compatible
- Maskable icon support

## Styling

CSS is inline in the `<style>` tag. Key classes:

- `.app-container` — Main flex container
- `.app-header` — Title + settings button
- `.content-area` — Upload or transcript
- `.empty-state` — Prompt when no keys configured
- `.upload-area` — Drag-drop zone
- `.modal-overlay` — Settings panel background
- `.modal-content` — Settings panel

Responsive design handles:
- Safe area insets (notches, home indicators)
- Touch-friendly button sizes (44x44pt minimum)
- Mobile and desktop layouts

## Development

### Local Testing

1. Serve files locally (e.g., `python -m http.server 8000`)
2. Open `http://localhost:8000` in a browser
3. Use Chrome DevTools to test as PWA (Application → Manifest)
4. On iOS: Add to Home Screen via Safari

### Adding New Features

1. Add React component inside the `<script type="text/babel">` tag
2. Update state management in the main `MEmory` component
3. Import any external libraries via CDN (add to `<head>`)
4. Commit to git and push to trigger Cloudflare Pages deploy

### Testing API Keys

The app checks for `OPENAI_API_KEY` in localStorage:

```javascript
const apiKey = localStorage.getItem('OPENAI_API_KEY');
if (!apiKey) {
    setError('OpenAI API key not configured');
}
```

## Deployment

Cloudflare Pages automatically deploys on git push:

1. Create GitHub repo at `jennroma127/memory-pwa`
2. Connect to Cloudflare Pages
3. Set build command to empty (static site)
4. Deploy

Custom domain and SSL are automatic.

## Future Work

- **JRO-211**: Template-based Claude summarization UI
- **JRO-212**: Ask Claude chat UI (multi-turn conversation)
- **JRO-213**: Copy + download output UI

All can slot into the existing structure by:
1. Adding new React components in `index.html`
2. Updating the main `MEmory` component to route between features
3. Using the same localStorage pattern for any persistent data

## Known Limitations

- API keys stored plaintext in localStorage (consider backend proxy for production)
- No transcript history (lost on page reload unless cached)
- No sync across devices
- Whisper transcription limited to 25MB files
- No rate limiting (anyone with the key can make unlimited requests)

## Accessibility

- Semantic HTML
- Focus states on buttons
- Color contrast (WCAG AA)
- Touch-friendly sizes
- Safe area support
- No auto-play audio
