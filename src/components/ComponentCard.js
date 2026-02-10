export class ComponentCard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="card-loading">
                <div class="spinner"></div>
                <p>Analyzing component...</p>
            </div>
        `;
        this.container.classList.remove('hidden');
    }

    update(componentName, confidence, aiExplanationHTML) {
        this.container.innerHTML = `
            <div class="card-header">
                <h2>${componentName}</h2>
                <span class="confidence badge">Confidence: ${Math.round(confidence * 100)}%</span>
            </div>
            <div class="card-body">
                ${aiExplanationHTML}
            </div>
        `;
        this.container.classList.remove('hidden');
    }

    setError(message) {
        this.container.innerHTML = `
            <div class="card-error">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
        this.container.classList.remove('hidden');
    }

    clear() {
        this.container.innerHTML = '';
        this.container.classList.add('hidden');
    }
}
