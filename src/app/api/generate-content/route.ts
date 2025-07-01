import { NextRequest, NextResponse } from "next/server";
import { falInstance } from "@/lib/falClient";
import { FluxVideoResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      prompt,
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
      // Generate image using flux-lora with LoRA
      let result;
      try {
        result = await falInstance.run("fal-ai/flux-lora", {
          input: {
            prompt: prompt,
            num_inference_steps: steps || 20,
            guidance_scale: guidanceScale || 7.5,
            image_size: { width: width || 512, height: height || 512 },
            seed: seed === -1 ? undefined : seed,
            loras: [
              {
                path: loraId, // This should be a public URL to your LoRA weights
                scale: 0.8,
              },
            ],
            num_images: 1,
          },
        });
        console.log("Fal image generation result:", JSON.stringify(result));
      } catch (falError) {
        console.error("Fal image generation error:", falError);
        return NextResponse.json(
          {
            error: "Fal.ai image generation failed.",
            details: falError instanceof Error ? falError.message : falError,
          },
          { status: 500 }
        );
      }

      const falData = result.data;

      if (!falData || !Array.isArray(falData.images) || !falData.images[0]) {
        console.error(
          "Fal.ai returned no images or invalid image array:",
          result
        );
        return NextResponse.json(
          {
            error: "Fal.ai did not return a valid image.",
            details: result,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        type: "image",
        images: falData.images,
        seed: falData.seed,
        prompt: prompt,
      });
    } else if (type === "video") {
      // Generate video using flux-lora with LoRA
      const result = (await falInstance.run("fal-ai/flux-lora", {
        input: {
          prompt: prompt,
          num_inference_steps: steps || 20,
          guidance_scale: guidanceScale || 7.5,
          image_size: { width: width || 512, height: height || 512 },
          seed: seed === -1 ? undefined : seed,
          loras: [
            {
              path: loraId, // This should be a public URL to your LoRA weights
              scale: 0.8,
            },
          ],
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
