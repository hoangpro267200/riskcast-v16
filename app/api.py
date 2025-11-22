# app/api.py
from fastapi import APIRouter, HTTPException, Request, Body
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from pydantic import Field

from app.core.risk_service_v14 import run_risk_engine_v14

router = APIRouter()

# Store last result
LAST_RESULT: Optional[Dict[str, Any]] = None


class Shipment(BaseModel):
    """Shipment model matching Option A schema exactly"""
    transport_mode: str
    cargo_type: str
    route: str
    incoterm: str
    container: str
    packaging: str
    priority: str
    packages: int
    etd: str
    eta: str
    transit_time: float
    cargo_value: float
    use_fuzzy: bool
    use_forecast: bool
    use_mc: bool
    use_var: bool
    # === CLIMATE FIELDS (v14.5) =================================
    ENSO_index: float = 0.0
    typhoon_frequency: float = 0.5
    sst_anomaly: float = 0.0
    port_climate_stress: float = 5.0
    climate_volatility_index: float = 5.0
    climate_tail_event_probability: float = 0.05
    ESG_score: float = 50.0
    climate_resilience: float = 5.0
    green_packaging: float = 5.0
    # === BUYER-SELLER FIELDS (v16.2) =================================
    buyer: Optional[Dict[str, Any]] = Field(default=None)
    seller: Optional[Dict[str, Any]] = Field(default=None)
    # === PRIORITY PROFILE FIELDS =====================================
    priority_profile: Optional[str] = Field(default=None)
    priority_weights: Optional[Dict[str, int]] = Field(default=None)


@router.post("/analyze")
async def analyze(shipment: Shipment):
    """
    Analyze shipment risk using RISKCAST v14.5 engine with climate intelligence.
    
    Accepts shipment data, runs full risk analysis pipeline, and stores result.
    Returns status and redirect URL for results page.
    """
    global LAST_RESULT

    try:
        # Convert Shipment to dict for engine
        shipment_dict = shipment.model_dump()
        
        # Run risk engine with climate v14.5 upgrade
        result = run_risk_engine_v14(shipment_dict)
        
        # Store result for retrieval
        LAST_RESULT = result
        
        # Return success response
        return {
            "status": "ok",
            "redirect_url": "/results",
            "result": {
                "risk_score": result.get("risk_score", 0.5),
                "risk_level": result.get("risk_level", "MODERATE"),
                "expected_loss": result.get("expected_loss", 0)
            }
        }
    except Exception as e:
        print(f"[API ERROR] Analysis failed: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Risk engine failed: {str(e)}")


@router.post("/run")
async def run(shipment: Shipment):
    """
    Legacy endpoint - redirects to /analyze for backward compatibility.
    """
    return await analyze(shipment)


@router.post("/run_risk")
async def run_risk(shipment: Shipment):
    """
    Alias for /run endpoint - for backward compatibility with frontend.
    """
    return await analyze(shipment)


@router.post("/run_analysis")
async def run_analysis(request: Request):
    """
    Run risk analysis endpoint for simplified frontend payload.
    Accepts dict payload and transforms to Shipment model format.
    """
    global LAST_RESULT

    try:
        # Get JSON body from request
        payload = await request.json()
        
        # Transform payload to Shipment format
        shipment_dict = {
            "transport_mode": payload.get("transport_mode", ""),
            "cargo_type": payload.get("cargo_type", "general"),
            "route": payload.get("route", ""),
            "incoterm": payload.get("incoterm", ""),
            "container": payload.get("container", ""),
            "packaging": payload.get("packaging", ""),
            "priority": payload.get("priority", ""),
            "packages": int(payload.get("packages", 0)) if payload.get("packages") else 0,
            "etd": payload.get("etd", ""),
            "eta": payload.get("eta", ""),
            "transit_time": float(payload.get("transit_time", 0)) if payload.get("transit_time") else 0.0,
            "cargo_value": float(payload.get("cargo_value", 0)) if payload.get("cargo_value") else 0.0,
            "use_fuzzy": payload.get("use_fuzzy", False),
            "use_forecast": payload.get("use_forecast", False),
            "use_mc": payload.get("use_mc", False),
            "use_var": payload.get("use_var", False),
            # Climate fields with defaults
            "ENSO_index": payload.get("ENSO_index", 0.0),
            "typhoon_frequency": payload.get("typhoon_frequency", 0.5),
            "sst_anomaly": payload.get("sst_anomaly", 0.0),
            "port_climate_stress": payload.get("port_climate_stress", 5.0),
            "climate_volatility_index": payload.get("climate_volatility_index", 5.0),
            "climate_tail_event_probability": payload.get("climate_tail_event_probability", 0.05),
            "ESG_score": payload.get("ESG_score", 50.0),
            "climate_resilience": payload.get("climate_resilience", 5.0),
            "green_packaging": payload.get("green_packaging", 5.0),
            # Buyer/Seller info
            "buyer": payload.get("buyer"),
            "seller": payload.get("seller"),
            "priority_profile": payload.get("priority_profile"),
            "priority_weights": payload.get("priority_weights")
        }
        
        # Create Shipment model instance
        shipment = Shipment(**shipment_dict)
        
        # Run analysis using existing analyze function
        return await analyze(shipment)
        
    except Exception as e:
        print(f"[API ERROR] run_analysis failed: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Risk analysis failed: {str(e)}")


@router.get("/get_last_result")
async def get_last_result():
    """
    Retrieve the last computed risk analysis result.
    
    Returns the full result JSON if available, or error message if no result exists.
    This endpoint is called by the results page to display analysis data.
    """
    if LAST_RESULT is None:
        return {"error": "no_result"}
    
    return LAST_RESULT

