import { TextToSpeech } from '../utils/textToSpeech.js';

export class VoicePlayer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tts = new TextToSpeech();
        this.currentText = "";
        this.isPlaying = false;

        // Ensure the TTS logic is bound correctly
        // We will render buttons dynamically or assume they exist and bind events?
        // Let's render them dynamically to be safe.
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <button id="voice-play" class="btn-icon" aria-label="Play Explanation" disabled>▶️</button>
            <button id="voice-pause" class="btn-icon hidden" aria-label="Pause Voice">⏸️</button>
            <button id="voice-stop" class="btn-icon" aria-label="Stop Voice" disabled>⏹️</button>
        `;

        this.playBtn = this.container.querySelector('#voice-play');
        this.pauseBtn = this.container.querySelector('#voice-pause');
        this.stopBtn = this.container.querySelector('#voice-stop');

        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
    }

    setText(text) {
        this.currentText = text;
        this.stop(); // Reset on new text
        this.playBtn.disabled = false;
        this.stopBtn.disabled = true;
    }

    play() {
        if (!this.currentText) return;

        if (this.isPlaying) {
            // If already playing, maybe resume?
            this.tts.resume();
        } else {
            // Start reading
            this.tts.speak(this.currentText, () => this.onEnd());
            this.isPlaying = true;
        }

        this.updateUI(true);
    }

    pause() {
        this.tts.pause();
        this.updateUI(false); // Show play button again, but keep state as "paused" logic if needed
        // For simplicity, just toggle buttons
    }

    stop() {
        this.tts.stop();
        this.isPlaying = false;
        this.updateUI(false);
        this.stopBtn.disabled = true;
    }

    onEnd() {
        this.isPlaying = false;
        this.updateUI(false);
        this.stopBtn.disabled = true;
    }

    updateUI(isPlaying) {
        if (isPlaying) {
            this.playBtn.classList.add('hidden');
            this.pauseBtn.classList.remove('hidden');
            this.stopBtn.disabled = false;
        } else {
            this.playBtn.classList.remove('hidden');
            this.pauseBtn.classList.add('hidden');
        }
    }
}
