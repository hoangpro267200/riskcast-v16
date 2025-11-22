/**
 * RISKCAST Enterprise AI - Streaming Text Handler
 * Real-time text streaming from AI API
 */

class StreamingHandler {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentText = '';
        this.isStreaming = false;
        this.abortController = null;
    }

    /**
     * Start streaming from API endpoint
     * @param {string} endpoint - API endpoint URL
     * @param {object} payload - Request payload
     */
    async stream(endpoint, payload) {
        if (this.isStreaming) {
            this.stop();
        }

        this.isStreaming = true;
        this.currentText = '';
        this.abortController = new AbortController();

        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message assistant';
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="ai-streaming">
                    <div class="ai-streaming-text"></div>
                    <span class="ai-typing-cursor"></span>
                </div>
            </div>
        `;
        this.container.appendChild(messageDiv);

        const textElement = messageDiv.querySelector('.ai-streaming-text');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: this.abortController.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    // Remove typing cursor when done
                    const cursor = messageDiv.querySelector('.ai-typing-cursor');
                    if (cursor) cursor.remove();
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data === '[DONE]') {
                            const cursor = messageDiv.querySelector('.ai-typing-cursor');
                            if (cursor) cursor.remove();
                            this.isStreaming = false;
                            return;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.text) {
                                this.currentText += parsed.text;
                                textElement.textContent = this.currentText;
                                
                                // Auto scroll
                                this.container.scrollTop = this.container.scrollHeight;
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Streaming aborted');
            } else {
                console.error('Streaming error:', error);
                textElement.textContent = this.currentText + '\n\n[Error: ' + error.message + ']';
            }
        } finally {
            this.isStreaming = false;
        }
    }

    /**
     * Stop current stream
     */
    stop() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.isStreaming = false;
    }

    /**
     * Append text manually (for non-streaming responses)
     */
    appendText(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${isUser ? 'user' : 'assistant'}`;
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="ai-message-content">${this.escapeHtml(text)}</div>
        `;
        this.container.appendChild(messageDiv);
        this.container.scrollTop = this.container.scrollHeight;
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-message assistant';
        loadingDiv.id = 'ai-loading-indicator';
        loadingDiv.innerHTML = `
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="ai-loading">
                    <div class="ai-loading-dot"></div>
                    <div class="ai-loading-dot"></div>
                    <div class="ai-loading-dot"></div>
                </div>
            </div>
        `;
        this.container.appendChild(loadingDiv);
        this.container.scrollTop = this.container.scrollHeight;
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loading = document.getElementById('ai-loading-indicator');
        if (loading) {
            loading.remove();
        }
    }

    /**
     * Clear all messages
     */
    clear() {
        this.container.innerHTML = '';
        this.currentText = '';
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StreamingHandler;
}


