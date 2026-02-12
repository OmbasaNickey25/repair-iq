export class ImageUploader {
    constructor() {
        this.uploadBtn = document.getElementById('upload-btn');
        this.fileInput = document.getElementById('image-upload');
        this.cameraFeed = document.getElementById('camera-feed');
        this.uploadedImage = null;
        
        this.init();
    }

    init() {
        this.uploadBtn.addEventListener('click', () => this.handleUploadClick());
        this.fileInput.addEventListener('change', (event) => this.handleFileSelect(event));
        
        // Drag and drop support
        this.setupDragAndDrop();
    }

    handleUploadClick() {
        this.fileInput.click();
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && this.validateImage(file)) {
            this.processImage(file);
        }
    }

    validateImage(file) {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file');
            return false;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('Image size must be less than 10MB');
            return false;
        }

        return true;
    }

    processImage(file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            this.displayUploadedImage(imageUrl);
            this.uploadedImage = this.dataURLtoBlob(imageUrl);
            
            // Trigger scan after upload
            setTimeout(() => {
                this.triggerScan();
            }, 500);
        };

        reader.onerror = () => {
            this.showError('Failed to read image file');
        };

        reader.readAsDataURL(file);
    }

    displayUploadedImage(imageUrl) {
        // Create image overlay
        const overlay = document.createElement('div');
        overlay.className = 'upload-preview-overlay';
        overlay.innerHTML = `
            <div class="upload-preview-content">
                <img src="${imageUrl}" alt="Uploaded component" />
                <div class="upload-preview-info">
                    <span>📁 Image Uploaded</span>
                    <button class="upload-preview-close" onclick="this.closest('.upload-preview-overlay').remove()">✕</button>
                </div>
            </div>
        `;
        
        // Add styles if not exists
        if (!document.querySelector('#upload-preview-styles')) {
            const styles = document.createElement('style');
            styles.id = 'upload-preview-styles';
            styles.textContent = `
                .upload-preview-overlay {
                    position: absolute;
                    top: 80px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    animation: fadeIn 0.3s ease;
                }
                
                .upload-preview-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    text-align: center;
                }
                
                .upload-preview-content img {
                    max-width: 100%;
                    max-height: 70vh;
                    object-fit: contain;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                }
                
                .upload-preview-info {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 123, 255, 0.9);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    backdrop-filter: blur(10px);
                }
                
                .upload-preview-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .upload-preview-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Remove existing overlay if any
        const existingOverlay = document.querySelector('.upload-preview-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        document.body.appendChild(overlay);
    }

    setupDragAndDrop() {
        const dropZone = document.body;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => this.highlight(), false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => this.unhighlight(), false);
        });
        
        dropZone.addEventListener('drop', (event) => this.handleDrop(event), false);
    }

    preventDefaults(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    highlight() {
        document.body.classList.add('drag-active');
    }

    unhighlight() {
        document.body.classList.remove('drag-active');
    }

    handleDrop(event) {
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.processImage(files[0]);
        }
    }

    dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new Blob([u8arr], { type: mime });
    }

    triggerScan() {
        // Trigger the scan process with uploaded image
        if (window.app && window.app.handleScanWithUpload) {
            window.app.handleScanWithUpload(this.uploadedImage);
        }
    }

    showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'upload-error-toast';
        toast.textContent = `❌ ${message}`;
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
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    clearUploadedImage() {
        this.uploadedImage = null;
        const overlay = document.querySelector('.upload-preview-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    getUploadedImage() {
        return this.uploadedImage;
    }
}
