export const FAL_MODELS = {
  FLUX_1_DEV: {
    name: "Flux 1 Dev",
    endpoint: "fal-ai/flux-1-dev",
    url: "https://fal.ai/models/flux-1-dev",
    description: "State-of-the-art text-to-image and text-to-video model",
    capabilities: ["Image Generation", "Video Generation", "LoRA Integration"],
    features: [
      "High-quality image generation",
      "Video generation with 16 frames",
      "LoRA weight integration",
      "Customizable parameters",
    ],
  },
  FLUX_LORA_FAST_TRAINING: {
    name: "Flux LoRA Fast Training",
    endpoint: "fal-ai/flux-lora-fast-training",
    url: "https://fal.ai/models/flux-lora-fast-training",
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

export const FAL_AI_INFO = {
  name: "Fal AI",
  url: "https://fal.ai",
  description: "Real-time AI inference platform",
  tagline: "Powered by Fal AI",
} as const;

export function getModelInfo(endpoint: string) {
  return Object.values(FAL_MODELS).find((model) => model.endpoint === endpoint);
}

export function getModelDisplayName(endpoint: string): string {
  const model = getModelInfo(endpoint);
  return model ? model.name : endpoint;
}
