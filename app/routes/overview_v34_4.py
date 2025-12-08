# app/routes/overview_v34_4.py
"""
RISKCAST Overview v34.4 Ultra Vision Pro - Backend Route
Full data sync from INPUT → Backend → Overview pipeline
"""
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from app.core.templates import templates
from app.memory import memory_system
import json
from typing import Optional, Dict, Any
import importlib.util
from pathlib import Path

# Import LAST_RESULT from app/api.py
_api_module_path = Path(__file__).parent.parent / "api.py"
_api_spec = importlib.util.spec_from_file_location("_api_module", _api_module_path)
_api_module = importlib.util.module_from_spec(_api_spec)
_api_spec.loader.exec_module(_api_module)
LAST_RESULT = _api_module.LAST_RESULT

# Port database with lat/lon
PORT_DATABASE = {
    'VNSGN': {'name': 'Ho Chi Minh', 'country': 'Vietnam', 'code': 'VNSGN', 'lat': 10.8231, 'lon': 106.6297},
    'SGN': {'name': 'Ho Chi Minh', 'country': 'Vietnam', 'code': 'VNSGN', 'lat': 10.8231, 'lon': 106.6297},
    'CMP': {'name': 'Cai Mep', 'country': 'Vietnam', 'code': 'CMP', 'lat': 10.5, 'lon': 107.2},
    'CNSHA': {'name': 'Shanghai', 'country': 'China', 'code': 'CNSHA', 'lat': 31.2304, 'lon': 121.4737},
    'SHA': {'name': 'Shanghai', 'country': 'China', 'code': 'CNSHA', 'lat': 31.2304, 'lon': 121.4737},
    'SGSIN': {'name': 'Singapore', 'country': 'Singapore', 'code': 'SGSIN', 'lat': 1.3521, 'lon': 103.8198},
    'SIN': {'name': 'Singapore', 'country': 'Singapore', 'code': 'SGSIN', 'lat': 1.3521, 'lon': 103.8198},
    'HKHKG': {'name': 'Hong Kong', 'country': 'Hong Kong', 'code': 'HKHKG', 'lat': 22.3193, 'lon': 114.1694},
    'HKG': {'name': 'Hong Kong', 'country': 'Hong Kong', 'code': 'HKHKG', 'lat': 22.3193, 'lon': 114.1694},
    'USLAX': {'name': 'Los Angeles', 'country': 'USA', 'code': 'USLAX', 'lat': 33.7701, 'lon': -118.1937},
    'LAX': {'name': 'Los Angeles', 'country': 'USA', 'code': 'USLAX', 'lat': 33.7701, 'lon': -118.1937},
    'USJFK': {'name': 'New York', 'country': 'USA', 'code': 'USJFK', 'lat': 40.6413, 'lon': -73.7781},
    'JFK': {'name': 'New York', 'country': 'USA', 'code': 'USJFK', 'lat': 40.6413, 'lon': -73.7781},
}

def get_port_info(port_code: str) -> Dict[str, Any]:
    """Get port information from database"""
    if not port_code:
        return PORT_DATABASE.get('VNSGN', {'name': 'Unknown', 'country': 'Unknown', 'code': 'UNK', 'lat': 0, 'lon': 0})
    port_code = port_code.upper()
    return PORT_DATABASE.get(port_code, PORT_DATABASE.get('VNSGN', {'name': 'Unknown', 'country': 'Unknown', 'code': 'UNK', 'lat': 0, 'lon': 0}))

def extract_trade_lane(pol_code: str, pod_code: str) -> str:
    """Extract trade lane key from POL/POD codes"""
    if not pol_code or not pod_code:
        return 'vn_cn'  # Default
    
    pol_code = pol_code.upper()
    pod_code = pod_code.upper()
    
    # Map country codes
    country_map = {
        'VN': 'vn', 'SGN': 'vn', 'CMP': 'vn', 'HPH': 'vn',
        'CN': 'cn', 'SHA': 'cn', 'SZN': 'cn', 'CAN': 'cn', 'NGB': 'cn',
        'HK': 'hk', 'HKG': 'hk',
        'SG': 'sg', 'SIN': 'sg',
        'US': 'us', 'LAX': 'us', 'JFK': 'us',
        'JP': 'jp',
        'KR': 'kr',
        'EU': 'eu',
        'TH': 'th',
        'TW': 'tw',
        'IN': 'in'
    }
    
    # Extract country from codes
    pol_country = None
    pod_country = None
    
    for code, country in country_map.items():
        if code in pol_code:
            pol_country = country
        if code in pod_code:
            pod_country = country
    
    if pol_country and pod_country:
        return f"{pol_country}_{pod_country}"
    
    return 'vn_cn'  # Default fallback

router = APIRouter()

@router.get("/overview-v34-4", response_class=HTMLResponse)
async def overview_v34_4_page(request: Request):
    """
    Overview v34.4 Ultra Vision Pro - Full data sync from INPUT page
    
    Builds __RISKCAST_STATE__ from:
    1. memory_system.get("latest_shipment")
    2. LAST_RESULT (legacy fallback)
    3. Session data (if available)
    """
    
    # Priority 1: Get shipment data from session (most recent)
    shipment_data = {}
    if hasattr(request, 'session'):
        shipment_data = request.session.get("shipment_state", {}) or request.session.get("shipment_data", {}) or {}
    
    # Priority 2: Get from memory system
    if not shipment_data:
        shipment_data = memory_system.get("latest_shipment") or {}
    
    # Priority 3: Get from LAST_RESULT (legacy)
    if not shipment_data and LAST_RESULT:
        shipment = LAST_RESULT.get('shipment', {})
        if shipment:
            shipment_data = {
                'transport_mode': shipment.get('transport_mode', ''),
                'route': shipment.get('route', ''),
                'eta': shipment.get('eta', ''),
                'etd': shipment.get('etd', ''),
                'cargo_type': shipment.get('cargo_type', ''),
                'cargo_value': shipment.get('cargo_value', 0),
                'pol_code': shipment.get('origin', ''),
                'pod_code': shipment.get('destination', ''),
                'risk_score': LAST_RESULT.get('overall_risk', 7.2),
                'risk_level': LAST_RESULT.get('risk_level', 'Medium')
            }
    
    # Extract key fields
    pol_code = shipment_data.get("pol_code") or shipment_data.get("origin") or "VNSGN"
    pod_code = shipment_data.get("pod_code") or shipment_data.get("destination") or "CNSHA"
    transport_mode = shipment_data.get("transport_mode", "ocean_fcl")
    
    # Extract trade lane
    trade_lane = extract_trade_lane(pol_code, pod_code)
    
    # Get port info
    pol_info = get_port_info(pol_code)
    pod_info = get_port_info(pod_code)
    
    # Build __RISKCAST_STATE__ (EXACT format as specified)
    riskcast_state = {
        "transport": {
            "mode": transport_mode.replace("_fcl", "").replace("_lcl", "").replace("_", " ").title() if transport_mode else "Ocean",
            "pol": pol_info.get('name', 'Unknown'),
            "polCode": pol_code,
            "pod": pod_info.get('name', 'Unknown'),
            "podCode": pod_code,
            "totalDistance": "0 km",  # Will be calculated from logistics_data
            "segmentCount": 0,  # Will be calculated from logistics_data
            "tradeLane": trade_lane
        },
        "cargo": {
            "commodity": shipment_data.get("cargo_type", "") or "-",
            "weight": str(shipment_data.get("weight", shipment_data.get("cargo_weight", ""))) or "-",
            "volume": str(shipment_data.get("volume", shipment_data.get("cargo_volume", ""))) or "-",
            "containerType": shipment_data.get("container", shipment_data.get("container_type", "")) or "-",
            "hsCode": shipment_data.get("hs_code", "") or "-"
        },
        "parties": {
            "shipper": shipment_data.get("shipper", shipment_data.get("seller", "")) or "-",
            "consignee": shipment_data.get("consignee", shipment_data.get("buyer", "")) or "-",
            "forwarder": shipment_data.get("forwarder", "") or "-"
        },
        "risk": {
            "score": float(shipment_data.get("risk_score", 7.2)) if shipment_data.get("risk_score") else 7.2,
            "weatherRisk": shipment_data.get("weather_risk", shipment_data.get("weather", "")) or "-",
            "congestion": shipment_data.get("port_risk", shipment_data.get("congestion", "")) or "-",
            "delayProb": shipment_data.get("delay_probability", "") or "-"
        }
    }
    
    # Convert to dict (Jinja2 will handle JSON serialization with |tojson filter)
    # Pass as dict, not JSON string, so template can use |tojson filter safely
    
    try:
        return templates.TemplateResponse(
            "overview_v34_4.html",
            {
                "request": request,
                "RISKCAST_STATE": riskcast_state  # Pass as dict, not JSON string
            }
        )
    except Exception as e:
        # Fallback: return error page or redirect
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={
                "error": "Template rendering error",
                "message": str(e),
                "template": "overview_v34_4.html"
            }
        )

