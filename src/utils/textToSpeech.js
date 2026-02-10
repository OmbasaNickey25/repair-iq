export class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isSpeaking = false;
    }

    speak(text, onEndCallback) {
        if (this.synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        if (text !== '') {
            // Strip HTML tags for reading
            const plainText = text.replace(/<[^>]*>?/gm, '');

            this.utterance = new SpeechSynthesisUtterance(plainText);
            this.utterance.onend = () => {
                this.isSpeaking = false;
                if (onEndCallback) onEndCallback();
            };
            this.utterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror', event);
                this.isSpeaking = false;
            };

            this.utterance.rate = 1; // Normal speed
            this.utterance.pitch = 1; // Normal pitch

            this.synth.speak(this.utterance);
            this.isSpeaking = true;
        }
    }

    pause() {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.isSpeaking = false;
        }
    }

    resume() {
        if (this.synth.paused) {
            this.synth.resume();
            this.isSpeaking = true;
        }
    }

    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
            this.isSpeaking = false;
        }
    }
}
