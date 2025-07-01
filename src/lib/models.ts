import { FalModel } from "./types";

export const FAL_MODELS: Record<string, FalModel> = {
  /* FLUX_1_DEV: Used for content generation (images and videos) with trained LoRA models */
  FLUX_1_DEV: {
    name: "Flux LoRA (Inference)",
    endpoint: "fal-ai/flux-1-dev",
    url: "https://fal.ai/models/fal-ai/flux-lora/playground",
    description: "State-of-the-art text-to-image and text-to-video model",
    capabilities: ["Image Generation", "Video Generation", "LoRA Integration"],
    features: [
      "High-quality image generation",
      "Video generation with 16 frames",
      "LoRA weight integration",
      "Customizable parameters",
    ],
  },
  /* FLUX_LORA_FAST_TRAINING: Used for training custom LoRA models on user-uploaded book artwork */
  FLUX_LORA_FAST_TRAINING: {
    name: "Flux LoRA Fast Training",
    endpoint: "fal-ai/flux-lora-fast-training",
    url: "https://fal.ai/models/fal-ai/flux-lora-fast-training/playground",
    description: "Fast LoRA fine-tuning for custom model training",
    capabilities: ["LoRA Training", "Custom Models", "Fast Training"],
    features: [
      "Fast LoRA training",
      "Custom model creation",
      "Optimized for Flux models",
      "Configurable training parameters",
    ],
  },
} as const;

import { FalAiInfo } from "./types";

export const FAL_AI_INFO: FalAiInfo = {
  name: "Fal AI",
  url: "https://fal.ai",
  description: "Real-time AI inference platform",
  tagline: "Powered by Fal AI",
} as const;
