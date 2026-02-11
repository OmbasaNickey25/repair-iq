# RepairIQ: Smart Hardware Learning Assistant PWA

RepairIQ is a Progressive Web App (PWA) designed to help students and technicians identify computer hardware components using their device's camera. It leverages AI and Computer Vision to provide real-time identification, troubleshooting guides, and voice-narrated explanations.

## Features

### **Core Functionality**
- **Real-time Component Detection**: Identifying hardware like RAM, CPU, Motherboards, and peripherals using a custom-trained Deep Learning model
- **AI-Powered Explanations**: Generates detailed descriptions and troubleshooting steps for identified components (powered by Puter.js)
- **AR Overlays**: Visual confirmation of detected components on the camera feed
- **Voice Narration**: Text-to-speech for accessibility and hands-free learning
- **Offline Capable**: Installable as a native app on mobile and desktop devices
- **Responsive Design**: Works on smartphones, tablets, and computers

### **New Advanced Features**
- **📱 Phone Camera Integration**: Connect your phone's camera to the desktop app via QR code for superior image quality
- **📁 Image Upload Support**: Upload images from your device for component analysis
- **🎯 Drag & Drop Interface**: Simply drag images onto the app to start analysis
- **✨ Modern Component Cards**: Beautiful, animated cards with confidence indicators and structured information
- **🔄 Smart Error Handling**: Helpful error messages with actionable tips for unknown components
- **❌ Close Functionality**: Dismiss component cards with a single click
- **📊 Confidence Scoring**: Visual indicators showing detection confidence levels
- **🎨 Glassmorphic UI**: Modern, professional interface with smooth animations

## Tech Stack

### **Frontend Technologies**
- **Core**: HTML5, CSS3, ES6+ JavaScript
- **PWA**: Service Workers, Manifest.json, Offline Caching
- **AI Integration**: Puter.js for AI-powered explanations
- **Real-time Communication**: WebSocket for phone camera streaming
- **UI Components**: Modular ES6 classes with modern animations

### **Backend Technologies**
- **Server**: Node.js, Express.js
- **Machine Learning**: TensorFlow.js with custom Keras model conversion
- **Real-time Features**: WebSocket server for device communication
- **File Processing**: Multer for image uploads, QR code generation
- **Model Format**: TensorFlow.js (model.json, weights.bin, metadata.json)

### **Development & Deployment**
- **Package Management**: npm with postinstall scripts
- **Build Process**: Automated model conversion from H5 to TFJS
- **Deployment**: Render with health checks and environment variables
- **Version Control**: Git with render.yaml blueprint

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Python (for `tensorflowjs_converter` during build)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/repair-iq.git
    cd repair-iq
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # This will also install backend dependencies via the postinstall script
    ```

3.  **Ensure Model is Present:**
    Make sure your trained model file `hardware_model.h5` is located in the `backend/` directory.

### Running Locally

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command runs `node backend/main.js`. The backend serves both the API and the frontend files.

2.  **Access the App:**
    Open your browser and navigate to `http://localhost:3000`.

    *Note: For camera access on mobile devices, you must use HTTPS or `localhost`. To test on a mobile device on the same network, you may need a local tunnel (like ngrok).*

## Deployment (Render)

This project is configured for easy deployment on [Render](https://render.com).

1.  **Push to GitHub/GitLab.**
2.  **Create a New Web Service** on Render connected to your repository.
3.  **Configuration:**
    -   **Environment**: Node
    -   **Build Command**: `npm install && cd backend && npm install && pip install tensorflowjs && python -m tensorflowjs_converter --input_format keras hardware_model.h5 tfjs_model`
    -   **Start Command**: `node backend/main.js`
    
    *Alternatively, you can use the `render.yaml` Blueprint if you connect your account.*

## API Endpoints

### `POST /predict`
- **Description**: Accepts an image file and returns the predicted hardware component
- **Body**: `multipart/form-data` with a file field named `image`
- **Response**:
```json
{
  "component": "RAM Module",
  "confidence": 0.95
}
```

### `GET /phone-camera`
- **Description**: Generates QR code and connection details for phone camera integration
- **Response**:
```json
{
  "phoneUrl": "https://your-app.com/phone-camera.html",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "instructions": [
    "1. Scan this QR code with your phone",
    "2. Open the link in your phone browser",
    "3. Allow camera access on your phone",
    "4. Your phone camera will appear in the desktop app"
  ]
}
```

### `GET /phone-camera.html`
- **Description**: Dedicated mobile interface for phone camera streaming
- **Features**: Real-time video streaming, connection status, camera controls

### `GET /health`
- **Description**: Health check endpoint for monitoring and deployment
- **Response**:
```json
{
  "status": "ok",
  "modelLoaded": true,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production",
  "uptime": 3600
}
```

## Project Structure

```
├── backend/
│   ├── main.js                    # Express Server & Model Logic
│   ├── hardware_model.h5           # Trained Keras Model
│   ├── package.json               # Backend Dependencies
│   └── tfjs_model/               # Converted Model (Autogenerated)
│       ├── model.json            # TFJS Model Architecture
│       ├── weights.bin           # Model Weights
│       └── metadata.json         # Model Metadata
├── public/
│   ├── index.html                # Main Entry Point
│   ├── css/                     # Styles
│   │   └── style.css           # Main Stylesheet with Responsive Design
│   ├── icons/                   # PWA Icons
│   └── manifest.json            # PWA Manifest
├── src/
│   ├── App.js                   # Main Application Logic
│   ├── index.js                 # Entry Point
│   ├── components/              # UI Components
│   │   ├── CameraScanner.js     # Camera Management
│   │   ├── ComponentCard.js    # Result Display Cards
│   │   ├── VoicePlayer.js      # Text-to-Speech
│   │   ├── AROverlay.js        # AR Overlay System
│   │   ├── PhoneCameraConnector.js # Phone Camera Integration
│   │   └── ImageUploader.js    # Image Upload & Drag-Drop
│   └── ai/                     # AI Prompts & Logic
│       └── prompts.js          # AI Prompt Templates
├── serviceWorker.js               # Offline Caching Strategy
├── render.yaml                   # Render Deployment Config
└── package.json                  # Root Config & Scripts
```

## Usage Guide

### **Basic Scanning**
1. Open the app in your browser
2. Allow camera access when prompted
3. Point camera at hardware component
4. Click **SCAN** button to analyze
5. View results in component card

### **Phone Camera Mode**
1. Click the **PHONE** button (purple)
2. Scan QR code with your phone
3. Open link in phone browser
4. Allow camera access on phone
5. Phone feed appears on desktop automatically

### **Image Upload**
1. Click **UPLOAD** button (cyan) to select file
2. Or drag & drop image onto the app
3. Image preview appears with confirmation
4. Automatic analysis begins
5. Results display in component card

### **Component Cards**
- **Confidence Indicators**: Green (80%+), Yellow (60-79%), Red (<60%)
- **Close Button**: Click ✕ to dismiss card
- **Action Buttons**: Learn More, Share, Rescan options
- **Unknown Components**: Helpful tips and retry suggestions

### **Mobile Optimization**
- **Responsive Design**: Adapts to all screen sizes
- **Touch Controls**: Optimized button sizes and spacing
- **Gesture Support**: Drag & drop works on mobile devices
- **Performance**: Smooth animations and transitions

## Troubleshooting

### **Common Issues**

#### **Camera Not Working**
- **Check Permissions**: Ensure camera access is allowed in browser settings
- **HTTPS Required**: Camera access requires HTTPS on most browsers
- **Try Different Browser**: Chrome/Edge generally have better camera support
- **Restart Browser**: Clear cache and restart if issues persist

#### **Phone Camera Not Connecting**
- **Same Network**: Ensure phone and desktop are on same WiFi network
- **Check QR Code**: Make sure QR code is scanned correctly
- **Browser Permissions**: Allow camera access on phone browser
- **WebSocket Issues**: Check firewall settings blocking WebSocket connections

#### **Image Upload Failing**
- **File Size**: Ensure image is under 10MB
- **File Format**: Only image files are accepted (JPG, PNG, etc.)
- **Browser Support**: Try modern browser for drag & drop functionality
- **Clear Cache**: Refresh page if upload seems stuck

#### **Poor Detection Results**
- **Lighting**: Ensure good, even lighting on component
- **Camera Focus**: Keep camera steady and close to component
- **Clean Surface**: Wipe component surface if dirty or dusty
- **Multiple Angles**: Try different perspectives for better results

#### **Performance Issues**
- **Close Tabs**: Reduce browser load for better performance
- **Update Browser**: Use latest browser version for best compatibility
- **Device Specs**: Ensure device meets minimum requirements
- **Network Speed**: Stable connection needed for AI processing

### **Development Debugging**

#### **Backend Issues**
```bash
# Check server logs
npm start

# Verify model loading
curl http://localhost:3000/health

# Test prediction endpoint
curl -X POST -F "image=@test.jpg" http://localhost:3000/predict
```

#### **Frontend Issues**
```javascript
// Check browser console for errors
// Verify service worker registration
// Test camera access manually
navigator.mediaDevices.getUserMedia({ video: true })
```

#### **Model Issues**
- **Verify Conversion**: Ensure H5 model converts to TFJS successfully
- **Check Classes**: Confirm hardware classes match training data
- **Test Predictions**: Use known images to validate model output

## Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### **Development Guidelines**
- **Follow Code Style**: Maintain consistent ES6+ patterns
- **Test Features**: Ensure mobile responsiveness and accessibility
- **Update Documentation**: Keep README current with new features
- **Component Structure**: Use modular ES6 classes for new features
- **Performance**: Optimize for real-time processing and smooth animations

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🚀 What's Next?

### **Planned Features**
- **🔍 Enhanced Detection**: Support for more component types
- **📚 Learning Mode**: Interactive tutorials for identified components
- **🌐 Multi-language Support**: Internationalization for users
- **📊 Analytics Dashboard**: Usage statistics and learning progress
- **🔧 Component Database**: Searchable hardware reference library
- **🤝 Community Features**: Share findings and troubleshooting tips

### **Technical Improvements**
- **⚡ Performance**: Faster model inference and UI responsiveness
- **🔒 Security**: Enhanced authentication and data protection
- **📱 Native Apps**: React Native and iOS companion apps
- **☁️ Cloud Storage**: Save and sync component scans across devices
- **🎯 Accuracy**: Continuous model training and improvement

**RepairIQ** is continuously evolving to provide the best hardware learning experience. Join us in building the future of technical education!
