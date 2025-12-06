# PHASE 4 — Import Fixes Applied

## ✅ FIXED IMPORTS

### 1. Python Imports (3 files fixed)
- ✅ `app/core/legacy/riskcast_v14_5_integration_patches.py`
  - Fixed: `from app.core.riskcast_v14_5_climate_upgrade` → `from app.core.legacy.riskcast_v14_5_climate_upgrade`

- ✅ `app/core/legacy/riskcast_v14_5_climate_demo.py`
  - Fixed: `from app.core.riskcast_v14_5_climate_upgrade` → `from app.core.legacy.riskcast_v14_5_climate_upgrade`

- ✅ `app/core/legacy/RISKCAST_v14_5_README.py`
  - Fixed: `from app.core.riskcast_v14_5_climate_upgrade` → `from app.core.legacy.riskcast_v14_5_climate_upgrade`

### 2. JavaScript Imports in Templates (6 files fixed)
- ✅ `app/templates/pages/overview.html`
  - Fixed: `/static/js/riskcast_data_store.js` → `/static/js/core/riskcast_data_store.js`

- ✅ `app/templates/overview.html`
  - Fixed: `/static/js/riskcast_data_store.js` → `/static/js/core/riskcast_data_store.js`

- ✅ `app/templates/layouts/dashboard_layout.html`
  - Fixed: `/static/js/translations_vi.js` + `/static/js/translations_en.js` → `/static/js/core/translations.js`

- ✅ `app/templates/results.html`
  - Fixed: `/static/js/translations_en.js` + `/static/js/translations_vi.js` + `/static/js/common_lang.js` → `/static/js/core/translations.js`
  - Fixed: `/static/js/streaming.js` → `/static/js/core/streaming.js`

- ✅ `app/templates/dashboard.html`
  - Fixed: `/static/js/translations_vi.js` + `/static/js/translations_en.js` → `/static/js/core/translations.js`

- ✅ `app/templates/input.html`
  - Fixed: `/static/js/streaming.js` → `/static/js/core/streaming.js`
  - Fixed: `/static/js/riskcast_data_store.js` → `/static/js/core/riskcast_data_store.js`

## ⚠️ DUPLICATE TEMPLATES FOUND

1. **`base.html`** (root) vs **`layouts/base.html`** (new structure)
   - `main.py` doesn't reference `base.html` directly
   - New structure uses `layouts/base.html`
   - **Action**: Keep `layouts/base.html`, remove root `base.html` (but verify first)

2. **`overview.html`** (root) vs **`pages/overview.html`** (new structure)
   - `main.py` references `pages/overview.html` ✅
   - **Action**: Keep `pages/overview.html`, remove root `overview.html` (but verify first)

## 📋 REMAINING FIXES NEEDED

### 3. Template Extends/Includes
- Need to verify all `{% extends %}` paths
- Need to verify all `{% include %}` paths

### 4. Dead Code Removal
- Remove old translation files after consolidation:
  - `app/static/js/translations_vi.js` (consolidated into `core/translations.js`)
  - `app/static/js/translations_en.js` (consolidated into `core/translations.js`)
  - `app/static/js/common_lang.js` (consolidated into `core/translations.js`)
- Remove duplicate templates after verification

### 5. Console.log Cleanup
- Found 25+ console.log/warn statements in templates
- Should remove or comment out for production

## 🎯 NEXT STEPS

1. Verify duplicate templates are truly unused
2. Remove old translation files
3. Remove duplicate templates
4. Clean up console.log statements
5. Check for other broken imports




















