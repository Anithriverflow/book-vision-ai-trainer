# Book Vision AI (powered by Fal.ai)

- **Core Functionality**: Train custom LoRA models on book-specific artwork and characters, then generate consistent images and videos using those trained models
- **Fal.Ai**: Leverages `fal-ai/flux-lora-fast-training` for model fine-tuning and `fal-ai/flux-lora` for content generation.

---

## 📸 Application Screenshots

![Data Upload Interface](https://github.com/user-attachments/assets/b95d7e48-75c4-4ad5-8af1-9f305da6750e)

![Training Progress Dashboard](https://github.com/user-attachments/assets/6cdcfcc2-b268-4713-9b37-43f74c4f47d8)

![Content Generation Results](https://github.com/user-attachments/assets/3643c319-cdfb-4787-a119-91bd73350494)

![Model Training Interface](https://github.com/user-attachments/assets/554d3c1c-2fae-4aa6-8264-87103acf8ce9)

![Generated Content Display](https://github.com/user-attachments/assets/e4829c87-24c6-4ca3-b0f0-51377d7890a9)
## Project Overview

**Book Vision AI** Create your own AI model trained on your favorite book artwork! Upload 10-20 of your favorite character illustrations, scene depictions, and artwork from books. Train a custom LoRA model, then generate unlimited images of characters, scenes, and settings from your favorite stories!

## What It Does

This application enables users to:

1. **Train Custom LoRA Models** on book-specific artwork and characters
2. **Generate Images & Videos** using trained models with consistent style
3. **Create Personalized Content** that captures the essence of favorite books

### Key Features:
- **Data Preparation**: Upload 10-20 images with detailed descriptions
- **Model Training**: Fast LoRA fine-tuning with configurable parameters
- **Content Generation**: High-quality image and video generation

## How It Works

### 1. Data Preparation Phase
```
User Uploads → Image Processing → Description Templates → Training Dataset
```
- Users upload character/scene images from their favorite books
- Add detailed descriptions using template system
- Images are processed and prepared for LoRA training

### 2. Model Training Phase
```
Training Data → Fal AI Queue → LoRA Training → Client Storage
```
- Uses `fal-ai/flux-lora-fast-training` for efficient model creation
- Configurable parameters: epochs, learning rate, batch size, resolution
- Real-time progress tracking via Fal AI's queue system
- Automatic model metadata storage in client localStorage

### 3. Content Generation Phase
```
Trained Model + Prompt → Fal AI Inference → Generated Content
```
- Uses `fal-ai/flux-lora` for image and video generation
- Integrates trained LoRA weights for consistent style
- Supports both image and video generation
- Customizable generation parameters

## 🔧 Fal AI Integration

### Core Fal AI Services Used:

#### 1. **Flux LoRA Fast Training** (`fal-ai/flux-lora-fast-training`)
```typescript
// Training configuration
const trainingInput = {
  images_data_url: uploadedZipUrl,
  steps: epochs * imageCount,
  create_masks: true,
  is_style: false
};

const result = await falInstance.queue.submit(
  "fal-ai/flux-lora-fast-training",
  { input: trainingInput }
);
```

#### 2. **Flux LoRA Generation** (`fal-ai/flux-lora`)
```typescript
// Image generation with LoRA integration
const result = await falInstance.run("fal-ai/flux-lora", {
  input: {
    prompt: userPrompt,
    num_inference_steps: steps,
    guidance_scale: guidanceScale,
    image_size: { width, height },
    loras: [{ path: loraId, scale: 0.8 }],
    num_images: 1
  }
});
```

## 🏗️ Technical Architecture

### Frontend (Next.js 15 + React 19)
- **Modern UI**: Tailwind CSS with gradient backgrounds
- **Real-time Updates**: Live training progress and status
- **Persistent State**: Client-side localStorage for all data
- **Responsive Design**: Mobile-friendly interface

### Backend (Next.js API Routes)
- **Training API**: `/api/train-model` - Handles LoRA training
- **Generation API**: `/api/generate-content` - Handles content creation
- **Status API**: `/api/training-status` - Real-time training updates
