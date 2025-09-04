import React, { useRef, useState } from 'react';

const ProductScanner = ({ onProductScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsScanning(true);
    } catch (err) {
      console.error('Camera access error:', err);
    }
  };

  const captureProduct = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    
    // Stop camera
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    setIsScanning(false);

    // Notify parent with mock product data for demo
    onProductScanned({
      name: "Demo Product",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      category: "Demo Category"
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4">📷 Scan Product</h3>
      
      {!isScanning && !capturedImage && (
        <button 
          onClick={startScanning}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Camera
        </button>
      )}

      {isScanning && (
        <div className="space-y-4">
          <video 
            ref={videoRef} 
            autoPlay 
            className="w-full max-w-md rounded"
          />
          <button 
            onClick={captureProduct}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Capture Product
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ProductScanner;
