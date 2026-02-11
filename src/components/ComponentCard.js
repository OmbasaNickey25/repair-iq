export class ComponentCard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="card-loading animate-fade-in">
                <div class="loading-spinner"></div>
                <div class="loading-text">Analyzing component...</div>
                <div class="loading-subtitle">AI is identifying the hardware component</div>
            </div>
        `;
        this.container.classList.remove('hidden');
        this.container.classList.add('show');
    }

    update(componentName, confidence, aiExplanationHTML) {
        const confidenceLevel = confidence >= 0.8 ? 'high' : confidence >= 0.6 ? 'medium' : 'low';
        const confidenceIcon = confidence >= 0.8 ? '✓' : confidence >= 0.6 ? '!' : '?';
        
        // Check if component is unknown
        const isUnknown = componentName.toLowerCase().includes('unknown') || confidence < 0.3;
        
        this.container.innerHTML = `
            <div class="card-header">
                <div class="card-title-section">
                    <h2>${this.formatComponentName(componentName)}</h2>
                    <span class="confidence-badge ${this.getConfidenceClass(confidence)}">
                        ${this.getConfidenceIcon(confidence)} ${Math.round(confidence * 100)}%
                    </span>
                </div>
                <button class="card-close-btn" onclick="window.app.card.clear()" aria-label="Close">
                    ✕
                </button>
            </div>
            <div class="card-body">
                ${isUnknown ? this.getUnknownComponentMessage() : this.formatExplanation(aiExplanationHTML)}
            </div>
            ${isUnknown ? this.getUnknownComponentActions() : this.getStandardActions()}
        `;
        this.container.classList.remove('hidden');
        this.container.classList.add('animate-slide-in');
    }

    setError(message) {
        this.container.innerHTML = `
            <div class="card-error animate-scale-in">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Detection Failed</div>
                <div class="error-message">${message}</div>
                <div class="card-actions">
                    <button class="card-btn primary" onclick="this.retryScan()">
                        <span>🔄</span> Try Again
                    </button>
                </div>
            </div>
        `;
        this.container.classList.remove('hidden');
        this.container.classList.add('show');
    }

    hide() {
        this.container.classList.remove('show');
        this.container.classList.add('hidden');
    }

    clear() {
        this.container.innerHTML = '';
        this.container.classList.remove('show', 'animate-slide-in', 'animate-scale-in');
        this.container.classList.add('hidden');
    }

    getConfidenceClass(confidence) {
        if (confidence >= 0.8) return 'high';
        if (confidence >= 0.6) return 'medium';
        return 'low';
    }

    getConfidenceIcon(confidence) {
        if (confidence >= 0.8) return '✓';
        if (confidence >= 0.6) return '!';
        return '?';
    }

    getUnknownComponentMessage() {
        return `
            <div class="info-section error">
                <div class="info-title">
                    <span>❓</span> Unknown Component
                </div>
                <p>I couldn't identify this hardware component with confidence. This could be:</p>
                <ul>
                    <li>A rare or specialized component</li>
                    <li>Poor lighting or camera angle</li>
                    <li>Component not in my training database</li>
                    <li>Damaged or unclear component markings</li>
                </ul>
            </div>
            <div class="info-section tips">
                <div class="info-title">
                    <span>💡</span> Tips for Better Detection
                </div>
                <ul>
                    <li>Ensure good lighting</li>
                    <li>Hold camera steady and close</li>
                    <li>Clean the component surface</li>
                    <li>Try different angles</li>
                </ul>
            </div>
        `;
    }

    getUnknownComponentActions() {
        return `
            <div class="card-actions">
                <button class="card-btn primary" onclick="window.app.handleScan()">
                    <span>🔄</span> Rescan
                </button>
                <button class="card-btn secondary" onclick="window.app.handleRefresh()">
                    <span>🔄</span> Refresh
                </button>
                <button class="card-btn secondary" onclick="window.app.card.clear()">
                    <span>✕</span> Close
                </button>
            </div>
        `;
    }

    getStandardActions() {
        return `
            <div class="card-actions">
                <button class="card-btn primary">📚 Learn More</button>
                <button class="card-btn secondary">🔗 Share</button>
                <button class="card-btn secondary" onclick="window.app.card.clear()">
                    <span>✕</span> Close
                </button>
            </div>
        `;
    }

    formatComponentName(name) {
        // Convert snake_case to Title Case and add emojis
        const nameMap = {
            'ram_module': '🧠 RAM Module',
            'ram_stick': '💾 RAM Stick',
            'hard_drive': '💿 Hard Drive',
            'ssd': '⚡ SSD',
            'capacitor': '🔋 Capacitor',
            'motherboard': '🏛️ Motherboard',
            'charging_port': '🔌 Charging Port',
            'processor': '🖥️ Processor',
            'sim_slot': '📱 SIM Slot',
            'battery': '🔋 Battery',
            'display_connector': '📺 Display Connector',
            'usb_port': '🔌 USB Port',
            'hdmi_port': '📡 HDMI Port',
            'ethernet_port': '🌐 Ethernet Port',
            'vga_port': '🖥️ VGA Port',
            'dvi_port': '📺 DVI Port',
            'power_supply_unit': '⚡ Power Supply',
            'graphics_card': '🎮 Graphics Card',
            'cooling_fan': '💨 Cooling Fan',
            'heat_sink': '🔥 Heat Sink',
            'sata_cable': '🔗 SATA Cable',
            'power_cable': '⚡ Power Cable',
            'vga_cable': '📺 VGA Cable',
            'dvi_cable': '🖥️ DVI Cable',
            'keyboard': '⌨️ Keyboard',
            'mouse': '🖱️ Mouse',
            'monitor': '📺 Monitor',
            'speakers': '🔊 Speakers'
        };
        
        return nameMap[name] || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    formatExplanation(html) {
        // Add structured sections to the AI explanation
        if (html.includes('<h3>') || html.includes('<ul>')) {
            return html; // Already structured
        }
        
        // Create structured content from plain text
        const sections = html.split('\n').filter(line => line.trim());
        let formatted = '';
        
        sections.forEach((section, index) => {
            if (section.includes('function') || section.includes('purpose')) {
                formatted += `<div class="info-section">
                    <div class="info-title">
                        <span>🎯</span> Function
                    </div>
                    <p>${section}</p>
                </div>`;
            } else if (section.includes('troubleshoot') || section.includes('problem')) {
                formatted += `<div class="info-section warning">
                    <div class="info-title">
                        <span>⚠️</span> Troubleshooting
                    </div>
                    <p>${section}</p>
                </div>`;
            } else if (section.length > 50) {
                formatted += `<div class="info-section">
                    <div class="info-title">
                        <span>📋</span> Details
                    </div>
                    <p>${section}</p>
                </div>`;
            }
        });
        
        return formatted || `<div class="info-section">
            <div class="info-title">
                <span>📋</span> Information
            </div>
            <p>${html}</p>
        </div>`;
    }
}
