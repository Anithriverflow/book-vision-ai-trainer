import { NextRequest, NextResponse } from "next/server";
import { falInstance } from "@/lib/falClient";
import JSZip from "jszip";
import { FluxLoraTrainingInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const modelName = formData.get("model_name") as string;
    const epochs = parseInt(formData.get("epochs") as string);
    const learningRate = parseFloat(formData.get("learning_rate") as string);
    const batchSize = parseInt(formData.get("batch_size") as string);
    const resolution = parseInt(formData.get("resolution") as string);
    const imageCount = parseInt(formData.get("image_count") as string);

    if (
      !modelName ||
      !epochs ||
      !learningRate ||
      !batchSize ||
      !resolution ||
      !imageCount
    ) {
      return NextResponse.json(
        { error: "Missing required training parameters" },
        { status: 400 }
      );
    }

    // Create a zip archive of images and captions
    const zip = new JSZip();
    for (let i = 0; i < imageCount; i++) {
      const imageUrl = formData.get(`image_url_${i}`) as string;
      const description = formData.get(`description_${i}`) as string;
      if (imageUrl && description) {
        const match = imageUrl.match(/^data:(.+);base64,(.+)$/);
        if (!match) {
          return NextResponse.json(
            { error: `Invalid data URL format for image ${i}` },
            { status: 400 }
          );
        }
        const mimeType = match[1];
        const ext = mimeType.split("/")[1] || "png";
        const imageBuffer = Buffer.from(match[2], "base64");
        zip.file(`image${i}.${ext}`, imageBuffer);
        zip.file(`image${i}.txt`, description);
      }
    }
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Upload the zip to fal storage using the configured instance
    const blob = new Blob([zipBuffer], { type: "application/zip" });
    const images_data_url = await falInstance.storage.upload(blob);

    // Start LoRA training using the queue system
    const trainingInput: FluxLoraTrainingInput = {
      images_data_url,
      steps: epochs * imageCount, // Convert epochs to steps
      create_masks: true,
      is_style: false, // We're training for subject, not style
    };

    const result = await falInstance.queue.submit(
      "fal-ai/flux-lora-fast-training",
      {
        input: trainingInput,
      }
    );

    // Return training result with model information for client to store
    return NextResponse.json({
      success: true,
      modelName: modelName,
      modelId: result.request_id, // Use request_id as modelId for now
      loraId: result.request_id, // Use request_id as loraId for now
      requestId: result.request_id,
      trainingConfig: {
        epochs,
        learningRate,
        batchSize,
        resolution,
        imageCount,
      },
      status: "training", // Return training status
      message: "LoRA training started successfully",
    });
  } catch (error) {
    console.error("Training error:", error);
    return NextResponse.json(
      { error: "Training failed. Please try again." },
      { status: 500 }
    );
  }
}
