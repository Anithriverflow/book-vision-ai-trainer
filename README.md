# Book Visualization AI Trainer

A powerful tool for training AI models on your favorite books and generating stunning visualizations. This application allows you to train LoRA models on book-specific art styles and characters, then generate images and videos that bring your reading to life.

**Powered by [Fal AI](https://fal.ai)** - Real-time AI inference platform

## Features

### 📚 Data Preparation

- Upload 10-20 images of characters, scenes, or art styles from your book
- Add detailed descriptions for optimal LoRA training
- Template-based description system for consistent results
- Progress tracking for data preparation
- Optimized for **fal-ai/flux-lora-fast-training**

### 🧠 Model Training

- Train custom LoRA models using **fal-ai/flux-lora-fast-training**
- Configurable training parameters (epochs, learning rate, batch size, resolution)
- Real-time training progress and estimated completion time
- Automatic model saving and management
- Fast LoRA fine-tuning optimized for Flux models

### 🎨 Content Generation

- Generate images and videos using **fal-ai/flux-1-dev**
- Support for both image and video generation with LoRA integration
- Customizable generation parameters (steps, guidance scale, dimensions)
- Sample prompts for quick testing
- Download generated content directly
- State-of-the-art text-to-image and text-to-video capabilities

## AI Models Used

### Generation Model: Flux 1 Dev

- **Endpoint**: `fal-ai/flux-1-dev`
- **Capabilities**:
  - High-quality image generation
  - Video generation with 16 frames
  - LoRA weight integration
  - Customizable parameters
- **Features**: State-of-the-art text-to-image and text-to-video model

### Training Model: Flux LoRA Fast Training

- **Endpoint**: `fal-ai/flux-lora-fast-training`
- **Capabilities**:
  - Fast LoRA training
  - Custom model creation
  - Optimized for Flux models
  - Configurable training parameters
- **Features**: Fast LoRA fine-tuning for custom model training

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI Services**: [Fal AI](https://fal.ai) (Flux LoRA training and generation)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom utilities

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. [Fal AI](https://fal.ai) API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fal-demo
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
FAL_API_KEY=your_fal_ai_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Step 1: Prepare Your Data

1. Navigate to the "Prepare Data" tab
2. Upload 10-20 images related to your book (characters, scenes, art styles)
3. Add detailed descriptions for each image using the provided template:
   - **Character**: Describe appearance, clothing, expressions, pose
   - **Scene**: Describe setting, lighting, atmosphere, background
   - **Style**: Describe art style, color palette, mood, artistic technique

### Step 2: Train Your Model

1. Go to the "Train Model" tab
2. Configure training parameters:
   - Model name (e.g., "three-body-problem-style")
   - Epochs (recommended: 100-200)
   - Learning rate (default: 0.0001)
   - Batch size (1-4)
   - Resolution (512x512, 768x768, or 1024x1024)
3. Click "Start Training" and wait for completion

### Step 3: Generate Content

1. Switch to the "Generate" tab
2. Choose between image or video generation
3. Enter your prompt describing the scene or character
4. Adjust generation parameters as needed
5. Click "Generate" and download your results

## API Endpoints

### `/api/train-model`

- **Method**: POST
- **Purpose**: Train a LoRA model using uploaded images and descriptions
- **Model**: `fal-ai/flux-lora-fast-training`
- **Input**: FormData with images, descriptions, and training parameters

### `/api/generate-content`

- **Method**: POST
- **Purpose**: Generate images or videos using trained LoRA models
- **Model**: `fal-ai/flux-1-dev`
- **Input**: JSON with generation parameters and model information

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── train-model/
│   │   │   └── route.ts
│   │   └── generate-content/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── DataPreparation.tsx
│   ├── ModelTraining.tsx
│   ├── ImageGeneration.tsx
│   └── ModelInfo.tsx
└── lib/
    ├── fal-config.ts
    ├── models.ts
    └── utils.ts
```

## Best Practices

### For Optimal Training Results

1. **Image Quality**: Use high-quality images (512x512 minimum)
2. **Diversity**: Include various angles, expressions, and scenes
3. **Descriptions**: Be detailed and consistent in your descriptions
4. **Style Consistency**: Use images with similar art styles for better results
5. **Model Optimization**: Leverage Flux LoRA Fast Training for efficient model creation

### For Better Generation

1. **Prompts**: Be specific about characters, scenes, and styles
2. **Negative Prompts**: Use to avoid unwanted elements
3. **Parameters**: Experiment with different settings for best results
4. **Seeds**: Use consistent seeds for reproducible results
5. **LoRA Integration**: Utilize trained LoRA weights for consistent style

## Troubleshooting

### Common Issues

1. **Training Fails**: Ensure you have at least 10 images with complete descriptions
2. **Generation Errors**: Check that your model training completed successfully
3. **API Errors**: Verify your FAL_API_KEY is set correctly
4. **Model Issues**: Ensure compatibility with Flux models

### Performance Tips

1. Use smaller batch sizes for faster training
2. Lower resolution for quicker generation
3. Reduce steps for faster image generation
4. Leverage Fal AI's optimized infrastructure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review [Fal AI documentation](https://fal.ai/docs)
3. Open an issue on GitHub

## Acknowledgments

- **Fal AI** for providing the Flux models and real-time inference platform
- **Flux 1 Dev** for state-of-the-art image and video generation
- **Flux LoRA Fast Training** for efficient custom model training
