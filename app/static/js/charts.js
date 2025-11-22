// ===============================
// RISKCAST v14 — Charts
// Radar · Loss Histogram · Forecast
// ===============================

window.RiskcastCharts = {
    // RADAR
    renderRadar(radar) {
        console.log("Rendering radar:", radar);
        const el = document.getElementById("radarChart") || 
                   document.getElementById("radar") || 
                   document.querySelector("[data-chart='radar']");
        if (!el || !window.Plotly) {
            console.warn("[RiskcastCharts] Radar container not found or Plotly not loaded");
            return;
        }

        const labels = radar.labels || [];
        const scores = radar.scores || [];

        const trace = {
            type: "scatterpolar",
            r: scores,
            theta: labels,
            fill: "toself",
            name: "Risk Layer",
        };

        const layout = {
            margin: { t: 20, r: 10, b: 10, l: 10 },
            paper_bgcolor: "rgba(0,0,0,0)",
            polar: {
                bgcolor: "rgba(15,23,42,0.7)",
                radialaxis: {
                    visible: true,
                    range: [0, 10],
                    tickfont: { size: 10 },
                },
                angularaxis: {
                    tickfont: { size: 10 },
                },
            },
            showlegend: false,
        };

        Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
    },

    // LOSS HISTOGRAM
    renderLossHistogram(lossArray) {
        console.log("Rendering MC:", lossArray);
        // Try multiple possible IDs
        const el = document.getElementById("mcChart") || 
                   document.getElementById("lossChart") ||
                   document.getElementById("monteCarloChart") ||
                   document.querySelector("[data-chart='mc']");
        if (!el || !window.Plotly) {
            console.warn("[RiskcastCharts] Loss histogram container not found or Plotly not loaded");
            return;
        }

        const arr = Array.isArray(lossArray) ? lossArray : [];

        if (arr.length === 0) {
            el.innerHTML = "<div style='font-size:12px;color:#9ca3af'>No loss distribution data.</div>";
            return;
        }

        const trace = {
            x: arr,
            type: "histogram",
            nbinsx: 40,
        };

        const layout = {
            margin: { t: 20, r: 10, b: 30, l: 40 },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(15,23,42,0.8)",
            xaxis: {
                title: "Loss per shipment (USD)",
                tickfont: { size: 10 },
            },
            yaxis: {
                title: "Frequency",
                tickfont: { size: 10 },
            },
        };

        Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
    },

    // FORECAST
    renderForecast(forecast) {
        console.log("Rendering timeline:", forecast);
        const el = document.getElementById("forecastChart") || 
                   document.getElementById("timelineChart") || 
                   document.querySelector("[data-chart='forecast']");
        if (!el || !window.Plotly) {
            console.warn("[RiskcastCharts] Forecast container not found or Plotly not loaded");
            return;
        }

        const days = forecast.days || [];
        const values = forecast.values || [];
        const upper = forecast.confidence_upper || [];
        const lower = forecast.confidence_lower || [];

        if (!days.length || !values.length) {
            el.innerHTML = "<div style='font-size:12px;color:#9ca3af'>No forecast data.</div>";
            return;
        }

        const traceMean = {
            x: days,
            y: values,
            type: "scatter",
            mode: "lines",
            name: "Forecast",
        };

        const traceUpper = {
            x: days,
            y: upper,
            type: "scatter",
            mode: "lines",
            name: "Upper",
            line: { dash: "dot" },
        };

        const traceLower = {
            x: days,
            y: lower,
            type: "scatter",
            mode: "lines",
            name: "Lower",
            line: { dash: "dot" },
        };

        const layout = {
            margin: { t: 20, r: 10, b: 30, l: 40 },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(15,23,42,0.8)",
            xaxis: {
                title: "Day",
                tickfont: { size: 10 },
            },
            yaxis: {
                title: "Risk index (0–10)",
                range: [0, 10],
                tickfont: { size: 10 },
            },
            showlegend: false,
        };

        Plotly.newPlot(el, [traceMean, traceUpper, traceLower], layout, {
            responsive: true,
            displayModeBar: false,
        });
    },
};
