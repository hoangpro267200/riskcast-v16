# app/core/risk_service_v14.py
from typing import Dict, Any

# ===========================================
# IMPORT ENGINE THẬT (Hoàng thay vào ở đây)
# ===========================================
# Ví dụ nếu engine nằm ở: app/core/risk_engine_v14.py
# from app.core.risk_engine_v14 import run_full_risk_engine_v14
#
# Sau này Hoàng chỉ cần bỏ comment dòng trên,
# và thay pass bằng:
#     result = run_full_risk_engine_v14(payload)
# ===========================================


def run_risk_engine_v14(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adapter JSON → Risk Engine v14.
    Bắt mọi lỗi để tránh Render bị 500.

    Nếu engine lỗi → trả fallback (demo data)
    để UI results.html vẫn chạy mượt.
    """

    try:
        # ================================
        # CALL ENGINE THẬT (Hoàng bật lên)
        # ================================
        # result = run_full_risk_engine_v14(payload)
        # return result
        pass

    except Exception as e:
        print("[RISKCAST v14] ENGINE ERROR:", e)
        print("[RISKCAST v14] Using fallback demo outputs...")

    # ==========================================================
    # FALLBACK DATA — giúp UI chạy mượt (Demo mode)
    # ==========================================================

    cargo_value = float(payload.get("cargo_value", 120000))
    transit_days = float(payload.get("transit_days", 18))

    return {
        "risk_score": 68.5,
        "risk_level": "MEDIUM-HIGH",
        "expected_loss": round(cargo_value * 0.08, 2),
        "var": round(cargo_value * 0.12, 2),
        "cvar": round(cargo_value * 0.18, 2),
        "reliability": 81.0,
        "esg": 57.0,

        # Shipment info
        "route": payload.get("route", "HCMC → Los Angeles"),
        "incoterm": payload.get("incoterm", "FOB"),
        "transport_mode": payload.get("transport_mode", "SEA"),
        "cargo_value": cargo_value,
        "transit_days": transit_days,
        "priority_mode": payload.get("priority_mode", "Standard"),

        # Risk inputs
        "weather_risk": float(payload.get("weather_risk", 6)),
        "port_risk": float(payload.get("port_risk", 7)),

        # ==== 8 LAYERS for Research + Radar ====
        "layers": [
            {"name": "Port Congestion", "score": 72},
            {"name": "Weather / Climate", "score": 65},
            {"name": "Carrier Reliability", "score": 58},
            {"name": "Customs & Docs", "score": 49},
            {"name": "Operational", "score": 61},
            {"name": "Political", "score": 44},
            {"name": "FX / Financial", "score": 55},
            {"name": "ESG / Compliance", "score": 52},
        ],

        "radar": {
            "labels": [
                "Port", "Weather", "Carrier", "Customs",
                "Ops", "Political", "FX", "ESG"
            ],
            "values": [72, 65, 58, 49, 61, 44, 55, 52],
        },

        # Monte Carlo samples (Hoàng thay bằng real MC)
        "mc_samples": [],
    }
