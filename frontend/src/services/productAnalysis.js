// Local implementation that will later be moved to cloud
export class ProductAnalyzer {
  constructor() {
    this.model = null;
    this.isLocal = true;
  }

  async initialize() {
    if (this.model) return;
    
    try {
      const tf = await import('@tensorflow/tfjs');
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      
      // Initialize with MobileNetV2 for better performance and detection
      this.model = await cocoSsd.load({
        base: 'mobilenet_v2',
        modelUrl: undefined,
        version: 2
      });
      
      console.log('Local ML model loaded successfully');
    } catch (err) {
      console.error('Failed to load local ML model:', err);
      throw err;
    }
  }

  async analyzeImage(imageElement) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    try {
      // Get predictions with lower threshold for better detection
      const predictions = await this.model.detect(imageElement, 20, 0.2);
      return this.formatPredictions(predictions);
    } catch (err) {
      console.error('Local analysis failed:', err);
      throw err;
    }
  }

  formatPredictions(predictions) {
    // Filter and format predictions
    const validPredictions = predictions
      .filter(pred => pred.score > 0.3) // Lower threshold for detection
      .map(pred => ({
        name: pred.class,
        confidence: pred.score,
        boundingBox: pred.bbox,
      }))
      .sort((a, b) => b.confidence - a.confidence); // Sort by confidence

    // Log detections for debugging
    if (validPredictions.length > 0) {
      console.log('Detected objects:', validPredictions.map(p => 
        `${p.name} (${Math.round(p.confidence * 100)}%)`
      ));
    }

    return {
      products: validPredictions,
      timestamp: new Date().toISOString(),
      source: 'local-ml'
    };
  }
}

// Singleton instance
export const productAnalyzer = new ProductAnalyzer();
