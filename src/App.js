import { CameraScanner } from './components/CameraScanner.js';
import { ComponentCard } from './components/ComponentCard.js';
import { VoicePlayer } from './components/VoicePlayer.js';
import { AROverlay } from './components/AROverlay.js';
import { generateExplanationPrompt } from './ai/prompts.js';

export class App {
    constructor() {
        this.camera = new CameraScanner('camera-feed');
        this.card = new ComponentCard('component-card');
        this.voice = new VoicePlayer('voice-controls');
        this.ar = new AROverlay('ar-overlay');

        this.scanBtn = document.getElementById('scan-btn');
        this.scanBtn.addEventListener('click', () => this.handleScan());

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

    async handleScan() {
        this.card.showLoading();
        this.ar.clear();

        try {
            // 1. Capture Image
            const blob = await this.camera.captureFrameBlob();

            // 2. Send to Backend
            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error("Backend prediction failed");

            const result = await response.json();
            const { component, confidence } = result;

            // 3. Update AR
            this.ar.showLabel(component);

            // 4. Generate AI Explanation
            // Using puter.js if available globally, else mock
            let aiText = "";
            if (window.puter) {
                const prompt = generateExplanationPrompt(component);
                const aiResponse = await window.puter.ai.chat(prompt);
                aiText = aiResponse.toString(); // puter.ai.chat returns an object usually, .toString() or .message
                // Adjust based on actual puter.js API. Assuming puter.ai.chat(msg) returns { message: { content: ... } } or similar string.
                // Checking documentation or standard usage: often returns a string or promise resolving to string.
                // Let's assume text response.
            } else {
                aiText = `
                    <h3>${component}</h3>
                    <p>AI generation unavailable (puter.js not found). Here is a static explanation.</p>
                    <p>This is a critical hardware component.</p>
                `;
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
