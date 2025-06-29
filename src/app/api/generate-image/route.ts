import { NextRequest, NextResponse } from "next/server";
import { falInstance } from "@/lib/fal-config";

interface FluxResult {
  images: string[];
  seed: number;
  requestId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await falInstance.run('fal-ai/flux-1-dev', {
      input: {
        prompt: prompt,
        negative_prompt: "blurry, low quality, distorted, deformed",
        num_inference_steps: 20,
        guidance_scale: 7.5,
        width: 512,
        height: 512,
        num_images: 1
      }
    }) as unknown as FluxResult;

    return NextResponse.json({
      success: true,
      data: {
        images: result.images || [],
        seed: result.seed
      },
      requestId: result.requestId
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
} 