export class AROverlay {
    constructor(overlayCanvasId) {
        this.canvas = document.getElementById(overlayCanvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawReticle();
    }

    drawReticle() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        // Draw a central scanning box
        const boxSize = Math.min(width, height) * 0.6;
        const x = (width - boxSize) / 2;
        const y = (height - boxSize) / 2;

        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, boxSize, boxSize);

        // Draw "Scan Here" text
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("Align Component Here", width / 2, y - 20);
    }

    showLabel(text) {
        // Simple AR: Draw label in center of reticle
        const { width, height } = this.canvas;
        this.drawReticle(); // Clear and redraw base

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(width / 2 - 100, height / 2 - 25, 200, 50);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, width / 2, height / 2 + 8);
    }

    clear() {
        this.drawReticle();
    }
}
