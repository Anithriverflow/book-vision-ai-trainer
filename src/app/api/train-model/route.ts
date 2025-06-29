import { NextRequest, NextResponse } from 'next/server';
import { falInstance } from '@/lib/fal-config';
import { ServerStorage, TrainedModel } from '@/lib/storage';

interface FluxLoraTrainingResult {
  model_id: string;
  lora_id: string;
  status: string;
}

// Define the training input interface based on fal.ai API
interface FluxLoraTrainingInput {
  images_data_url: string;
  training_config: {
    epochs: number;
    learning_rate: number;
    batch_size: number;
    resolution: number;
    save_every: number;
    mixed_precision: string;
    gradient_accumulation_steps: number;
    lora_rank: number;
    lora_alpha: number;
    lora_dropout: number;
    warmup_steps: number;
    scheduler: string;
    optimizer: string;
    weight_decay: number;
    max_grad_norm: number;
    seed: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Initialize storage
    ServerStorage.initialize();
    
    const formData = await request.formData();
    
    const modelName = formData.get('model_name') as string;
    const epochs = parseInt(formData.get('epochs') as string);
    const learningRate = parseFloat(formData.get('learning_rate') as string);
    const batchSize = parseInt(formData.get('batch_size') as string);
    const resolution = parseInt(formData.get('resolution') as string);
    const imageCount = parseInt(formData.get('image_count') as string);

    if (!modelName || !epochs || !learningRate || !batchSize || !resolution || !imageCount) {
      return NextResponse.json(
        { error: 'Missing required training parameters' },
        { status: 400 }
      );
    }

    // Prepare training data
    const trainingData = [];
    for (let i = 0; i < imageCount; i++) {
      const image = formData.get(`image_${i}`) as File;
      const description = formData.get(`description_${i}`) as string;
      
      if (image && description) {
        // Convert image to base64 for fal.ai
        const arrayBuffer = await image.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        trainingData.push({
          image: `data:${image.type};base64,${base64}`,
          caption: description
        });
      }
    }

    if (trainingData.length < 10) {
      return NextResponse.json(
        { error: 'At least 10 images with descriptions are required' },
        { status: 400 }
      );
    }

    // Create a data URL containing all training data
    const trainingDataJson = JSON.stringify(trainingData);
    const trainingDataBlob = new Blob([trainingDataJson], { type: 'application/json' });
    const trainingDataUrl = URL.createObjectURL(trainingDataBlob);

    // Start LoRA training
    const trainingInput: FluxLoraTrainingInput = {
      images_data_url: trainingDataUrl,
      training_config: {
        epochs: epochs,
        learning_rate: learningRate,
        batch_size: batchSize,
        resolution: resolution,
        save_every: Math.max(1, Math.floor(epochs / 10)), // Save every 10% of epochs
        mixed_precision: "fp16",
        gradient_accumulation_steps: 1,
        lora_rank: 16,
        lora_alpha: 32,
        lora_dropout: 0.1,
        warmup_steps: Math.floor(epochs * trainingData.length * 0.1),
        scheduler: "cosine",
        optimizer: "adamw",
        weight_decay: 0.01,
        max_grad_norm: 1.0,
        seed: 42
      }
    };

    const result = (await falInstance.run('fal-ai/flux-lora-fast-training', {
      input: trainingInput
    })) as unknown as FluxLoraTrainingResult;

    // Create trained model object
    const trainedModel: TrainedModel = {
      modelName: modelName,
      modelId: result.model_id,
      loraId: result.lora_id,
      trainingConfig: {
        epochs,
        learningRate,
        batchSize,
        resolution,
        imageCount: trainingData.length
      },
      status: 'completed',
      createdAt: new Date().toISOString(),
      trainingData: [] // We don't store the actual training data here to save space
    };

    // Save model metadata to persistent storage
    ServerStorage.saveModelMetadata(trainedModel);

    // Return training result with model information
    return NextResponse.json({
      success: true,
      modelName: modelName,
      modelId: result.model_id,
      loraId: result.lora_id,
      trainingConfig: {
        epochs,
        learningRate,
        batchSize,
        resolution,
        imageCount: trainingData.length
      },
      status: 'completed',
      message: 'LoRA training completed successfully'
    });

  } catch (error) {
    console.error('Training error:', error);
    return NextResponse.json(
      { error: 'Training failed. Please try again.' },
      { status: 500 }
    );
  }
} 