import API_CONFIG from '../config/api.js';

export class PhoneCameraConnector {
    constructor() {
        this.isPhoneMode = false;
        this.ws = null;
        this.phoneVideoElement = null;
        this.cameraBtn = document.getElementById('camera-btn');
        this.cameraFeed = document.getElementById('camera-feed');
        
        this.init();
    }

    init() {
        this.cameraBtn.addEventListener('click', () => this.toggleCameraMode());
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.ws = new WebSocket(API_CONFIG.WS_URL);
        
        this.ws.onopen = () => {
            console.log('Connected to phone camera server');
        };
        
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        };
        
        this.ws.onclose = () => {
            console.log('Disconnected from phone camera server');
            this.switchToWebcam();
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.showError('Connection error');
        };
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'phone-frame':
                this.displayPhoneFrame(data.data);
                break;
            case 'phone-disconnected':
                this.switchToWebcam();
                break;
        }
    }

    async toggleCameraMode() {
        if (this.isPhoneMode) {
            await this.switchToWebcam();
        } else {
            await this.switchToPhone();
        }
    }

    async switchToPhone() {
        try {
            // Show QR code modal
            const qrData = await this.getQRCode();
            this.showQRModal(qrData);
        } catch (error) {
            console.error('Failed to get QR code:', error);
            this.showError('Failed to connect to phone camera');
        }
    }

    async switchToWebcam() {
        this.isPhoneMode = false;
        this.cameraBtn.classList.remove('active');
        this.cameraBtn.innerHTML = '<span class="icon">📱</span> PHONE';
        
        // Remove phone video element if exists
        if (this.phoneVideoElement) {
            this.phoneVideoElement.remove();
            this.phoneVideoElement = null;
        }
        
        // Restore webcam
        this.cameraFeed.style.display = 'block';
        
        // Restart webcam if needed
        if (window.app && window.app.camera) {
            try {
                await window.app.camera.start();
            } catch (error) {
                console.error('Failed to restart webcam:', error);
            }
        }
    }

    async getQRCode() {
        const response = await fetch(`${API_CONFIG.BASE_URL}/phone-camera`);
        if (!response.ok) {
            throw new Error('Failed to get QR code');
        }
        return await response.json();
    }

    showQRModal(qrData) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-modal-content">
                <div class="qr-header">
                    <h3>📱 Connect Phone Camera</h3>
                    <button class="qr-close" onclick="this.closest('.qr-modal').remove()">✕</button>
                </div>
                <div class="qr-body">
                    <div class="qr-code">
                        <img src="${qrData.qrCode}" alt="QR Code" />
                    </div>
                    <div class="qr-instructions">
                        <h4>How to connect:</h4>
                        <ol>
                            ${qrData.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                        <div class="qr-status" id="qr-status">Waiting for phone connection...</div>
                    </div>
                </div>
                <div class="qr-actions">
                    <button class="qr-btn secondary" onclick="this.closest('.qr-modal').remove()">Cancel</button>
                    <button class="qr-btn primary" onclick="window.phoneConnector.copyLink('${qrData.phoneUrl}')">Copy Link</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles
        if (!document.querySelector('#qr-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'qr-modal-styles';
            styles.textContent = `
                .qr-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }
                
                .qr-modal-content {
                    background: var(--card-bg);
                    border-radius: 20px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: var(--shadow-xl);
                    border: 1px solid var(--card-border);
                }
                
                .qr-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid var(--card-border);
                }
                
                .qr-header h3 {
                    margin: 0;
                    color: var(--text-color);
                    font-size: 1.2rem;
                }
                
                .qr-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .qr-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .qr-body {
                    padding: 20px;
                    text-align: center;
                }
                
                .qr-code {
                    margin-bottom: 20px;
                }
                
                .qr-code img {
                    width: 200px;
                    height: 200px;
                    border-radius: 10px;
                    border: 4px solid white;
                    box-shadow: var(--shadow-md);
                }
                
                .qr-instructions h4 {
                    color: var(--text-color);
                    margin-bottom: 15px;
                }
                
                .qr-instructions ol {
                    text-align: left;
                    color: var(--text-muted);
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                
                .qr-instructions li {
                    margin-bottom: 8px;
                }
                
                .qr-status {
                    background: rgba(0, 123, 255, 0.1);
                    color: var(--primary-color);
                    padding: 10px;
                    border-radius: 8px;
                    font-weight: 600;
                    margin-top: 15px;
                }
                
                .qr-status.connected {
                    background: rgba(40, 167, 69, 0.1);
                    color: var(--success-color);
                }
                
                .qr-actions {
                    display: flex;
                    gap: 10px;
                    padding: 20px;
                    border-top: 1px solid var(--card-border);
                }
                
                .qr-btn {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .qr-btn.primary {
                    background: var(--gradient-primary);
                    color: white;
                }
                
                .qr-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-color);
                    border: 1px solid var(--card-border);
                }
                
                .qr-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Listen for phone connection
        this.waitForPhoneConnection(modal);
    }

    waitForPhoneConnection(modal) {
        const checkConnection = () => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                // Wait for first phone frame
                const originalOnMessage = this.ws.onmessage;
                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'phone-frame') {
                            this.onPhoneConnected(modal);
                            this.ws.onmessage = originalOnMessage;
                        }
                    } catch (error) {
                        console.error('WebSocket message error:', error);
                    }
                };
            }
        };
        
        setTimeout(checkConnection, 100);
    }

    onPhoneConnected(modal) {
        const status = modal.querySelector('#qr-status');
        status.textContent = 'Phone connected! Switching to phone camera...';
        status.classList.add('connected');
        
        setTimeout(() => {
            modal.remove();
            this.activatePhoneMode();
        }, 1500);
    }

    activatePhoneMode() {
        this.isPhoneMode = true;
        this.cameraBtn.classList.add('active');
        this.cameraBtn.innerHTML = '<span class="icon">📷</span> PC';
        
        // Hide webcam
        this.cameraFeed.style.display = 'none';
        
        // Stop webcam if running
        if (window.app && window.app.camera) {
            const stream = this.cameraFeed.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
        
        // Create phone video element
        this.phoneVideoElement = document.createElement('img');
        this.phoneVideoElement.id = 'phone-video-feed';
        this.phoneVideoElement.style.cssText = `
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            height: calc(100% - 80px);
            object-fit: cover;
            z-index: 1;
        `;
        
        this.cameraFeed.parentNode.insertBefore(this.phoneVideoElement, this.cameraFeed.nextSibling);
    }

    displayPhoneFrame(dataUrl) {
        if (this.phoneVideoElement && this.isPhoneMode) {
            this.phoneVideoElement.src = dataUrl;
        }
    }

    copyLink(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link copied to clipboard!');
        }).catch(() => {
            this.showToast('Failed to copy link');
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-bg);
            color: var(--text-color);
            padding: 12px 20px;
            border-radius: 20px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            font-size: 0.9rem;
            border: 1px solid var(--card-border);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showError(message) {
        this.showToast(`❌ ${message}`);
    }

    captureFrame() {
        if (this.isPhoneMode && this.phoneVideoElement) {
            // Create canvas from phone video element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 640;
            canvas.height = 480;
            
            ctx.drawImage(this.phoneVideoElement, 0, 0, canvas.width, canvas.height);
            return new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg', 0.8);
            });
        } else {
            // Use original camera capture
            return window.app.camera.captureFrameBlob();
        }
    }
}
