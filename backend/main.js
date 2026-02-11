const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

// Environment configuration
const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    modelPath: process.env.TFJS_MODEL_PATH || './tfjs_model/model.json',
    enableLogging: process.env.ENABLE_LOGGING !== 'false'
};

const app = express();
const port = config.port;

// Middleware
app.use(cors());
app.use(express.json());
// Serve frontend from the 'public' directory one level up
app.use(express.static(path.join(__dirname, '../public')));
// Serve src directory for ES modules
app.use('/src', express.static(path.join(__dirname, '../src')));

// Upload configuration
const upload = multer({ storage: multer.memoryStorage() });

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

// Start server
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Health check available at: http://localhost:${port}/health`);
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
