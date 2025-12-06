
export function bindTabs(onModeChange) {
    const tabEnterprise = document.getElementById("tab-enterprise");
    const tabResearch = document.getElementById("tab-research");
    const tabInvestor = document.getElementById("tab-investor");
    
    if (tabEnterprise) {
        tabEnterprise.onclick = () => onModeChange("enterprise");
    }
    if (tabResearch) {
        tabResearch.onclick = () => onModeChange("research");
    }
    if (tabInvestor) {
        tabInvestor.onclick = () => onModeChange("investor");
    }
}

export function applyMode(mode) {
    
    const modes = ["enterprise", "research", "investor"];
    
    modes.forEach(m => {
        const section = document.getElementById(`mode-${m}`);
        const tab = document.getElementById(`tab-${m}`);
        
        if (section) {
            if (m === mode) {
                section.classList.remove("view-hidden");
                section.style.display = "block";
                section.style.opacity = "1";
            } else {
                section.classList.add("view-hidden");
                section.style.display = "none";
                section.style.opacity = "0";
            }
        }
        
        if (tab) {
            if (m === mode) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        }
    });
    
}

export function setActiveView(mode) {
    applyMode(mode);
}

