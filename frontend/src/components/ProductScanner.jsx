import React, { useRef, useState, useEffect } from 'react';
import { productAnalyzer } from '../services/productAnalysis';

const ProductScanner = ({ onProductScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const detectionRef = useRef(null);
  const isModelInitialized = useRef(false);

  // Start scanning automatically when component mounts
  // Initialize product analyzer
  useEffect(() => {
    let mounted = true;
    
    const initialize = async () => {
      try {
        // First initialize the ML model
        setError('Initializing detection model...');
        await productAnalyzer.initialize();
        if (!mounted) return;
        
        isModelInitialized.current = true;
        setError('Initializing camera...');
        
        // Then initialize the camera
        await startScanning();
        if (!mounted) return;
        
        setError('Scanning... Position object in the green box');
      } catch (err) {
        console.error('Initialization failed:', err);
        if (mounted) {
          setError(`Failed to initialize: ${err.message}. Please refresh the page.`);
        }
      }
    };
    
    initialize();
    
    return () => {
      mounted = false;
      stopCamera();
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
      }
    };
  }, []);

  // Start object detection when video is ready and scanning
  useEffect(() => {
    if (isReady && isScanning && isModelInitialized.current) {
      detectObjects();
    }
  }, [isReady, isScanning]);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setIsReady(false);
    if (detectionRef.current) {
      cancelAnimationFrame(detectionRef.current);
      detectionRef.current = null;
    }
  };

  const startScanning = async () => {
    try {
      setError(null);
      console.log('Requesting camera access...');
      
      const constraints = { 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      console.log('Using constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got media stream:', stream);
      
      if (videoRef.current) {
        console.log('Setting video source...');
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current.play()
            .then(() => {
              console.log('Video playback started');
              setIsScanning(true);
              setIsReady(true);
            })
            .catch(e => {
              console.error('Video playback failed:', e);
              setError('Failed to start video playback');
            });
        };
      } else {
        console.error('Video reference not found');
        setError('Video element not initialized');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(`Unable to access camera: ${err.message}`);
    }
  };

  const handleVideoReady = () => {
    console.log('Video metadata loaded');
    if (overlayRef.current && videoRef.current) {
      overlayRef.current.width = videoRef.current.videoWidth;
      overlayRef.current.height = videoRef.current.videoHeight;
      drawOverlay();
    }
  };

  const detectObjects = async () => {
    if (!videoRef.current || !overlayRef.current || !isScanning || !isModelInitialized.current) {
      // If conditions aren't met, try again in the next frame
      detectionRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    try {
      // Clear any previous error
      setError(null);

      // Analyze current video frame
      const analysis = await productAnalyzer.analyzeImage(videoRef.current);
      
      // Update state with detected objects if component is still mounted
      setDetectedObjects(analysis.products);
      
      // Draw the detections
      drawOverlay(analysis.products);

      // Update error state based on detections
      if (analysis.products.length === 0) {
        setError('Scanning... Position object in the green box');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Detection error:', err);
      setError('Detection temporarily unavailable. Please try again.');
    } finally {
      // Schedule next detection frame
      detectionRef.current = requestAnimationFrame(detectObjects);
    }
  };

  const drawOverlay = (predictions = []) => {
    if (!overlayRef.current || !videoRef.current) return;
    
    const ctx = overlayRef.current.getContext('2d');
    
    // Make sure overlay matches video dimensions
    overlayRef.current.width = videoRef.current.videoWidth;
    overlayRef.current.height = videoRef.current.videoHeight;
    
    const width = overlayRef.current.width;
    const height = overlayRef.current.height;
    
    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);
    
    // Draw scanning area
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    const margin = height * 0.1; // 10% margin
    ctx.beginPath();
    ctx.rect(margin, margin, width - margin * 2, height - margin * 2);
    ctx.stroke();
    
    // Draw corner markers
    const cornerSize = Math.min(width, height) * 0.05; // 5% of smaller dimension
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(margin, margin + cornerSize);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + cornerSize, margin);
    ctx.stroke();

    // Draw detected objects
    predictions.forEach(product => {
      const [x, y, width, height] = product.boundingBox;
      
      // Draw bounding box with animation effect
      ctx.strokeStyle = `rgba(0, 255, 0, ${Math.abs(Math.sin(Date.now() / 500))})`; // Pulsing effect
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw semi-transparent background for label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      const labelText = `${product.name} ${Math.round(product.confidence * 100)}%`;
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(x, y > 30 ? y - 30 : y + height, textWidth + 10, 25);
      
      // Draw label
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(
        labelText,
        x + 5,
        y > 30 ? y - 10 : y + height + 20
      );
      
      // Draw corners for emphasis
      const cornerLength = 20;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cornerLength, y);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cornerLength);
      ctx.stroke();
    });
  };

  const captureProduct = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Only capture if we have valid detections
    if (!detectedObjects || detectedObjects.length === 0) {
      setError('No objects detected. Please ensure the object is clearly visible.');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Set canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Draw the video frame
    ctx.drawImage(video, 0, 0);
    
    // Get the most confident detection
    const mainProduct = detectedObjects.reduce((best, current) => {
      return (current.confidence > (best?.confidence || 0)) ? current : best;
    }, null);
    
    if (!mainProduct || mainProduct.confidence < 0.5) {
      setError('Detection confidence too low. Please try again with better lighting or positioning.');
      return;
    }

    const imageData = canvas.toDataURL('image/jpeg', 0.95); // Higher quality JPEG
    setCapturedImage(imageData);
    
    // Pass the scanned data to parent
    onProductScanned({
      name: mainProduct.name,
      image: imageData,
      features: detectedObjects
        .filter(obj => obj.confidence > 0.5)
        .map(obj => `${obj.name} (${Math.round(obj.confidence * 100)}% confidence)`),
      category: mainProduct.name,
      confidence: mainProduct.confidence,
      allDetections: detectedObjects.filter(obj => obj.confidence > 0.5)
    });
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-t-lg">
            {error}
          </div>
        )}

        {/* Video container */}
        <div className="relative" style={{ minHeight: '400px', backgroundColor: '#000' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleVideoReady}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '70vh',
              objectFit: 'contain'
            }}
          />
          
          <canvas
            ref={overlayRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              width: '100%',
              height: '100%'
            }}
          />

          {/* Loading overlay */}
          {!isReady && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-white text-lg">
                Initializing camera...
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between">
            <button
              onClick={captureProduct}
              disabled={!isReady}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Capture Product
            </button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ProductScanner;
