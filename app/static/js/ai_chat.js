// ========================================
// AI CHAT WIDGET - JAVASCRIPT LOGIC
// ========================================

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[AI Chat] DOM loaded, initializing...');
        
        // ========================================
        // NEW PREMIUM DESIGN - Run First
        // ========================================
        const aiToggle = document.getElementById('ai-toggle');
        const aiPanel = document.getElementById('ai-panel');
        const aiMinimize = document.getElementById('ai-minimize');
        const aiInput = document.getElementById('ai-input');
        const aiSend = document.getElementById('ai-send');
        const aiMessages = document.getElementById('ai-messages');

        console.log('[AI Chat Premium] Elements found:', {
            toggle: !!aiToggle,
            panel: !!aiPanel,
            minimize: !!aiMinimize,
            input: !!aiInput,
            send: !!aiSend,
            messages: !!aiMessages
        });

        if (aiToggle && aiPanel) {
            console.log('[AI Chat Premium] Initializing premium chat widget...');
            
            // Ensure toggle is visible (force override !important)
            aiToggle.style.setProperty('display', 'flex', 'important');
            aiToggle.style.setProperty('visibility', 'visible', 'important');
            aiToggle.style.setProperty('opacity', '1', 'important');
            aiToggle.style.setProperty('z-index', '99999', 'important');
            
            // Ensure panel is hidden initially (force override !important)
            aiPanel.style.setProperty('display', 'none', 'important');
            aiPanel.style.setProperty('visibility', 'hidden', 'important');
            aiPanel.style.setProperty('opacity', '0', 'important');
            
            // Open panel when clicking toggle
            aiToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[AI Chat Premium] Toggle clicked, opening panel...');
                
                // Force override !important in CSS
                aiPanel.style.setProperty('display', 'flex', 'important');
                aiPanel.style.setProperty('visibility', 'visible', 'important');
                aiPanel.style.setProperty('opacity', '1', 'important');
                aiPanel.style.setProperty('z-index', '99998', 'important');
                
                aiToggle.style.setProperty('display', 'none', 'important');
                
                setTimeout(() => {
                    if (aiInput) {
                        aiInput.focus();
                        console.log('[AI Chat Premium] Input focused');
                    }
                }, 100);
            });

            // Minimize panel
            if (aiMinimize) {
                aiMinimize.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AI Chat Premium] Minimize clicked, closing panel...');
                    
                    // Force override !important in CSS
                    aiPanel.style.setProperty('display', 'none', 'important');
                    aiPanel.style.setProperty('visibility', 'hidden', 'important');
                    aiPanel.style.setProperty('opacity', '0', 'important');
                    
                    aiToggle.style.setProperty('display', 'flex', 'important');
                    aiToggle.style.setProperty('visibility', 'visible', 'important');
                    aiToggle.style.setProperty('opacity', '1', 'important');
                });
            } else {
                console.warn('[AI Chat Premium] Minimize button not found!');
            }

            // Send message from new panel
            if (aiSend && aiInput && aiMessages) {
                const sendMessageNew = async function() {
                    const messageText = aiInput.value.trim();
                    if (!messageText) return;

                    // Add user message
                    const userBubble = document.createElement('div');
                    userBubble.className = 'ai-bubble user';
                    userBubble.textContent = messageText;
                    aiMessages.appendChild(userBubble);
                    aiInput.value = '';

                    // Scroll to bottom
                    aiMessages.scrollTop = aiMessages.scrollHeight;

                    // Show typing indicator
                    const typingBubble = document.createElement('div');
                    typingBubble.className = 'ai-bubble';
                    typingBubble.innerHTML = '<div style="display: flex; gap: 4px;"><div style="width: 6px; height: 6px; background: #00d4aa; border-radius: 50%; animation: typingBounce 1.4s infinite;"></div><div style="width: 6px; height: 6px; background: #00d4aa; border-radius: 50%; animation: typingBounce 1.4s infinite 0.2s;"></div><div style="width: 6px; height: 6px; background: #00d4aa; border-radius: 50%; animation: typingBounce 1.4s infinite 0.4s;"></div></div>';
                    aiMessages.appendChild(typingBubble);
                    aiMessages.scrollTop = aiMessages.scrollHeight;

                    try {
                        const response = await fetch('/api/ai/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                message: messageText,
                                context: {
                                    route: document.getElementById('summary-route')?.textContent || 'N/A',
                                    cargo: document.getElementById('summary-cargo')?.textContent || 'N/A',
                                    container: document.getElementById('summary-container')?.textContent || 'N/A',
                                    carrier: document.getElementById('summary-carrier')?.textContent || 'N/A'
                                }
                            })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`API Error: ${response.status} - ${errorText}`);
                        }
                        
                        const data = await response.json();
                        console.log('[AI Chat Premium] Response received:', data);

                        // Remove typing indicator
                        typingBubble.remove();

                        // Add AI response - Check both 'reply' and 'response' for compatibility
                        const aiBubble = document.createElement('div');
                        aiBubble.className = 'ai-bubble';
                        const aiResponse = data.reply || data.response || data.message || 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn.';
                        aiBubble.textContent = aiResponse;
                        aiMessages.appendChild(aiBubble);
                        aiMessages.scrollTop = aiMessages.scrollHeight;

                    } catch (error) {
                        console.error('[AI Chat Premium] Error sending message:', error);
                        typingBubble.remove();
                        const errorBubble = document.createElement('div');
                        errorBubble.className = 'ai-bubble';
                        
                        // Provide more helpful error messages
                        let errorMessage = 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.';
                        if (error.message) {
                            if (error.message.includes('API Error: 500')) {
                                errorMessage = 'Lỗi server: Vui lòng kiểm tra cấu hình ANTHROPIC_API_KEY trong file .env';
                            } else if (error.message.includes('ANTHROPIC_API_KEY')) {
                                errorMessage = 'Lỗi: ANTHROPIC_API_KEY chưa được cấu hình. Vui lòng kiểm tra file .env';
                            } else if (error.message.includes('401') || error.message.includes('authentication')) {
                                errorMessage = 'Lỗi xác thực: API key không hợp lệ. Vui lòng kiểm tra ANTHROPIC_API_KEY trong file .env';
                            }
                        }
                        
                        errorBubble.textContent = errorMessage;
                        aiMessages.appendChild(errorBubble);
                        aiMessages.scrollTop = aiMessages.scrollHeight;
                    }
                };

                aiSend.addEventListener('click', sendMessageNew);
                aiInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessageNew();
                    }
                });
                
                console.log('[AI Chat Premium] Send message handlers attached');
            }
        } else {
            console.warn('[AI Chat Premium] Toggle or panel not found, falling back to legacy...');
        }
        
        // ========================================
        // LEGACY CODE (Backward Compatibility)
        // ========================================
        // DOM ELEMENTS - Support both old and new IDs
        const chatButton = document.getElementById('chatButton') || document.getElementById('aiChatButton');
        const chatPopup = document.getElementById('chatPopup') || document.getElementById('aiChatPopup');
        const chatClose = document.getElementById('chatClose') || document.getElementById('chatCloseBtn');
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton') || document.getElementById('chatSendBtn');
        const chatMessages = document.getElementById('chatMessages');
        const notificationBadge = document.getElementById('notificationBadge');

        // Only initialize legacy if new premium design is not available
        if (!aiToggle || !aiPanel) {
            // Check if required elements exist
            if (!chatPopup || !chatInput || !sendButton || !chatMessages) {
                console.warn('[AI Chat] Missing required DOM elements, widget not initialized.');
                console.warn('[AI Chat] chatPopup:', chatPopup, 'chatInput:', chatInput, 'sendButton:', sendButton, 'chatMessages:', chatMessages);
                return;
            }

            console.log('[AI Chat] Initializing legacy widget...');
            console.log('[AI Chat] chatButton:', chatButton, 'chatPopup:', chatPopup);
        }

        // Create backdrop overlay if it doesn't exist
        let backdrop = document.getElementById('aiChatBackdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'aiChatBackdrop';
            backdrop.className = 'ai-chat-backdrop';
            document.body.appendChild(backdrop);
        }

        // Store scroll position
        let savedScrollPosition = 0;
        let isChatOpen = false;

        // OPEN/CLOSE CHAT POPUP
        function openChat(e) {
            // Prevent any default behavior that might cause scrolling
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Prevent multiple opens
            if (isChatOpen) {
                return;
            }
            
            console.log('[AI Chat] Opening chat popup...');
            if (!chatPopup) {
                console.error('[AI Chat] chatPopup is null!');
                return;
            }
            
            isChatOpen = true;
            
            // Save current scroll position BEFORE any DOM changes
            savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            
            // Prevent body scroll when modal is open (but keep scroll position)
            // Use a more reliable method to prevent scroll
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.documentElement.style.scrollBehavior = 'auto';
            
            // Show backdrop first
            if (backdrop) {
                backdrop.classList.add('active');
            }
            
            // Force display and visibility with centered transform
            // Set all styles explicitly to ensure visibility (force override !important)
            chatPopup.style.setProperty('display', 'flex', 'important');
            chatPopup.style.setProperty('visibility', 'visible', 'important');
            chatPopup.style.setProperty('opacity', '0', 'important');
            chatPopup.style.setProperty('z-index', '99999', 'important');
            chatPopup.style.setProperty('position', 'fixed', 'important');
            chatPopup.style.setProperty('top', '50%', 'important');
            chatPopup.style.setProperty('left', '50%', 'important');
            chatPopup.style.setProperty('transform', 'translate(-50%, -50%) scale(0.85)', 'important');
            chatPopup.classList.add('active');
            
            // Force reflow to ensure styles are applied
            void chatPopup.offsetHeight;
            
            // Small delay to ensure CSS transitions work, then animate to full opacity
            setTimeout(() => {
                chatPopup.style.setProperty('opacity', '1', 'important');
                chatPopup.style.setProperty('transform', 'translate(-50%, -50%) scale(1)', 'important');
                chatPopup.style.setProperty('visibility', 'visible', 'important');
            }, 10);
            
            // Focus input without causing scroll
            if (chatInput) {
                setTimeout(() => {
                    // Prevent scroll when focusing - use preventScroll option
                    try {
                        chatInput.focus({ preventScroll: true });
                    } catch (e) {
                        // Fallback for older browsers
                        chatInput.focus();
                    }
                    // Ensure we're still at the saved position
                    if (document.body.style.position === 'fixed') {
                        // Position is already locked, no need to scroll
                    }
                }, 200);
            }
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
            }
            
            console.log('[AI Chat] Chat popup opened successfully');
        }

        function closeChat() {
            console.log('[AI Chat] Closing chat popup...');
            
            isChatOpen = false;
            
            // Get the scroll position from body top style before removing it
            const bodyTop = document.body.style.top;
            const scrollY = bodyTop ? parseInt(bodyTop.replace('-', '')) : savedScrollPosition;
            
            // Restore body scroll and position
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.documentElement.style.scrollBehavior = '';
            
            // Restore scroll position after a brief delay to ensure styles are applied
            setTimeout(() => {
                window.scrollTo({
                    top: scrollY || savedScrollPosition,
                    behavior: 'auto'
                });
            }, 10);
            
            if (chatPopup) {
                chatPopup.classList.remove('active');
                // Delay hiding to allow animation (force override !important)
                setTimeout(() => {
                    chatPopup.style.setProperty('display', 'none', 'important');
                    chatPopup.style.setProperty('visibility', 'hidden', 'important');
                    chatPopup.style.setProperty('opacity', '0', 'important');
                }, 300);
            }
            
            // Hide backdrop
            if (backdrop) {
                backdrop.classList.remove('active');
            }
        }

        // Premium code already initialized above, skip duplicate

        // Event listeners for opening chat (Legacy support)
        // Support both chat button and 3D bot
        if (chatButton) {
            console.log('[AI Chat] Adding click listener to chatButton');
            chatButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openChat(e);
            });
        } else {
            console.warn('[AI Chat] chatButton not found!');
        }
        
        // Make 3D bot clickable to open chat
        const aiBot = document.getElementById('aiBot');
        if (aiBot) {
            console.log('[AI Chat] Adding click listener to 3D bot');
            
            // Force enable pointer events and z-index
            aiBot.style.setProperty('cursor', 'pointer', 'important');
            aiBot.style.setProperty('pointer-events', 'auto', 'important');
            aiBot.style.setProperty('z-index', '99999', 'important');
            
            // Ensure parent container also allows clicks
            const widgetContainer = aiBot.closest('.ai-widget-container');
            if (widgetContainer) {
                widgetContainer.style.setProperty('pointer-events', 'auto', 'important');
                widgetContainer.style.setProperty('z-index', '99999', 'important');
            }
            
            aiBot.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[AI Chat] 3D bot clicked, opening chat...');
                openChat(e);
            });
            
            // Also support touch events for mobile
            aiBot.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[AI Chat] 3D bot touched, opening chat...');
                openChat(e);
            });
        } else {
            console.warn('[AI Chat] 3D bot (aiBot) not found!');
        }
        
        if (chatClose) {
            chatClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeChat();
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && chatPopup && chatPopup.classList.contains('active')) {
                closeChat();
            }
        });
        
        // Close when clicking on backdrop
        if (backdrop) {
            backdrop.addEventListener('click', function(e) {
                e.stopPropagation();
                closeChat();
            });
        }


        // SEND MESSAGE FUNCTION
        async function sendMessage() {
            const messageText = chatInput.value.trim();
            
            if (!messageText) return;

            addMessage(messageText, 'user');
            chatInput.value = '';
            sendButton.disabled = true;
            showTypingIndicator();

            try {
                // Extract context from page
                const context = {
                    overall_risk: document.getElementById('overall-risk-index')?.textContent || 'N/A',
                    expected_loss: document.getElementById('expected-loss')?.textContent || 'N/A',
                    reliability: document.getElementById('reliability-score')?.textContent || 'N/A',
                    route: document.getElementById('routeChip')?.textContent || 'N/A',
                    esg_score: document.getElementById('esg-score')?.textContent || 'N/A',
                    climate_hazard_index: document.getElementById('chi-hero-value')?.textContent || 'N/A'
                };

                const response = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: messageText,
                        context: context
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log('[AI Chat Legacy] Response received:', data);

                hideTypingIndicator();
                // Check both 'reply' and 'response' for compatibility
                const aiResponse = data.reply || data.response || data.message || 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn.';
                addMessage(aiResponse, 'ai');

            } catch (error) {
                console.error('[AI Chat Legacy] Error sending message:', error);
                hideTypingIndicator();
                
                // Provide more helpful error messages
                let errorMessage = 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.';
                if (error.message) {
                    if (error.message.includes('API Error: 500')) {
                        errorMessage = 'Lỗi server: Vui lòng kiểm tra cấu hình ANTHROPIC_API_KEY trong file .env';
                    } else if (error.message.includes('ANTHROPIC_API_KEY')) {
                        errorMessage = 'Lỗi: ANTHROPIC_API_KEY chưa được cấu hình. Vui lòng kiểm tra file .env';
                    } else if (error.message.includes('401') || error.message.includes('authentication')) {
                        errorMessage = 'Lỗi xác thực: API key không hợp lệ. Vui lòng kiểm tra ANTHROPIC_API_KEY trong file .env';
                    }
                }
                
                addMessage(errorMessage, 'ai');
            } finally {
                sendButton.disabled = false;
            }
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = sender === 'ai' ? '🤖' : '👤';
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.textContent = text;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(bubble);
            chatMessages.appendChild(messageDiv);
            scrollToBottom();
        }

        function showTypingIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'message ai';
            indicator.id = 'typingIndicator';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '🤖';
            
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message-bubble typing-indicator active';
            typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            
            indicator.appendChild(avatar);
            indicator.appendChild(typingDiv);
            chatMessages.appendChild(indicator);
            scrollToBottom();
        }

        function hideTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) indicator.remove();
        }

        function scrollToBottom() {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Event listeners
        if (sendButton) sendButton.addEventListener('click', sendMessage);
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        // Prevent popup from closing when clicking inside
        if (chatPopup) {
            chatPopup.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
})();
