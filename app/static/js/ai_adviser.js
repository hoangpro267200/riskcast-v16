/**
 * RISKCAST Enterprise AI - AI Adviser Panel Controller
 * Manages AI panel UI and interactions
 */

class AIAdviserPanel {
    constructor() {
        this.panel = null;
        this.sidebar = null;
        this.isOpen = false;
        this.streamingHandler = null;
        this.currentStreamingMessage = null;
        this.init();
    }

    /**
     * Initialize panel
     */
    init() {
        // Check if sidebar exists (new layout)
        this.sidebar = document.getElementById('results-ai-chat');
        
        // Check if old panel exists (backward compatibility)
        if (!this.sidebar && !document.getElementById('ai-panel')) {
            this.createPanel();
        }

        if (this.sidebar) {
            this.panel = this.sidebar;
            this.streamingHandler = new StreamingHandler('ai-adviser-output');
        } else {
            this.panel = document.getElementById('ai-panel');
            this.streamingHandler = new StreamingHandler('ai-messages');
        }

        // Bind events
        this.bindEvents();
    }

    /**
     * Create panel HTML structure
     */
    createPanel() {
        const panelHTML = `
            <div id="ai-panel" class="ai-panel">
                <div class="ai-panel-header">
                    <div class="ai-panel-title">AI Adviser</div>
                    <button class="ai-panel-close" id="ai-panel-close">✕</button>
                </div>
                <div class="ai-messages" id="ai-messages"></div>
                <div class="ai-input-area">
                    <div class="ai-input-wrapper">
                        <textarea 
                            id="ai-input" 
                            class="ai-input" 
                            placeholder="Ask RISKCAST AI anything..."
                            rows="1"
                        ></textarea>
                        <button id="ai-send-button" class="ai-send-button">➤</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle button (mobile)
        const toggleBtn = document.getElementById('ai-chat-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.openSidebar());
        }

        // Toggle panel (for old floating panel)
        const oldToggleBtn = document.getElementById('ai-panel-toggle');
        if (oldToggleBtn) {
            oldToggleBtn.addEventListener('click', () => this.toggle());
        }

        // Close button (for sidebar)
        const closeBtn = document.getElementById('ai-chat-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSidebar());
        }

        // Close button (for old panel)
        const oldCloseBtn = document.getElementById('ai-panel-close');
        if (oldCloseBtn) {
            oldCloseBtn.addEventListener('click', () => this.close());
        }

        // Send button (sidebar)
        const sendBtn = document.getElementById('ai-chat-send');
        const input = document.getElementById('ai-chat-input');

        // Send button (old panel - backward compatibility)
        const oldSendBtn = document.getElementById('ai-send-button');
        const oldInput = document.getElementById('ai-input');

        const activeSendBtn = sendBtn || oldSendBtn;
        const activeInput = input || oldInput;

        if (activeSendBtn && activeInput) {
            activeSendBtn.addEventListener('click', () => this.sendMessage());
            
            // Enter to send (Shift+Enter for new line)
            activeInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            activeInput.addEventListener('input', () => {
                activeInput.style.height = 'auto';
                activeInput.style.height = Math.min(activeInput.scrollHeight, 120) + 'px';
            });
        }
    }

    /**
     * Close sidebar (mobile)
     */
    closeSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('active');
        }
    }

    /**
     * Open sidebar (mobile)
     */
    openSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.add('active');
        }
    }

    /**
     * Toggle panel open/close
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open panel
     */
    open() {
        if (this.panel) {
            this.panel.classList.add('open');
            this.isOpen = true;
            
            // Focus input
            const input = document.getElementById('ai-input');
            if (input) {
                setTimeout(() => input.focus(), 300);
            }
        }
    }

    /**
     * Close panel
     */
    close() {
        if (this.panel) {
            this.panel.classList.remove('open');
            this.isOpen = false;
        }
    }

    /**
     * Append message bubble (ChatGPT style)
     */
    appendMessage(role, text) {
        const output = document.getElementById('ai-adviser-output') || 
                      document.getElementById('ai-messages');
        if (!output) return;

        const box = document.createElement('div');
        box.className = `ai-message ${role}`;
        box.textContent = text;
        output.appendChild(box);
        
        // Auto scroll
        output.scrollTop = output.scrollHeight;
        
        return box;
    }

    /**
     * Send message to AI
     */
    async sendMessage() {
        const input = document.getElementById('ai-chat-input') || 
                     document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-chat-send') || 
                       document.getElementById('ai-send-button');
        
        if (!input || !sendBtn) return;

        const message = input.value.trim();
        if (!message) return;

        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Disable send button
        sendBtn.disabled = true;

        // Show user message
        this.appendMessage('user', message);

        // Show loading indicator
        const loadingBox = this.appendMessage('ai', '...');
        loadingBox.innerHTML = '<div class="ai-loading"><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div></div>';

        try {
            // Create streaming message box
            this.currentStreamingMessage = this.appendMessage('ai', '');
            this.currentStreamingMessage.textContent = '';

            // Stream response
            await this.streamFromAPI('/api/ai/stream', {
                prompt: message,
                context: this.getContext()
            });
        } catch (error) {
            console.error('Error sending message:', error);
            if (this.currentStreamingMessage) {
                this.currentStreamingMessage.textContent = 'Sorry, I encountered an error. Please try again.';
            } else {
                this.appendMessage('ai', 'Sorry, I encountered an error. Please try again.');
            }
        } finally {
            // Remove loading
            if (loadingBox && loadingBox.parentNode) {
                loadingBox.remove();
            }
            sendBtn.disabled = false;
            this.currentStreamingMessage = null;
        }
    }

    /**
     * Stream from API and append tokens
     */
    async streamFromAPI(endpoint, payload) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const output = document.getElementById('ai-adviser-output') || 
                      document.getElementById('ai-messages');

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                        return;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.text && this.currentStreamingMessage) {
                            this.currentStreamingMessage.textContent += parsed.text;
                            // Auto scroll
                            if (output) {
                                output.scrollTop = output.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }

    /**
     * Get context for AI (current shipment data, etc.)
     */
    getContext() {
        // Try to get current shipment data from page
        const context = {};

        // Check if we're on results page
        const riskData = window.riskData || {};
        if (Object.keys(riskData).length > 0) {
            context.shipment_data = riskData;
        }

        return context;
    }

    /**
     * Ask AI a specific question (programmatic)
     */
    async ask(question, context = {}) {
        if (!this.isOpen) {
            this.open();
        }

        // Wait for panel to open
        await new Promise(resolve => setTimeout(resolve, 400));

        // Set input and send
        const input = document.getElementById('ai-input');
        if (input) {
            input.value = question;
            this.sendMessage();
        }
    }

    /**
     * Analyze current shipment
     */
    async analyzeShipment(shipmentData) {
        if (!this.isOpen) {
            this.open();
        }

        this.streamingHandler.showLoading();

        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shipment_data: shipmentData
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Display insights
                this.displayInsights(data);
            } else {
                throw new Error(data.message || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            this.streamingHandler.appendText('Error analyzing shipment: ' + error.message);
        } finally {
            this.streamingHandler.hideLoading();
        }
    }

    /**
     * Display analysis insights
     */
    displayInsights(data) {
        const insights = data.insights || {};
        const summary = data.summary || '';

        // Show summary
        if (summary) {
            this.streamingHandler.appendText(`**Executive Summary:**\n\n${summary}`);
        }

        // Show AI analysis
        if (insights.ai_analysis) {
            this.streamingHandler.appendText(`**AI Analysis:**\n\n${insights.ai_analysis}`);
        }

        // Show key metrics
        const metrics = `
**Key Metrics:**
- Overall Risk: ${insights.overall_risk?.toFixed(1)}/100 (${insights.risk_level})
- Expected Loss: $${insights.expected_loss?.toFixed(2)}
- Reliability: ${insights.reliability?.toFixed(1)}%
        `.trim();

        this.streamingHandler.appendText(metrics);
    }
}

// Initialize on page load
let aiAdviser = null;

document.addEventListener('DOMContentLoaded', () => {
    aiAdviser = new AIAdviserPanel();
    
    // Make globally available
    window.aiAdviser = aiAdviser;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAdviserPanel;
}

// ==================== AI POPUP CHAT (Floating Button) ====================

// Open/Close Popup
document.addEventListener('DOMContentLoaded', () => {
    const botButton = document.getElementById('aiBotButton');
    const popup = document.getElementById('aiChatPopup');
    const closeBtn = document.getElementById('aiPopupClose');
    
    if (botButton && popup) {
        botButton.onclick = () => {
            popup.classList.remove('hidden');
        };
    }
    
    if (closeBtn && popup) {
        closeBtn.onclick = () => {
            popup.classList.add('hidden');
        };
    }
});

// Append message to popup
function appendPopupMessage(role, text) {
    const messagesContainer = document.getElementById('aiPopupMessages');
    if (!messagesContainer) return;
    
    const box = document.createElement('div');
    box.className = 'ai-message ' + role;
    box.innerText = text;
    messagesContainer.appendChild(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'end' });
    
    return box;
}

// Send message from popup
async function sendPopupMessage() {
    const input = document.getElementById('aiPopupInput');
    const sendBtn = document.getElementById('aiPopupSend');
    
    if (!input || !sendBtn) return;
    
    const q = input.value.trim();
    if (!q) return;
    
    // Show user message
    appendPopupMessage('user', q);
    input.value = '';
    
    // Show loading message
    const loadingMsg = appendPopupMessage('ai', 'Đang xử lý...');
    
    // Disable send button
    sendBtn.disabled = true;
    
    try {
        const res = await fetch('/api/ai/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: q })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        // Remove loading message
        loadingMsg.remove();
        
        // Create new AI message for streaming
        const aiMsg = appendPopupMessage('ai', '');
        let full = '';
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (!line.trim()) continue;
                
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                        return;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.text) {
                            full += parsed.text;
                            aiMsg.innerText = full;
                            aiMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }
                    } catch (e) {
                        // If not JSON, treat as plain text
                        full += data;
                        aiMsg.innerText = full;
                        aiMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                } else {
                    // Plain text streaming
                    full += line;
                    aiMsg.innerText = full;
                    aiMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            }
        }
    } catch (e) {
        console.error('Popup chat error:', e);
        loadingMsg.remove();
        appendPopupMessage('ai', 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
        sendBtn.disabled = false;
    }
}

// Bind send button and Enter key
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('aiPopupSend');
    const input = document.getElementById('aiPopupInput');
    
    if (sendBtn) {
        sendBtn.onclick = sendPopupMessage;
    }
    
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendPopupMessage();
            }
        });
    }
});

