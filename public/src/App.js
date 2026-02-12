import { CameraScanner } from './components/CameraScanner.js';
import { ComponentCard } from './components/ComponentCard.js';
import { VoicePlayer } from './components/VoicePlayer.js';
import { AROverlay } from './components/AROverlay.js';
import { PhoneCameraConnector } from './components/PhoneCameraConnector.js';
import { ImageUploader } from './components/ImageUploader.js';
import { generateExplanationPrompt } from './ai/prompts.js';
import { getComponentFallback } from './ai/fallbackData.js';
import API_CONFIG from './config/api.js';

export class App {
    constructor() {
        this.camera = new CameraScanner('camera-feed');
        this.card = new ComponentCard('component-card');
        this.voice = new VoicePlayer('voice-controls');
        this.ar = new AROverlay('ar-overlay');
        this.phoneConnector = new PhoneCameraConnector();
        this.imageUploader = new ImageUploader();

        this.scanBtn = document.getElementById('scan-btn');
        this.refreshBtn = document.getElementById('refresh-btn');
        
        this.scanBtn.addEventListener('click', () => this.handleScan());
        this.refreshBtn.addEventListener('click', () => this.handleRefresh());

        // Make app globally available for components
        window.app = this;

        this.init();
    }

    async init() {
        try {
            await this.camera.start();
            console.log("App initialized");
        } catch (e) {
            alert("Failed to start camera: " + e.message);
        }
    }

    handleRefresh() {
        // Clear uploaded image
        this.imageUploader.clearUploadedImage();
        
        // Clear AR overlay
        this.ar.clear();
        
        // Clear component card
        this.card.clear();
        
        // Reset voice
        this.voice.setText('');
        
        // Re-enable scan button if it was disabled
        this.scanBtn.disabled = false;
        this.scanBtn.innerHTML = '<span class="icon">🔍</span> SCAN';
        
        console.log("App refreshed - ready for new scan");
    }

    async captureImage() {
        // Check if there's an uploaded image first
        const uploadedImage = this.imageUploader.getUploadedImage();
        if (uploadedImage) {
            return uploadedImage;
        }
        
        // Otherwise capture from phone or webcam
        if (this.phoneConnector.isPhoneMode) {
            return await this.phoneConnector.captureFrame();
        } else {
            return await this.camera.captureFrameBlob();
        }
    }

    async handleScanWithUpload(imageBlob) {
        this.card.showLoading();
        this.ar.clear();

        try {
            // Use the uploaded image directly
            const blob = imageBlob;

            // Send to Backend
            const formData = new FormData();
            formData.append('image', blob, 'upload.jpg');

            const response = await fetch(`${API_CONFIG.BASE_URL}/predict`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.details || "Backend prediction failed");
            }

            const result = await response.json();
            const { component, confidence } = result;

            // Update AR
            this.ar.showLabel(component);

            // Generate AI Explanation
            let aiText = "";
            try {
                if (window.puter) {
                    const prompt = generateExplanationPrompt(component);
                    const aiResponse = await window.puter.ai.chat(prompt);
                    aiText = aiResponse.toString();
                } else {
                    throw new Error("Puter not available");
                }
            } catch (error) {
                console.warn("AI generation failed, using fallback:", error.message);
                aiText = getComponentFallback(component);
            }

            // Update Card
            this.card.update(component, confidence, aiText);

            // Prepare Voice
            const plainText = aiText.replace(/<[^>]*>?/gm, '');
            this.voice.setText(plainText);

        } catch (error) {
            console.error(error);
            this.card.setError(error.message);
        }
    }

    async handleScan() {
        this.card.showLoading();
        this.ar.clear();

        try {
            // 1. Capture Image (from phone or webcam)
            const blob = await this.captureImage();

            // 2. Send to Backend
            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');

            const response = await fetch(`${API_CONFIG.BASE_URL}/predict`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.details || "Backend prediction failed");
            }

            const result = await response.json();
            const { component, confidence } = result;

            // 3. Update AR
            this.ar.showLabel(component);

            // 4. Generate AI Explanation
            // Using puter.js if available globally, else fallback data
            let aiText = "";
            try {
                if (window.puter) {
                    const prompt = generateExplanationPrompt(component);
                    const aiResponse = await window.puter.ai.chat(prompt);
                    aiText = aiResponse.toString();
                } else {
                    throw new Error("Puter not available");
                }
            } catch (error) {
                console.warn("AI generation failed, using fallback:", error.message);
                aiText = getComponentFallback(component);
            }

            // 5. Update Card
            this.card.update(component, confidence, aiText);

            // 6. Prepare Voice
            // Strip HTML for voice
            const plainText = aiText.replace(/<[^>]*>?/gm, '');
            this.voice.setText(plainText);

        } catch (error) {
            console.error(error);
            this.card.setError(error.message);
        }
    }
}
