const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const http = require('http');
const WebSocket = require('ws');
const QRCode = require('qrcode');

// Environment configuration
const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    modelPath: process.env.TFJS_MODEL_PATH || './tfjs_model/model.json',
    enableLogging: process.env.ENABLE_LOGGING !== 'false',
    corsOrigin: process.env.CORS_ORIGIN || '*'
};

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = config.port;

// Middleware
app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// Phone camera connection management
const phoneConnections = new Map();
let connectionId = 0;

// WebSocket connection handling
wss.on('connection', (ws) => {
    const id = ++connectionId;
    phoneConnections.set(id, ws);
    
    if (config.enableLogging) {
        console.log(`Phone camera connected: ${id}`);
    }
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'frame') {
                // Broadcast frame to all connected desktop clients
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'phone-frame',
                            id: id,
                            data: data.data
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });
    
    ws.on('close', () => {
        phoneConnections.delete(id);
        if (config.enableLogging) {
            console.log(`Phone camera disconnected: ${id}`);
        }
        
        // Notify desktop clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'phone-disconnected',
                    id: id
                }));
            }
        });
    });
});

// Hardware Classes (Verify these match your training data labels)
const HARDWARE_CLASSES = [
    // PC / Phone Components
    "ram_module",
    "ram_stick",
    "hard_drive",
    "ssd",
    "capacitor",
    "motherboard",
    "charging_port",
    "processor",
    "sim_slot",
    "battery",
    "display_connector",

    // Computer Ports
    "usb_port",
    "hdmi_port",
    "ethernet_port",
    "vga_port",
    "dvi_port",

    // Internal Computer Components
    "power_supply_unit",
    "graphics_card",
    "cooling_fan",
    "heat_sink",

    // Cables
    "sata_cable",
    "power_cable",
    "vga_cable",
    "dvi_cable",

    // Peripherals
    "keyboard",
    "mouse",
    "monitor",
    "speakers"
];


// Load Model
let model;
let modelMetadata;
const loadModel = async () => {
    try {
        const modelDir = path.dirname(config.modelPath);
        const modelPath = path.resolve(__dirname, config.modelPath);
        const metadataPath = path.join(modelDir, 'metadata.json');

        if (config.enableLogging) {
            console.log(`[DEBUG] Checking model directory: ${modelDir}`);
            if (fs.existsSync(modelDir)) {
                console.log(`[DEBUG] Directory contents:`, fs.readdirSync(modelDir));
            } else {
                console.error(`[ERROR] Model directory does not exist! Path: ${modelDir}`);
            }
            console.log(`[DEBUG] Attempting to load model from: file://${modelPath}`);
        }

        // Load model metadata first
        if (fs.existsSync(metadataPath)) {
            const metadataRaw = fs.readFileSync(metadataPath, 'utf8');
            modelMetadata = JSON.parse(metadataRaw);
            if (config.enableLogging) {
                console.log(`[DEBUG] Model metadata loaded:`, modelMetadata);
            }
        }

        // Load TFJS model in standard format
        model = await tf.loadLayersModel('file://' + modelPath);
        console.log("Hardware Model Loaded Successfully from:", modelPath);
        
        // Log model info if available
        if (modelMetadata) {
            console.log("Model info:", {
                format: modelMetadata.format,
                classes: modelMetadata.classes?.length || 'unknown',
                imageSize: modelMetadata.imageSize || 'unknown'
            });
        }
    } catch (error) {
        console.error("Error loading model:", error);
        
        // Fallback: Check if original h5 exists for debugging
        const h5Path = path.join(__dirname, 'hardware_model.h5');
        if (config.enableLogging) {
            console.log(`[DEBUG] Checking for original .h5 file: ${h5Path} exists=${fs.existsSync(h5Path)}`);
        }
        
        // Don't crash the app if model fails to load
        console.warn("Application will continue without ML predictions");
    }
};

loadModel();

/**
 * POST /predict
 * Accepts an image file (named 'image')
 * Returns JSON: { component: string, confidence: number }
 */
app.post('/predict', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        if (!model) {
            return res.status(503).json({ 
                error: 'Model not loaded yet',
                fallback: 'Please try again later or contact support'
            });
        }

        // Decode image buffer
        const imageBuffer = req.file.buffer;

        // Tensor processing
        const tensor = tf.node.decodeImage(imageBuffer, 3)
            .resizeNearestNeighbor([224, 224]) // Adjust size to match model input (e.g., 224x224)
            .toFloat()
            .expandDims();

        // Normalize if model expects it (e.g., 0-1 or -1 to 1)
        // Assuming MobileNet style preprocessing or similar:
        const normalized = tensor.div(255.0); // Simple 0-1 normalization

        const predictions = model.predict(normalized);
        const predictionData = await predictions.data();

        // Find highest confidence index
        const maxProbability = Math.max(...predictionData);
        const predictionIndex = predictionData.indexOf(maxProbability);

        // Use classes from metadata if available, otherwise fallback to hardcoded list
        const classes = modelMetadata?.classes || HARDWARE_CLASSES;
        const detectedComponent = classes[predictionIndex] || "Unknown";

        // Cleanup tensors
        tf.dispose([tensor, normalized, predictions]);

        console.log(`Prediction: ${detectedComponent} (${maxProbability.toFixed(2)})`);

        res.json({
            component: detectedComponent,
            confidence: parseFloat(maxProbability.toFixed(2))
        });

    } catch (error) {
        console.error('Prediction error:', error);
        
        // Enhanced error logging in development
        const errorResponse = { 
            error: 'Internal server error',
            details: error.message 
        };
        
        if (config.nodeEnv === 'development') {
            errorResponse.stack = error.stack;
        }
        
        // Specific error handling
        if (error.message.includes('Input buffer contains unsupported image format')) {
            return res.status(400).json({ 
                error: 'Invalid image format', 
                details: 'The uploaded file is not a valid image or is unsupported.' 
            });
        }
        
        res.status(500).json(errorResponse);
    }
});

// Phone camera connection endpoint
app.get('/phone-camera', (req, res) => {
    const phoneUrl = `${req.protocol}://${req.get('host')}/phone-camera.html`;
    
    QRCode.toDataURL(phoneUrl, (err, qrCode) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to generate QR code' });
        }
        
        res.json({
            phoneUrl: phoneUrl,
            qrCode: qrCode,
            instructions: [
                '1. Scan this QR code with your phone',
                '2. Open the link in your phone browser',
                '3. Allow camera access on your phone',
                '4. Your phone camera will appear in the desktop app'
            ]
        });
    });
});

// Phone camera interface page
app.get('/phone-camera.html', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RepairIQ - Phone Camera</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #1a1a1a;
            color: white;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }
        .container {
            position: relative;
            width: 100vw;
            height: 100vh;
        }
        #phone-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .controls {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
        }
        .status {
            background: rgba(0, 123, 255, 0.8);
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 14px;
            backdrop-filter: blur(10px);
        }
        .disconnect-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
        }
        .error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            padding: 20px;
            background: rgba(220, 53, 69, 0.9);
            border-radius: 10px;
            max-width: 80%;
        }
    </style>
</head>
<body>
    <div class="container">
        <video id="phone-video" autoplay playsinline muted></video>
        <div class="controls">
            <div class="status" id="status">Connecting...</div>
            <button class="disconnect-btn" onclick="disconnect()">Disconnect</button>
        </div>
        <div class="error" id="error" style="display: none;">
            <h3>Camera Access Required</h3>
            <p>Please allow camera access to use this feature.</p>
            <button onclick="requestCamera()">Try Again</button>
        </div>
    </div>

    <script>
        let ws;
        let video;
        let canvas;
        let stream;
        
        function init() {
            video = document.getElementById('phone-video');
            canvas = document.createElement('canvas');
            const status = document.getElementById('status');
            
            // Connect WebSocket
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            ws = new WebSocket(\`\${protocol}//\${window.location.host}\`);
            
            ws.onopen = () => {
                status.textContent = 'Connected to desktop';
                status.style.background = 'rgba(40, 167, 69, 0.8)';
                requestCamera();
            };
            
            ws.onclose = () => {
                status.textContent = 'Disconnected';
                status.style.background = 'rgba(220, 53, 69, 0.8)';
            };
            
            ws.onerror = () => {
                status.textContent = 'Connection error';
                status.style.background = 'rgba(220, 53, 69, 0.8)';
            };
        }
        
        function requestCamera() {
            const error = document.getElementById('error');
            
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            })
            .then(s => {
                stream = s;
                video.srcObject = stream;
                error.style.display = 'none';
                startStreaming();
            })
            .catch(err => {
                console.error('Camera error:', err);
                error.style.display = 'block';
            });
        }
        
        function startStreaming() {
            const ctx = canvas.getContext('2d');
            canvas.width = 640;
            canvas.height = 480;
            
            function captureFrame() {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            type: 'frame',
                            data: dataUrl
                        }));
                    }
                }
                requestAnimationFrame(captureFrame);
            }
            
            captureFrame();
        }
        
        function disconnect() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (ws) {
                ws.close();
            }
            window.close();
        }
        
        // Initialize on load
        window.addEventListener('load', init);
    </script>
</body>
</html>
    `);
});
// Health check endpoint for Render monitoring
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        modelLoaded: !!model,
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        uptime: process.uptime()
    });
});

// Start server with WebSocket support
server.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Health check available at: http://localhost:${port}/health`);
    console.log(`Phone camera QR code at: http://localhost:${port}/phone-camera`);
});

// Graceful shutdown and memory cleanup
process.on('SIGTERM', () => {
    console.log('SIGTERM received, cleaning up...');
    if (model) {
        model.dispose();
        console.log('Model disposed');
    }
    process.exit(0);
});

process.on('exit', () => {
    if (model) {
        model.dispose();
    }
});
