# Split Deployment Guide: Vercel (Frontend) + Render (Backend)

## Overview
This project is configured for split deployment:
- **Frontend (Vercel)**: Static PWA files (`public/` and `src/`)
- **Backend (Render)**: Express API with ML predictions (`backend/`)

## Alternative: Railway (Recommended for WebSockets)

If WebSocket reliability is critical for the phone camera feature, use Railway instead of Render:

### Why Railway over Render?
- **No sleep/wake cycles** - WebSockets stay connected 24/7
- **$5/month free credit** - Enough for small apps to run continuously
- **Same Node.js support** - Drop-in replacement for Render

### Deploy to Railway

1. Go to [railway.app](https://railway.app) and connect your GitHub repo
2. Create new project from GitHub
3. Railway auto-detects `railway.json` configuration
4. Add environment variables in Railway Dashboard:
   ```
   PORT=3000
   NODE_ENV=production
   TFJS_MODEL_PATH=./tfjs_model/model.json
   ENABLE_LOGGING=true
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
5. Deploy and note your Railway URL (e.g., `https://repair-iq-backend.railway.app`)

### Update API Config for Railway

```javascript
// src/config/api.js
BASE_URL: window.location.hostname === 'localhost' 
    ? '' 
    : 'https://your-railway-backend.railway.app',
WS_URL: window.location.hostname === 'localhost'
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
    : 'wss://your-railway-backend.railway.app'
```

---

## Original: Render Deployment

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Name**: `repair-iq-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node main.js`
   - **Plan**: Free

5. Add Environment Variables in Render Dashboard:
   ```
   PORT=10000
   NODE_ENV=production
   TFJS_MODEL_PATH=./tfjs_model/model.json
   ENABLE_LOGGING=true
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

6. Deploy and note your Render URL (e.g., `https://repair-iq-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `public`

3. Deploy and note your Vercel URL (e.g., `https://repair-iq-frontend.vercel.app`)

### 3. Update Configuration Files

#### Update `src/config/api.js`:
```javascript
BASE_URL: window.location.hostname === 'localhost' 
    ? '' 
    : 'https://your-render-backend.onrender.com',
WS_URL: window.location.hostname === 'localhost'
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
    : 'wss://your-render-backend.onrender.com'
```

#### Update `render.yaml`:
```yaml
CORS_ORIGIN: https://your-vercel-app.vercel.app
```

#### Update `vercel.json`:
```json
"env": {
  "REACT_APP_API_URL": "https://your-render-backend.onrender.com"
}
```

### 4. Important: WebSocket Considerations

**WebSockets require special handling on Render's free tier:**
- WebSockets may not work reliably on Render's free tier due to sleep/wake cycles
- For phone camera streaming, consider upgrading to Render's paid tier or using a different WebSocket hosting solution
- The phone camera page (`/phone-camera.html`) is served directly from the Render backend, so the QR code will work correctly

### 5. Redeploy

After updating the config files with your actual URLs:
1. Commit and push changes to GitHub
2. Both Render and Vercel will auto-redeploy

## Local Development

To run locally (monolithic mode):
```bash
cd backend
npm install
npm start
```

Then open `http://localhost:3000`

## Architecture

```
┌─────────────────┐      API Calls      ┌─────────────────┐
│   Vercel        │ ──────────────────▶ │   Render        │
│   (Frontend)    │   /predict          │   (Backend)     │
│                 │   /phone-camera     │                 │
│  public/        │                     │  ML Model       │
│  src/           │ ◀────────────────── │  WebSocket      │
└─────────────────┘   CORS Response     └─────────────────┘
```

## Troubleshooting

**CORS Errors**: Ensure `CORS_ORIGIN` in Render matches your Vercel URL exactly

**WebSocket Failures**: Check that `WS_URL` uses `wss://` (secure) for production

**Model Loading Errors**: Verify `TFJS_MODEL_PATH` points to the correct model location on Render
