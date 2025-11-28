/**
 * ==================================================
 * RISKCAST v12.5 — Overview Summary Panel
 * New Design System — Vanilla JS Implementation
 * ==================================================
 */

(function() {
    'use strict';

    // ==================================================
    // Data Source - Get from RiskCastData or use sample
    // ==================================================
    function getOverviewData() {
        // Try to get data from global RiskCastData
        if (window.RiskCastData) {
            return mapRiskCastDataToOverviewFormat(window.RiskCastData);
        }
        
        // Fallback to sample data
        return {
            transport: {
                route: "🇻🇳 Vietnam → 🇺🇸 USA (LA/NY)",
                transportMode: "Ocean Freight (FCL)",
                detailedRoute: "Haiphong → Long Beach",
                carrier: "Maersk Line",
                pol: "Haiphong (VNHPH)",
                pod: "Long Beach (USLGB)",
                etd: "2025-12-01",
                eta: "2025-12-28",
                transitDays: 27,
                distance: 12450
            },
            cargo: {
                totalPackages: 1200,
                grossWeight: 18500,
                volume: 65.5,
                chargeableWeight: 19200,
                packingScore: 8.5,
                utilization: 87.3,
                cargoType: "Electronics",
                containerType: "40ft High Cube"
            },
            seller: {
                name: "Vietnam Electronics Co., Ltd",
                country: "Vietnam",
                phone: "+84 123 456 789",
                email: "sales@vnelectronics.com",
                esgScore: 72,
                size: "Medium Enterprise"
            },
            buyer: {
                name: "Tech Import USA Inc.",
                country: "United States",
                phone: "+1 310 555 0123",
                email: "procurement@techimportusa.com",
                esgScore: 85,
                size: "Large Corporation"
            },
            system: {
                estimatedTransitDays: 27,
                distanceKM: 12450,
                totalPackages: 1200,
                grossWeight: 18500,
                volume: 65.5,
                chargeableWeight: 19200,
                utilization: 87.3,
                packingScore: 8.5
            }
        };
    }

    // Map existing RiskCastData format to new overview format
    function mapRiskCastDataToOverviewFormat(data) {
        const transport = data.transport || {};
        const cargo = data.cargo || {};
        const seller = data.seller || {};
        const buyer = data.buyer || {};
        
        return {
            transport: {
                route: transport.tradeLane || transport.route || "N/A",
                transportMode: transport.mode || transport.transportMode || "N/A",
                detailedRoute: transport.route || transport.detailedRoute || "N/A",
                carrier: transport.carrier || "N/A",
                pol: transport.pol || "N/A",
                pod: transport.pod || "N/A",
                etd: transport.departureDate || transport.etd || "",
                eta: transport.eta || "",
                transitDays: parseTransitTime(transport.transitTime) || 0,
                distance: parseDistance(transport.distance) || 0
            },
            cargo: {
                totalPackages: cargo.totalPackages || 0,
                grossWeight: parseWeight(cargo.weight || cargo.grossWeight) || 0,
                volume: parseVolume(cargo.volume) || 0,
                chargeableWeight: cargo.chargeableWeight || 0,
                packingScore: cargo.packingScore || 7.0,
                utilization: cargo.utilization || 80.0,
                cargoType: cargo.type || cargo.cargoType || "N/A",
                containerType: cargo.containerType || "N/A"
            },
            seller: {
                name: seller.name || "N/A",
                country: seller.country || "N/A",
                phone: seller.phone || "",
                email: seller.email || "",
                esgScore: seller.esgScore || 50,
                size: seller.size || "N/A"
            },
            buyer: {
                name: buyer.name || "N/A",
                country: buyer.country || "N/A",
                phone: buyer.phone || "",
                email: buyer.email || "",
                esgScore: buyer.esgScore || 50,
                size: buyer.size || "N/A"
            },
            system: {
                estimatedTransitDays: parseTransitTime(transport.transitTime) || 0,
                distanceKM: parseDistance(transport.distance) || 0,
                totalPackages: cargo.totalPackages || 0,
                grossWeight: parseWeight(cargo.weight || cargo.grossWeight) || 0,
                volume: parseVolume(cargo.volume) || 0,
                chargeableWeight: cargo.chargeableWeight || 0,
                utilization: cargo.utilization || 80.0,
                packingScore: cargo.packingScore || 7.0
            }
        };
    }

    // Helper parsers
    function parseTransitTime(str) {
        if (!str) return 0;
        const match = String(str).match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    function parseDistance(str) {
        if (!str) return 0;
        const match = String(str).replace(/,/g, '').match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    function parseWeight(str) {
        if (!str) return 0;
        const match = String(str).replace(/,/g, '').match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    function parseVolume(str) {
        if (!str) return 0;
        const match = String(str).match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    // ==================================================
    // Render Function
    // ==================================================
    function renderOverviewPanel(data) {
        const { transport, cargo, seller, buyer, system } = data;

        // Helper Functions
        const formatNumber = (num) => {
            if (num === null || num === undefined || isNaN(num)) return 'N/A';
            return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
        };

        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            try {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return dateStr;
                return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            } catch (e) {
                return dateStr;
            }
        };

        const getTransportIcon = () => {
            const mode = (transport.transportMode || '').toLowerCase();
            if (mode.includes('air') || mode.includes('flight')) return '✈️';
            if (mode.includes('sea') || mode.includes('ocean') || mode.includes('ship')) return '🚢';
            if (mode.includes('truck') || mode.includes('road')) return '🚛';
            if (mode.includes('rail') || mode.includes('train')) return '🚂';
            return '📦';
        };

        const getScoreColor = (score) => {
            if (score >= 8) return '#00FFC8';
            if (score >= 6) return '#FFD700';
            return '#FF6B6B';
        };

        const getUtilizationColor = (util) => {
            if (util >= 85) return '#00FFC8';
            if (util >= 70) return '#FFD700';
            return '#FF6B6B';
        };

        // AI Insights Logic
        const generateAIInsights = () => {
            const insights = [];
            
            if (transport.transitDays > 30) {
                insights.push("⚠️ Long transit time detected - Consider additional insurance coverage");
            }
            
            if (cargo.packingScore < 6) {
                insights.push("📦 Packing quality below optimal - Risk of cargo damage increased");
            } else if (cargo.packingScore >= 8) {
                insights.push("✅ Excellent packing quality - Minimal damage risk expected");
            }
            
            if (cargo.utilization < 70) {
                insights.push("💡 Container utilization below 70% - Consider consolidation to optimize costs");
            } else if (cargo.utilization > 95) {
                insights.push("⚡ High container utilization - Excellent space optimization");
            }
            
            const avgESG = ((seller.esgScore || 50) + (buyer.esgScore || 50)) / 2;
            if (avgESG < 50) {
                insights.push("🌱 Low ESG scores detected - Consider sustainable shipping partners");
            } else if (avgESG > 70) {
                insights.push("🌿 Strong ESG performance - Sustainable supply chain confirmed");
            }
            
            const mode = (transport.transportMode || '').toLowerCase();
            if (mode.includes('air') || mode.includes('express')) {
                insights.push("⚡ Express shipping selected - Premium speed at higher cost");
            } else if (mode.includes('sea') || mode.includes('ocean')) {
                insights.push("🚢 Economy shipping - Cost-effective for non-urgent cargo");
            }
            
            return insights.length > 0 ? insights : ["✓ All parameters within normal range - Standard risk profile"];
        };

        const getRiskLevel = () => {
            if (cargo.packingScore >= 7 && cargo.utilization >= 70) return { level: 'LOW', class: 'risk-low' };
            if (cargo.packingScore >= 5) return { level: 'MEDIUM', class: 'risk-medium' };
            return { level: 'HIGH', class: 'risk-high' };
        };

        const risk = getRiskLevel();
        const insights = generateAIInsights();

        // Build HTML
        const html = `
            <div class="overview-summary-panel">
                <!-- Header -->
                <div class="overview-header">
                    <div class="overview-header-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 3h18v18H3z"/>
                            <path d="M3 9h18M9 21V9"/>
                        </svg>
                    </div>
                    <div class="overview-header-text">
                        <h2 class="overview-title">Shipment Overview</h2>
                        <p class="overview-subtitle">AI-Generated Summary Based on Your Input</p>
                    </div>
                </div>
                <!-- Main Grid -->
                <div class="overview-grid">
                    <!-- 1. Transport Summary -->
                    <div class="overview-card">
                        <div class="card-header">
                            <span class="card-icon">${getTransportIcon()}</span>
                            <h3 class="card-title">Transport Summary</h3>
                        </div>
                        <div class="card-content">
                            <div class="data-row">
                                <span class="data-label">Route</span>
                                <span class="data-value">${transport.route || 'N/A'}</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Mode</span>
                                <span class="data-value highlight">${transport.transportMode || 'N/A'}</span>
                            </div>
                            ${transport.detailedRoute ? `
                            <div class="data-row">
                                <span class="data-label">Detailed Route</span>
                                <span class="data-value">${transport.detailedRoute}</span>
                            </div>` : ''}
                            ${transport.carrier ? `
                            <div class="data-row">
                                <span class="data-label">Carrier</span>
                                <span class="data-value">${transport.carrier}</span>
                            </div>` : ''}
                            <div class="data-row">
                                <span class="data-label">POL → POD</span>
                                <span class="data-value route-display">${transport.pol || 'N/A'} → ${transport.pod || 'N/A'}</span>
                            </div>
                            <div class="data-row-grid">
                                <div class="data-mini">
                                    <span class="mini-label">ETD</span>
                                    <span class="mini-value">${formatDate(transport.etd)}</span>
                                </div>
                                <div class="data-mini">
                                    <span class="mini-label">ETA</span>
                                    <span class="mini-value">${formatDate(transport.eta)}</span>
                                </div>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Transit Time</span>
                                <span class="data-value highlight-accent">${transport.transitDays || 0} days</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Distance</span>
                                <span class="data-value">${formatNumber(transport.distance)} km</span>
                            </div>
                        </div>
                    </div>
                    <!-- 2. Cargo Summary -->
                    <div class="overview-card">
                        <div class="card-header">
                            <span class="card-icon">📦</span>
                            <h3 class="card-title">Cargo Summary</h3>
                        </div>
                        <div class="card-content">
                            <div class="data-row">
                                <span class="data-label">Total Packages</span>
                                <span class="data-value highlight">${formatNumber(cargo.totalPackages)}</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Gross Weight</span>
                                <span class="data-value">${formatNumber(cargo.grossWeight)} kg</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Volume</span>
                                <span class="data-value">${formatNumber(cargo.volume)} m³</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Chargeable Weight</span>
                                <span class="data-value">${formatNumber(cargo.chargeableWeight)} kg</span>
                            </div>
                            ${cargo.cargoType ? `
                            <div class="data-row">
                                <span class="data-label">Cargo Type</span>
                                <span class="data-value">${cargo.cargoType}</span>
                            </div>` : ''}
                            ${cargo.containerType ? `
                            <div class="data-row">
                                <span class="data-label">Container</span>
                                <span class="data-value">${cargo.containerType}</span>
                            </div>` : ''}
                            <div class="metric-box">
                                <div class="metric-header">
                                    <span class="metric-label">Packing Quality Score</span>
                                    <span class="metric-value" style="color: ${getScoreColor(cargo.packingScore)}">${(cargo.packingScore || 0).toFixed(1)}/10</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${((cargo.packingScore || 0) / 10) * 100}%; background: ${getScoreColor(cargo.packingScore)}"></div>
                                </div>
                            </div>
                            <div class="metric-box">
                                <div class="metric-header">
                                    <span class="metric-label">Container Utilization</span>
                                    <span class="metric-value" style="color: ${getUtilizationColor(cargo.utilization)}">${(cargo.utilization || 0).toFixed(1)}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill neon-glow" style="width: ${cargo.utilization || 0}%; background: ${getUtilizationColor(cargo.utilization)}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 3. Seller Summary -->
                    <div class="overview-card">
                        <div class="card-header">
                            <span class="card-icon">🏭</span>
                            <h3 class="card-title">Seller Information</h3>
                        </div>
                        <div class="card-content">
                            <div class="data-row">
                                <span class="data-label">Company</span>
                                <span class="data-value highlight">${seller.name || 'N/A'}</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Country</span>
                                <span class="data-value">${seller.country || 'N/A'}</span>
                            </div>
                            ${seller.size ? `
                            <div class="data-row">
                                <span class="data-label">Company Size</span>
                                <span class="data-value">${seller.size}</span>
                            </div>` : ''}
                            ${seller.phone ? `
                            <div class="data-row">
                                <span class="data-label">Phone</span>
                                <span class="data-value">${seller.phone}</span>
                            </div>` : ''}
                            ${seller.email ? `
                            <div class="data-row">
                                <span class="data-label">Email</span>
                                <span class="data-value">${seller.email}</span>
                            </div>` : ''}
                            ${seller.esgScore !== undefined ? `
                            <div class="metric-box">
                                <div class="metric-header">
                                    <span class="metric-label">ESG Score</span>
                                    <span class="metric-value esg-score">${seller.esgScore || 0}/100</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill esg-fill" style="width: ${seller.esgScore || 0}%"></div>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                    <!-- 4. Buyer Summary -->
                    <div class="overview-card">
                        <div class="card-header">
                            <span class="card-icon">🏢</span>
                            <h3 class="card-title">Buyer Information</h3>
                        </div>
                        <div class="card-content">
                            <div class="data-row">
                                <span class="data-label">Company</span>
                                <span class="data-value highlight">${buyer.name || 'N/A'}</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Country</span>
                                <span class="data-value">${buyer.country || 'N/A'}</span>
                            </div>
                            ${buyer.size ? `
                            <div class="data-row">
                                <span class="data-label">Company Size</span>
                                <span class="data-value">${buyer.size}</span>
                            </div>` : ''}
                            ${buyer.phone ? `
                            <div class="data-row">
                                <span class="data-label">Phone</span>
                                <span class="data-value">${buyer.phone}</span>
                            </div>` : ''}
                            ${buyer.email ? `
                            <div class="data-row">
                                <span class="data-label">Email</span>
                                <span class="data-value">${buyer.email}</span>
                            </div>` : ''}
                            ${buyer.esgScore !== undefined ? `
                            <div class="metric-box">
                                <div class="metric-header">
                                    <span class="metric-label">ESG Score</span>
                                    <span class="metric-value esg-score">${buyer.esgScore || 0}/100</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill esg-fill" style="width: ${buyer.esgScore || 0}%"></div>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                    <!-- 5. AI Insights Box -->
                    <div class="overview-card ai-insights-card">
                        <div class="card-header">
                            <span class="card-icon ai-icon">🤖</span>
                            <h3 class="card-title">AI Insights & Recommendations</h3>
                        </div>
                        <div class="card-content">
                            <div class="insights-list">
                                ${insights.map(insight => `
                                    <div class="insight-item">
                                        <span class="insight-bullet"></span>
                                        <span class="insight-text">${insight}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="risk-assessment">
                                <div class="risk-badge">
                                    <span class="risk-label">Overall Risk Level:</span>
                                    <span class="risk-value ${risk.class}">${risk.level}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    // ==================================================
    // Public API
    // ==================================================
    window.RiskCastOverview = {
        render: function(data) {
            const overviewData = data || getOverviewData();
            return renderOverviewPanel(overviewData);
        },
        
        refresh: function() {
            const grid = document.getElementById('summaryGrid') || document.getElementById('inputSummaryGrid');
            if (grid) {
                const data = getOverviewData();
                grid.innerHTML = renderOverviewPanel(data);
                console.log('✅ Overview panel refreshed');
            } else {
                console.warn('⚠️ Overview grid not found');
            }
        },
        
        getData: function() {
            return getOverviewData();
        },
        
        version: '12.5'
    };

    // ==================================================
    // Initialization
    // ==================================================
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initializeOverview, 100);
            });
        } else {
            setTimeout(initializeOverview, 100);
        }
    }

    function initializeOverview() {
        // Find grid container (support both #summaryGrid and #inputSummaryGrid)
        const grid = document.getElementById('summaryGrid') || document.getElementById('inputSummaryGrid');
        if (!grid) {
            console.warn('[OVERVIEW] ⚠️ Grid not found, retrying...');
            setTimeout(initializeOverview, 500);
            return;
        }
        
        // Render overview panel
        const data = getOverviewData();
        grid.innerHTML = renderOverviewPanel(data);
        
        console.log('%c🚀 RISKCAST v12.5 Overview Initialized', 'color: #00FFC8; font-size: 16px; font-weight: bold;');
        console.log('Overview API:', window.RiskCastOverview);
    }

    // Start initialization
    init();
    
    // Also try on window load as fallback
    window.addEventListener('load', function() {
        const panel = document.querySelector('.overview-summary-panel');
        if (!panel) {
            console.warn('[OVERVIEW] Panel not found on load, re-initializing...');
            initializeOverview();
        }
    });

})();
