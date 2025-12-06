# Cesium Local Build Setup

This directory must contain the Cesium 1.109 build files for local hosting.

## Required Files Structure

```
/static/cesium/
├── Cesium.js                    (Main library - ~2MB)
├── Assets/                      (Assets folder)
├── ThirdParty/                  (Third-party dependencies)
├── Workers/                     (Web Workers - CRITICAL)
│   ├── createVerticesFromHeightmap.js
│   ├── createGeometry.js
│   └── ... (other worker files)
└── Widgets/
    └── widgets.css              (CSS file)
```

## Download Instructions

### Option 1: Download from Cesium Website (Recommended)

1. Visit: https://cesium.com/downloads/
2. Download **Cesium 1.109** (or latest 1.x version)
3. Extract the ZIP file
4. Copy the entire `Build/Cesium/` folder contents to this directory:
   - Copy `Cesium.js` → `/static/cesium/Cesium.js`
   - Copy `Assets/` → `/static/cesium/Assets/`
   - Copy `ThirdParty/` → `/static/cesium/ThirdParty/`
   - Copy `Workers/` → `/static/cesium/Workers/`
   - Copy `Widgets/widgets.css` → `/static/cesium/Widgets/widgets.css`

### Option 2: Use npm/yarn

```bash
npm install cesium@1.109
# or
yarn add cesium@1.109
```

Then copy from `node_modules/cesium/Build/Cesium/` to this directory.

### Option 3: Direct CDN Download (Manual)

Download these files manually:

- `Cesium.js`: https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Cesium.js
- `Widgets/widgets.css`: https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Widgets/widgets.css
- `Workers/createVerticesFromHeightmap.js`: https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Workers/createVerticesFromHeightmap.js
- `Workers/createGeometry.js`: https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Workers/createGeometry.js
- All other files in `Workers/`, `Assets/`, and `ThirdParty/` folders

## Verification

After copying files, verify:
- ✅ `/static/cesium/Cesium.js` exists
- ✅ `/static/cesium/Workers/createVerticesFromHeightmap.js` exists
- ✅ `/static/cesium/Workers/createGeometry.js` exists
- ✅ `/static/cesium/Widgets/widgets.css` exists

## Why Local Hosting?

Cesium 1.109+ requires workers to be hosted locally due to CORS restrictions. Remote worker loading from `cesium.com` will fail with:
- `Failed to execute 'importScripts' on 'WorkerGlobalScope'`
- `NetworkError: Failed to load worker script`

Local hosting ensures all workers load correctly without CORS issues.

