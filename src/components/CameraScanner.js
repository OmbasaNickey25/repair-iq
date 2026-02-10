export class CameraScanner {
    constructor(videoElementId) {
        this.video = document.getElementById(videoElementId);
        this.stream = null;
        this.canvas = document.createElement('canvas'); // Off-screen canvas
    }

    async start() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Camera API not available");
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" } // Prefer back camera on mobile
            });
            this.video.srcObject = this.stream;
            await this.video.play();
        } catch (error) {
            console.error("Error accessing camera:", error);
            throw error;
        }
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    captureFrameBlob() {
        return new Promise((resolve, reject) => {
            if (!this.video || this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
                reject(new Error("Video not ready"));
                return;
            }

            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            const ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            this.canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Failed to create blob"));
            }, 'image/jpeg', 0.8);
        });
    }
}
