"""
===============================================================
RISKCAST v14.5 — Climate Demo Data Generator
Generate demo climate data for testing

Author: Kai × Hoàng | v14.5 Demo
===============================================================
"""

from app.core.riskcast_v14_5_climate_upgrade import ClimateVariables


def generate_demo_climate_variables() -> ClimateVariables:
    """Generate demo climate variables for testing"""
    return ClimateVariables(
        ENSO_index=1.5,  # Moderate El Niño
        seasonal_typhoon_frequency=0.65,  # Elevated typhoon risk
        sea_surface_temperature_anomaly=0.8,  # +0.8°C anomaly
        port_climate_stress_score=6.5,  # Moderate-high port stress
        long_term_climate_volatility_index=6.0,  # Elevated volatility
        climate_tail_event_probability=0.08,  # 8% extreme event probability
        ESG_score=62.0,  # Above average ESG
        climate_resilience_score=6.5,  # Good resilience
        green_packaging_score=7.0,  # Good green packaging
    )


def generate_climate_scenarios() -> dict:
    """Generate different climate scenarios for testing"""
    return {
        'low_risk': ClimateVariables(
            ENSO_index=-0.5,
            seasonal_typhoon_frequency=0.3,
            sea_surface_temperature_anomaly=-0.2,
            port_climate_stress_score=3.5,
            long_term_climate_volatility_index=4.0,
            climate_tail_event_probability=0.02,
            ESG_score=75.0,
            climate_resilience_score=8.0,
            green_packaging_score=8.5
        ),
        'moderate_risk': ClimateVariables(
            ENSO_index=0.5,
            seasonal_typhoon_frequency=0.5,
            sea_surface_temperature_anomaly=0.3,
            port_climate_stress_score=5.0,
            long_term_climate_volatility_index=5.0,
            climate_tail_event_probability=0.05,
            ESG_score=50.0,
            climate_resilience_score=5.0,
            green_packaging_score=5.0
        ),
        'high_risk': ClimateVariables(
            ENSO_index=2.0,
            seasonal_typhoon_frequency=0.8,
            sea_surface_temperature_anomaly=1.2,
            port_climate_stress_score=8.0,
            long_term_climate_volatility_index=8.0,
            climate_tail_event_probability=0.12,
            ESG_score=35.0,
            climate_resilience_score=3.5,
            green_packaging_score=3.0
        )
    }







