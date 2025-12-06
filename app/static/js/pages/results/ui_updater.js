
import { $id, setText } from '../../core/dom.js';

function safe(...values) {
    for (const v of values) {
        if (v !== null && v !== undefined && v !== '') return v;
    }
    return values[values.length - 1];
}

function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return parseFloat(num).toFixed(decimals);
}

function formatUSD(amount) {
    if (!amount || isNaN(amount)) return '$0';
    return '$' + parseInt(amount).toLocaleString('en-US');
}

function formatPercent(value) {
    return formatNumber(value, 1) + '%';
}

function translateRouteType(type) {
    const types = {
        "direct": "Direct - Trực tiếp",
        "standard": "Standard - Tiêu chuẩn",
        "complex": "Complex - Phức tạp",
        "hazardous": "Hazardous - Nguy hiểm"
    };
    return types[type] || type;
}

export function updateHeader(data, appData) {
    // Update status
    setText("statusText", "Phân Tích Hoàn Tất");
    
    // Update route from backend data.route
    let route = safe(data.route, appData?.meta?.route, "—");
    setText("routeChip", route || "—");
    
    // Update date from backend data.analysis_date
    const date = safe(data.analysis_date, appData?.meta?.analysis_date, new Date().toISOString().split('T')[0]);
    setText("dateChip", date);
    
}

export function updateSummaryCards(data) {
    const riskScore = (safe(data.risk_score, 0.5)) * 10;
    setText("overall-risk-index", formatNumber(riskScore, 1));
    setText("risk-level-label", safe(data.risk_level, "MODERATE"));

    const expectedLoss = safe(data.expected_loss, 0);
    setText("expected-loss", formatUSD(expectedLoss));

    const reliability = (safe(data.reliability, 0.88)) * 100;
    setText("reliability-score", formatNumber(reliability, 1) + "%");

    const esg = (safe(data.esg, 0.72)) * 100;
    setText("esg-score", formatNumber(esg, 1));

    // NEW KPI CARDS
    const climateHazard = safe(data.climate_v14?.climate_hazard_index, data.climate_hazard_index, 5.0);
    setText("climate-hazard-index", formatNumber(climateHazard, 1));

    const distance = safe(data.advanced_parameters?.distance, data.distance, 5000);
    if (distance && typeof distance === 'number') {
        setText("transport-distance", distance.toLocaleString("vi-VN") + " km");
    } else {
        setText("transport-distance", "N/A");
    }

    const routeType = safe(data.advanced_parameters?.route_type, data.route_type, "standard");
    setText("route-complexity", translateRouteType(routeType));

    const carrierRating = safe(data.advanced_parameters?.carrier_rating, data.carrier_rating, 3.0);
    setText("carrier-rating-display", carrierRating.toFixed(1) + " ⭐");
}

export function updateClimateMetrics(data) {
    if (data.climate_hazard_index !== undefined) {
        const chi = safe(data.climate_hazard_index, 5.0);
        setText("climate_hazard_index_value", formatNumber(chi, 2));
        
        const climateVar = safe(data.climate_var_metrics, {});
        if (climateVar.climate_var_95 !== undefined) {
            setText("climate_var_95_value", formatNumber(climateVar.climate_var_95, 2));
        }
        if (climateVar.climate_var_99 !== undefined) {
            setText("climate_var_99_value", formatNumber(climateVar.climate_var_99, 2));
        }
        if (climateVar.climate_cvar_95 !== undefined) {
            setText("climate_cvar_95_value", formatNumber(climateVar.climate_cvar_95, 2));
        }
        if (climateVar.climate_extreme_probability !== undefined) {
            const probPct = (safe(climateVar.climate_extreme_probability, 0)) * 100;
            setText("climate_extreme_prob_value", formatPercent(probPct));
        }
    }
}

export function updateBuyerSeller(data) {
    const buyerSeller = safe(data.buyer_seller_analysis, null);
    const section = $id('buyer-seller-section');
    const card = $id('buyer-seller-card');
    
    if (!buyerSeller || !card) {
        if (card) card.style.display = 'none';
        return;
    }
    
    card.style.display = 'block';
    
    // Buyer Data
    const buyer = safe(buyerSeller.buyer_data, {});
    setText("buyer-name", buyer.name || "Unknown");
    setText("buyer-size", buyer.size || "Unknown");
    setText("buyer-esg", (buyer.esg || 50).toString());
    setText("buyer-reliability", (buyer.reliability || 50).toString());
    
    const buyerRisk = safe(buyerSeller.buyer_risk, 50);
    setText("buyer-risk-score", buyerRisk.toFixed(1));
    setText("buyer_score", buyerRisk.toFixed(1)); // Keep for backward compatibility
    const buyerProgress = $id("buyer-progress");
    if (buyerProgress) buyerProgress.style.width = buyerRisk + "%";
    
    // Color code buyer score
    const buyerScoreEl = $id("buyer-risk-score");
    if (buyerScoreEl) {
        if (buyerRisk < 40) {
            buyerScoreEl.style.color = "#10b981";
        } else if (buyerRisk < 60) {
            buyerScoreEl.style.color = "#fbbf24";
        } else {
            buyerScoreEl.style.color = "#ef4444";
        }
    }
    
    // Seller Data
    const seller = safe(buyerSeller.seller_data, {});
    setText("seller-name", seller.name || "Unknown");
    setText("seller-size", seller.size || "Unknown");
    setText("seller-esg", (seller.esg || 50).toString());
    setText("seller-reliability", (seller.reliability || 50).toString());
    
    const sellerRisk = safe(buyerSeller.seller_risk, 50);
    setText("seller-risk-score", sellerRisk.toFixed(1));
    setText("seller_score", sellerRisk.toFixed(1)); // Keep for backward compatibility
    const sellerProgress = $id("seller-progress");
    if (sellerProgress) sellerProgress.style.width = sellerRisk + "%";
    
    // Color code seller score
    const sellerScoreEl = $id("seller-risk-score");
    if (sellerScoreEl) {
        if (sellerRisk < 40) {
            sellerScoreEl.style.color = "#10b981";
        } else if (sellerRisk < 60) {
            sellerScoreEl.style.color = "#fbbf24";
        } else {
            sellerScoreEl.style.color = "#ef4444";
        }
    }
    
}

export function updateInsights(data) {
    const layers = safe(data.layers, []);
    if (layers.length > 0) {
        const sortedLayers = [...layers].sort((a, b) => (safe(b.score, 0)) - (safe(a.score, 0)));
        const topLayer = sortedLayers[0];
        setText(
            "insight_toprisk",
            `Top Risk Layer: ${topLayer.name} → ${formatNumber(
                (safe(topLayer.score, 0)) * 100,
                1
            )}%`
        );
    } else {
        setText("insight_toprisk", "Top Risk Layer: N/A");
    }

    setText(
        "insight_driver",
        "Main Driver: Monte Carlo simulation with climate-adjusted risk layers"
    );

    setText(
        "insight_reco",
        "Recommendation: Focus on top 2–3 risk layers; consider premium carriers and route optimization."
    );
}

export function updateRecommendations(appData) {
    const container = $id("recommendations-list");
    if (!container) {
        return;
    }
    
    const recommendations = appData?.recommendations_vi || [];
    
    if (recommendations.length > 0) {
        container.innerHTML = "";
        recommendations.slice(0, 5).forEach(rec => {
            const li = document.createElement("li");
            li.style.borderLeft = "3px solid var(--accent-green)";
            li.style.paddingLeft = "12px";
            li.style.marginBottom = "8px";
            li.style.padding = "12px 16px";
            li.style.background = "rgba(0, 255, 136, 0.05)";
            li.style.borderRadius = "6px";
            li.textContent = rec;
            container.appendChild(li);
        });
    } else {
        // Fallback recommendations
        const fallback = [
            "Ưu tiên tuyến đường trực tiếp để giảm thiểu độ trễ chuyển tải",
            "Triển khai bao bì nâng cao cho hàng điện tử giá trị cao",
            "Cân nhắc nâng cấp bảo hiểm với VaR 95% hiện tại",
            "Theo dõi sự kiện khí hậu trong mùa bão cao điểm (Tháng 6-11)",
            "Đánh giá các hãng vận chuyển thay thế với xếp hạng ESG tốt hơn"
        ];
        container.innerHTML = "";
        fallback.forEach(rec => {
            const li = document.createElement("li");
            li.className = "recommendation-item";
            li.textContent = rec;
            container.appendChild(li);
        });
    }
}

