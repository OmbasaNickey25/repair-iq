const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

const app = express();
const port = process.env.PORT || 3000;

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
    "RAM Module",
    "CPU Processor",
    "Motherboard",
    "Graphics Card (GPU)",
    "Hard Disk Drive (HDD)",
    "Solid State Drive (SSD)",
    "Power Supply Unit (PSU)",
    "Cooling Fan",
    "Network Card",
    "Battery"
];

// Load Model
let model;
const loadModel = async () => {
    try {
        const modelPath = path.join(__dirname, 'hardware_model.h5');
        // Load Keras model directly using tfjs-node
        model = await tf.node.loadKerasModel(modelPath);
        console.log("Hardware Model Loaded Successfully from:", modelPath);
    } catch (error) {
        console.error("Error loading model:", error);
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
            return res.status(503).json({ error: 'Model not loaded yet' });
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

        const detectedComponent = HARDWARE_CLASSES[predictionIndex] || "Unknown";

        // Cleanup tensors
        tf.dispose([tensor, normalized, predictions]);

        console.log(`Prediction: ${detectedComponent} (${maxProbability.toFixed(2)})`);

        res.json({
            component: detectedComponent,
            confidence: parseFloat(maxProbability.toFixed(2))
        });

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
