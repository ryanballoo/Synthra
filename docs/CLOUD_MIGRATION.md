# Cloud Migration Guide

## Current Local Implementation
The application currently runs ML detection locally using TensorFlow.js. Key components:
1. `productAnalysis.js` - Local ML implementation
2. `ProductScanner.jsx` - UI and camera handling

## Migration Steps to Alibaba Cloud

### 1. Update productAnalysis.js
```javascript
export class ProductAnalyzer {
  constructor() {
    this.isCloud = true;
    this.endpoint = process.env.REACT_APP_ALIBABA_API_ENDPOINT;
  }

  async initialize() {
    // No local model initialization needed
    return true;
  }

  async analyzeImage(imageElement) {
    // Convert video frame to blob
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.videoWidth;
    canvas.height = imageElement.videoHeight;
    canvas.getContext('2d').drawImage(imageElement, 0, 0);
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const formData = new FormData();
    formData.append('image', blob);

    // Send to Alibaba Cloud endpoint
    const response = await fetch(`${this.endpoint}/analyze`, {
      method: 'POST',
      body: formData
    });

    return response.json();
  }
}
```

### 2. ECS Backend Setup
```python
from fastapi import FastAPI, File, UploadFile
from aliyunsdkcore.client import AcsClient
import oss2

app = FastAPI()

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    # 1. Upload to OSS
    image_url = upload_to_oss(image)
    
    # 2. Call PAI for inference
    results = call_pai_inference(image_url)
    
    # 3. Return results in same format as local
    return {
        "products": results,
        "timestamp": datetime.now().isoformat(),
        "source": "alibaba-cloud"
    }
```

### 3. Environment Variables
```plaintext
# Local Development
REACT_APP_ML_MODE=local

# Production
REACT_APP_ML_MODE=cloud
REACT_APP_ALIBABA_API_ENDPOINT=https://your-ecs-instance/api
REACT_APP_OSS_BUCKET=your-bucket
REACT_APP_OSS_ENDPOINT=your-endpoint
```

### 4. Migration Testing Checklist
- [ ] Test local implementation works
- [ ] Set up ECS instance
- [ ] Configure OSS bucket
- [ ] Deploy backend to ECS
- [ ] Update environment variables
- [ ] Test cloud implementation
- [ ] Monitor performance
