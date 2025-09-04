import { productAnalyzer } from './productAnalysis';

class MLService {
  async generateContentFromProduct(productData, contentType = 'Text') {
    try {
      // Convert confidence to percentage
      const confidence = Math.round(productData.confidence * 100);
      
      // Create context for the API call
      const context = {
        product: productData.name,
        confidence: confidence,
        features: productData.features || [],
        image: productData.image
      };

      // Call the backend API for content generation
      const response = await fetch('http://127.0.0.1:8000/api/ml/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: this.createPrompt(productData, contentType),
          type: contentType,
          context
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Content generation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('ML Service error:', error);
      throw error;
    }
  }

  createPrompt(productData, contentType) {
    const baseContext = `
Product: ${productData.name}
Detected Features: ${productData.features?.join(', ') || 'None'}
Confidence: ${Math.round(productData.confidence * 100)}%`;

    const templates = {
      'Text': `Create marketing content for the following product:${baseContext}

Generate:
1. A catchy product title
2. A compelling product description
3. Key features and benefits
4. Target audience
5. Marketing angles
6. Call to action suggestions`,

      'Social': `Create social media content for:${baseContext}

Generate:
1. Instagram post copy with hashtags
2. Twitter post with engagement hooks
3. LinkedIn professional announcement
4. Key selling points for social`,

      'Image': `Create professional product imagery for:${baseContext}

Required elements:
1. Professional product photography style
2. Clear focus on key features
3. Marketing-oriented composition
4. Brand-appropriate lighting and mood`
    };

    return templates[contentType] || templates['Text'];
  }

  async generateBatch(productData) {
    // Generate all content types in parallel
    const types = ['Text', 'Social', 'Image'];
    try {
      const results = await Promise.all(
        types.map(type => this.generateContentFromProduct(productData, type))
      );
      
      return types.reduce((acc, type, index) => {
        acc[type.toLowerCase()] = results[index];
        return acc;
      }, {});
    } catch (error) {
      console.error('Batch generation error:', error);
      throw error;
    }
  }
}

export const mlService = new MLService();
