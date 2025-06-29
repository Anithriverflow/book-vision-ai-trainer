import { NextRequest, NextResponse } from "next/server";
import { falInstance } from "@/lib/fal-config";

interface FluxImageResult {
  images: string[];
  seed: number;
}

interface FluxVideoResult {
  video: {
    url: string;
    duration: number;
    fps: number;
  };
  seed: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      prompt,
      negativePrompt,
      steps,
      guidanceScale,
      width,
      height,
      seed,
      type,
      modelId,
      loraId,
    } = body;

    if (!prompt || !type || !modelId || !loraId) {
      return NextResponse.json(
        { error: "Missing required generation parameters" },
        { status: 400 }
      );
    }

    if (type === "image") {
      // Generate image using flux-1-dev with LoRA
      const result = (await falInstance.run("fal-ai/flux-1-dev", {
        input: {
          prompt: prompt,
          negative_prompt:
            negativePrompt || "blurry, low quality, distorted, deformed",
          num_inference_steps: steps || 20,
          guidance_scale: guidanceScale || 7.5,
          width: width || 512,
          height: height || 512,
          seed: seed === -1 ? undefined : seed,
          lora_weights: loraId,
          lora_scale: 0.8,
          num_images: 1,
        },
      })) as unknown as FluxImageResult;

      return NextResponse.json({
        success: true,
        type: "image",
        images: result.images || [],
        seed: result.seed,
        prompt: prompt,
      });
    } else if (type === "video") {
      // Generate video using flux-1-dev with LoRA
      const result = (await falInstance.run("fal-ai/flux-1-dev", {
        input: {
          prompt: prompt,
          negative_prompt:
            negativePrompt || "blurry, low quality, distorted, deformed",
          num_inference_steps: steps || 20,
          guidance_scale: guidanceScale || 7.5,
          width: width || 512,
          height: height || 512,
          seed: seed === -1 ? undefined : seed,
          lora_weights: loraId,
          lora_scale: 0.8,
          num_frames: 16,
          fps: 8,
        },
      })) as unknown as FluxVideoResult;

      return NextResponse.json({
        success: true,
        type: "video",
        video: {
          url: result.video?.url,
          duration: result.video?.duration || 2,
          fps: result.video?.fps || 8,
        },
        seed: result.seed,
        prompt: prompt,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid content type. Must be "image" or "video"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
