"""
RISKCAST Enterprise AI - AI API Endpoints
6 Core AI endpoints with Claude 3.5 Sonnet integration
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from anthropic import Anthropic
from dotenv import load_dotenv
import os
import json
from typing import Dict, Optional, AsyncGenerator

from app.risk_engine import (
    compute_overall_risk,
    compute_route_risk,
    compute_esg_score,
    compute_delay_probability,
    map_risk_to_insurance,
    generate_summary
)
from app.memory import memory_system
from app.utils import sanitize_input, validate_shipment_data, build_ai_prompt

load_dotenv()

router = APIRouter()

# Get API key from environment
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Initialize client only if API key exists
if ANTHROPIC_API_KEY:
    client = Anthropic(api_key=ANTHROPIC_API_KEY)
else:
    client = None


# ==================== PROMPT TEMPLATES ====================

BASE_PROMPT = """You are RISKCAST Enterprise AI — a Logistics Risk Intelligence System.

Your tasks:
1. Identify main risk drivers
2. Quantify risk impact
3. Provide route recommendations
4. Generate insurance guidance
5. Give ESG advisory and carbon insights
6. Predict delay probability
7. Explain reasoning in structured bullets
8. Write in expert tone (KPMG / Deloitte / BCG)

Format your response in structured JSON when possible, or use clear bullet points."""

ANALYZE_PROMPT = """Analyze this shipment and provide:

1. Top 3 risk drivers (with why they matter)
2. What-if analysis (2 scenarios: best case, worst case)
3. Priority actions ranked by impact
4. Executive summary (120 words)

Shipment Data:
{shipment_data}

Risk Analysis:
{risk_analysis}

Provide expert-level insights in KPMG consulting style."""

ROUTE_PROMPT = """Recommend the best route for this shipment:

Shipment Data:
{shipment_data}

Current Route Risk:
{route_risk}

Provide:
1. Best route recommendation (SEA / AIR / RAIL / MULTIMODAL)
2. Estimated risk score for recommended route
3. Supporting evidence: weather, port congestion, political stability
4. Why this route is safer
5. Alternative routes if applicable

Format as structured analysis."""

INSURANCE_PROMPT = """Provide risk-based insurance guidance:

Shipment Data:
{shipment_data}

Risk Analysis:
{risk_analysis}

Insurance Mapping:
{insurance_mapping}

Answer:
1. Should the client buy insurance? (Yes/No/Recommended)
2. Optimal coverage level (Basic/Standard/Comprehensive)
3. Expected Loss (USD)
4. Quantitative reasoning
5. Cost-benefit analysis

Provide expert insurance advisory."""

DELAY_PROMPT = """Predict delivery delay probability:

Shipment Data:
{shipment_data}

Delay Analysis:
{delay_analysis}

Provide:
1. Delay probability (%)
2. Main factors causing delay
3. Prevention measures (actionable)
4. Expected delay duration (days)
5. Risk mitigation strategies

Format as predictive analysis."""

ESG_PROMPT = """Provide ESG and carbon advisory:

Shipment Data:
{shipment_data}

ESG Analysis:
{esg_analysis}

Provide:
1. Carbon footprint (kg CO2e)
2. ESG score breakdown (0–100)
3. How to reduce emissions (specific actions)
4. Environmental impact assessment
5. Social and governance considerations

Format as sustainability advisory."""

HISTORY_PROMPT = """Compare these shipments and provide insights:

Shipment 1:
{shipment_1}

Shipment 2:
{shipment_2}

Comparison Data:
{comparison}

Provide:
1. Risk trend analysis
2. Key differences
3. Historical movement
4. Recommendations based on trends
5. Pattern recognition

Format as comparative analysis."""


# ==================== HELPER FUNCTIONS ====================

async def _call_claude(prompt: str, stream: bool = False) -> str:
    """Call Claude API"""
    if not client:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured"
        )
    
    try:
        from anthropic import APIError
        if stream:
            # For streaming, we'll handle it differently
            response = client.messages.stream(
                model="claude-3-haiku-20240307",
                max_tokens=4096,
                messages=[{"role": "user", "content": prompt}]
            )
            return response
        else:
            response = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=4096,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
    except APIError as e:
        raise HTTPException(
            status_code=e.status_code if hasattr(e, 'status_code') else 500,
            detail=f"Anthropic API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Claude API error: {str(e)}"
        )


async def _stream_response(response_stream) -> AsyncGenerator[str, None]:
    """Stream Claude response"""
    try:
        from anthropic import APIError
        for event in response_stream:
            if event.type == "content_block_delta":
                if hasattr(event.delta, 'text'):
                    yield f"data: {json.dumps({'text': event.delta.text})}\n\n"
            elif event.type == "content_block_stop":
                yield "data: [DONE]\n\n"
    except APIError as e:
        yield f"data: {json.dumps({'error': f'Anthropic API error: {str(e)}'})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"


# ==================== API ENDPOINTS ====================

@router.get("/health")
async def health():
    """Health check endpoint"""
    if not ANTHROPIC_API_KEY:
        return {
            "status": "error",
            "message": "ANTHROPIC_API_KEY not configured"
        }
    return {"status": "ok", "model": "claude-3-5-sonnet"}


@router.post("/stream")
async def stream(payload: dict):
    """
    Streaming AI response endpoint (real-time)
    
    Input:
        prompt: User prompt
        context: Optional context data
    
    Output:
        Streaming text response
    """
    prompt = payload.get("prompt", "")
    context = payload.get("context", {})
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    # Build full prompt
    full_prompt = BASE_PROMPT + "\n\n" + prompt
    if context:
        full_prompt += f"\n\nContext: {json.dumps(context, indent=2)}"
    
    if not client:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured"
        )
    
    try:
        response_stream = client.messages.stream(
            model="claude-3-haiku-20240307",
            max_tokens=4096,
            messages=[{"role": "user", "content": full_prompt}]
        )
        
        return StreamingResponse(
            _stream_response(response_stream),
            media_type="text/event-stream"
        )
    except Exception as e:
        from anthropic import APIError
        if isinstance(e, APIError):
            raise HTTPException(
                status_code=e.status_code if hasattr(e, 'status_code') else 500,
                detail=f"Anthropic API error: {str(e)}"
            )
        raise HTTPException(
            status_code=500,
            detail=f"Streaming error: {str(e)}"
        )


@router.post("/analyze")
async def analyze(payload: dict):
    """
    AI Insights Panel - Main risk analysis
    
    Input:
        route, cargo, incoterm, carrier, season, political_risk, etc.
    
    Output:
        Main risks, top drivers, scenario analysis, recommendations
    """
    shipment_data = sanitize_input(payload.get("shipment_data", {}))
    
    # Validate
    is_valid, error = validate_shipment_data(shipment_data)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)
    
    # Calculate risk
    from app.core.risk_engine_v14 import calculate_enterprise_risk
    risk_result = calculate_enterprise_risk(shipment_data)
    
    # Build prompt
    prompt = ANALYZE_PROMPT.format(
        shipment_data=json.dumps(shipment_data, indent=2),
        risk_analysis=json.dumps({
            "overall_risk": risk_result.get("overall_risk_index", 50),
            "risk_level": risk_result.get("risk_level", "Medium"),
            "expected_loss": risk_result.get("expected_loss", 0)
        }, indent=2)
    )
    
    # Get AI response
    ai_response = await _call_claude(prompt)
    
    # Save to memory
    shipment_id = memory_system.save_shipment(
        shipment_data,
        risk_result,
        generate_summary(shipment_data, risk_result)
    )
    
    return {
        "status": "success",
        "shipment_id": shipment_id,
        "insights": {
            "ai_analysis": ai_response,
            "overall_risk": risk_result.get("overall_risk_index", 50),
            "risk_level": risk_result.get("risk_level", "Medium"),
            "expected_loss": risk_result.get("expected_loss", 0),
            "reliability": risk_result.get("reliability_score", 50)
        },
        "summary": generate_summary(shipment_data, risk_result),
        "drivers": risk_result.get("risk_factors", {}),
        "scenarios": risk_result.get("scenario_analysis", {}),
        "actions": risk_result.get("recommendations", [])
    }


@router.post("/route")
async def route_recommendation(payload: dict):
    """
    AI-Recommended Route
    
    Input:
        shipment_data with route information
    
    Output:
        Best route recommendation with evidence
    """
    shipment_data = sanitize_input(payload.get("shipment_data", {}))
    
    # Calculate route risk
    route_risk = compute_route_risk(shipment_data)
    
    # Build prompt
    prompt = ROUTE_PROMPT.format(
        shipment_data=json.dumps(shipment_data, indent=2),
        route_risk=json.dumps(route_risk, indent=2)
    )
    
    # Get AI response
    ai_response = await _call_claude(prompt)
    
    return {
        "status": "success",
        "recommended_route": route_risk.get("recommended_mode", "sea"),
        "route_analysis": ai_response,
        "route_risk": route_risk,
        "evidence": {
            "weather_risk": route_risk.get("weather_risk", 50),
            "port_risk": route_risk.get("port_risk", 50),
            "reliability": route_risk.get("transport_reliability", 50)
        }
    }


@router.post("/insurance")
async def insurance_optimizer(payload: dict):
    """
    Risk-Based Insurance Optimizer
    
    Input:
        shipment_data, overall_risk
    
    Output:
        Insurance recommendation, coverage level, expected loss
    """
    shipment_data = sanitize_input(payload.get("shipment_data", {}))
    
    # Calculate overall risk
    overall_risk = compute_overall_risk(shipment_data)
    
    # Map to insurance
    insurance_mapping = map_risk_to_insurance(shipment_data, overall_risk)
    
    # Build prompt
    prompt = INSURANCE_PROMPT.format(
        shipment_data=json.dumps(shipment_data, indent=2),
        risk_analysis=json.dumps({"overall_risk": overall_risk}, indent=2),
        insurance_mapping=json.dumps(insurance_mapping, indent=2)
    )
    
    # Get AI response
    ai_response = await _call_claude(prompt)
    
    return {
        "status": "success",
        "recommendation": insurance_mapping.get("recommendation", "Optional"),
        "coverage_level": insurance_mapping.get("coverage_level", "Basic"),
        "expected_loss_usd": insurance_mapping.get("expected_loss_usd", 0),
        "reasoning": insurance_mapping.get("reasoning", ""),
        "ai_advisory": ai_response,
        "insurance_details": insurance_mapping
    }


@router.post("/delay")
async def delay_prediction(payload: dict):
    """
    Predictive Delay Analysis
    
    Input:
        shipment_data
    
    Output:
        Delay probability, main factors, prevention measures
    """
    shipment_data = sanitize_input(payload.get("shipment_data", {}))
    
    # Calculate delay probability
    delay_analysis = compute_delay_probability(shipment_data)
    
    # Build prompt
    prompt = DELAY_PROMPT.format(
        shipment_data=json.dumps(shipment_data, indent=2),
        delay_analysis=json.dumps(delay_analysis, indent=2)
    )
    
    # Get AI response
    ai_response = await _call_claude(prompt)
    
    return {
        "status": "success",
        "delay_probability_percent": delay_analysis.get("delay_probability_percent", 30),
        "expected_delay_days": delay_analysis.get("expected_delay_days", 2),
        "main_factors": delay_analysis.get("main_factors", []),
        "prevention_measures": delay_analysis.get("prevention_measures", []),
        "ai_analysis": ai_response,
        "reliability_score": delay_analysis.get("reliability_score", 50)
    }


@router.post("/esg")
async def esg_advisory(payload: dict):
    """
    Carbon + ESG Advisory
    
    Input:
        shipment_data
    
    Output:
        Carbon footprint, ESG score, reduction strategies
    """
    shipment_data = sanitize_input(payload.get("shipment_data", {}))
    
    # Calculate ESG score
    esg_analysis = compute_esg_score(shipment_data)
    
    # Build prompt
    prompt = ESG_PROMPT.format(
        shipment_data=json.dumps(shipment_data, indent=2),
        esg_analysis=json.dumps(esg_analysis, indent=2)
    )
    
    # Get AI response
    ai_response = await _call_claude(prompt)
    
    return {
        "status": "success",
        "esg_score": esg_analysis.get("esg_score", 50),
        "carbon_footprint_kg": esg_analysis.get("carbon_footprint_kg", 0),
        "green_score": esg_analysis.get("green_score", 50),
        "social_score": esg_analysis.get("social_score", 50),
        "governance_score": esg_analysis.get("governance_score", 50),
        "climate_impact": esg_analysis.get("climate_impact", ""),
        "ai_advisory": ai_response,
        "esg_details": esg_analysis
    }


@router.post("/history")
async def history_comparison(payload: dict):
    """
    Mini AI Memory - Compare shipments
    
    Input:
        shipment_id_1, shipment_id_2 (optional)
    
    Output:
        Comparison analysis, historical trend
    """
    shipment_id_1 = payload.get("shipment_id_1")
    shipment_id_2 = payload.get("shipment_id_2")
    
    if shipment_id_1 and shipment_id_2:
        # Compare two specific shipments
        comparison = memory_system.compare_shipments(shipment_id_1, shipment_id_2)
        
        if comparison.get("status") == "error":
            raise HTTPException(status_code=404, detail=comparison.get("error"))
        
        # Build prompt
        prompt = HISTORY_PROMPT.format(
            shipment_1=json.dumps(comparison.get("shipment_1", {}), indent=2),
            shipment_2=json.dumps(comparison.get("shipment_2", {}), indent=2),
            comparison=json.dumps(comparison.get("comparison", {}), indent=2)
        )
        
        # Get AI response
        ai_response = await _call_claude(prompt)
        
        return {
            "status": "success",
            "comparison": comparison,
            "ai_analysis": ai_response
        }
    else:
        # Get historical trend
        limit = payload.get("limit", 5)
        trend = memory_system.get_historical_trend(limit)
        
        return {
            "status": "success",
            "trend": trend,
            "recent_shipments": memory_system.get_all_shipments(limit)
        }


class PromptData(BaseModel):
    prompt: str


@router.post("/adviser")
async def ai_adviser(data: PromptData):
    """
    AI Adviser endpoint - Simple prompt/response
    
    Input:
        prompt: User prompt
    
    Output:
        AI response
    """
    try:
        from anthropic import APIError
        if not client:
            raise HTTPException(
                status_code=500,
                detail="ANTHROPIC_API_KEY not configured"
            )
        
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=300,
            messages=[{"role": "user", "content": data.prompt}]
        )
        
        reply = response.content[0].text
        return {"reply": reply}
    except APIError as e:
        raise HTTPException(
            status_code=e.status_code if hasattr(e, 'status_code') else 500,
            detail=f"Anthropic API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
