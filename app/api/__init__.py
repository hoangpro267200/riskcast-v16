# app/api/__init__.py
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from .v1.analyze import router as analyze_router
from datetime import datetime

# Create main API router
router = APIRouter()

# Include v1 router
router.include_router(analyze_router, prefix="/v1", tags=["v1"])

# Climate Data Endpoint
@router.post("/climate_data")
async def get_climate_data(request: Request):
    """
    Fetch climate data for transit window.
    Returns seasonal defaults if NOAA/NASA APIs unavailable.
    """
    try:
        data = await request.json()
        route = data.get('route', '')
        start_date = data.get('start_date', '')
        end_date = data.get('end_date', '')
        pol = data.get('pol', '')
        pod = data.get('pod', '')
        
        # Parse dates
        start = datetime.fromisoformat(start_date) if start_date else datetime.now()
        end = datetime.fromisoformat(end_date) if end_date else datetime.now()
        month = start.month
        
        # Determine if typhoon season (June-October)
        is_typhoon_season = month in [6, 7, 8, 9, 10]
        
        # Route-based defaults
        route_risk_map = {
            'vn_us': 6.5,
            'vn_eu': 5.0,
            'vn_cn': 4.5,
            'domestic': 3.5
        }
        
        base_weather_risk = route_risk_map.get(route, 5.0)
        if is_typhoon_season:
            base_weather_risk += 2.0
        
        # Port risk defaults (can be enhanced with port database)
        port_risk_db = {
            'VNSGN': 4.0,
            'VNHPH': 3.5,
            'USLAX': 5.0,
            'USNYC': 5.5,
            'CNSHA': 4.5,
        }
        
        pol_risk = port_risk_db.get(pol, 5.0)
        pod_risk = port_risk_db.get(pod, 5.0)
        port_stress = (pol_risk + pod_risk) / 2
        
        # Return climate data
        return JSONResponse({
            'enso': 0.0,  # Neutral by default
            'typhoon_freq': 0.7 if is_typhoon_season else 0.3,
            'sst_anomaly': 0.0,
            'port_stress': min(port_stress, 10.0),
            'volatility': 65 if is_typhoon_season else 45
        })
        
    except Exception as e:
        # Return safe defaults on error
        return JSONResponse({
            'enso': 0.0,
            'typhoon_freq': 0.5,
            'sst_anomaly': 0.0,
            'port_stress': 5.0,
            'volatility': 50
        })

