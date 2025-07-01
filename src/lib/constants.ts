// Consolidated constants for the entire application
import { BookOpen, Brain, Image as ImageIcon } from "lucide-react";
import { FalModel, FalAiInfo, TabType } from "./types";

// ============================================================================
// APP-LEVEL CONSTANTS
// ============================================================================

// Tab configurations
export const TAB_CONFIGS = [
  {
    id: "data" as TabType,
    label: "Prepare Data",
    icon: BookOpen,
    description: "Upload images and add descriptions",
  },
  {
    id: "training" as TabType,
    label: "Train Model",
    icon: Brain,
    description: "Train your LoRA model",
  },
  {
    id: "generation" as TabType,
    label: "Generate",
    icon: ImageIcon,
    description: "Create images and videos",
  },
];

// App metadata
export const APP_METADATA = {
  name: "Book Vision AI",
  description:
    "Create your own AI model trained on your favorite book artwork!",
  tagline:
    "Train a custom LoRA model, then generate unlimited images of characters, scenes, and settings from your favorite stories!",
  logo: "/5446441-200.png",
};

// External links
export const EXTERNAL_LINKS = {
  fluxLoraInference: "https://fal.ai/models/fal-ai/flux-lora/playground",
  fluxLoraTraining:
    "https://fal.ai/models/fal-ai/flux-lora-fast-training/playground",
  falAi: "https://fal.ai",
};

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI_CONSTANTS = {
  maxWidth: "max-w-6xl",
  defaultPadding: "p-8",
  defaultSpacing: "space-y-8",
  loadingSpinnerSize: 12,
  loadingMessage: "Loading your data...",
  headerGradient: "bg-gradient-to-b from-gray-900 to-gray-800",
  mainGradient: "main-gradient-bg",
  borderColor: "border-gray-700",
  textColors: {
    primary: "text-white",
    secondary: "text-gray-300",
    tertiary: "text-gray-400",
    accent: "text-blue-400",
    success: "text-green-400",
    warning: "text-purple-400",
  },
  // Component-specific UI constants
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  UPLOAD_BUTTON_TEXT: "Upload Images",
  UPLOADING_TEXT: "Uploading...",
  SUPPORTED_FORMATS: "JPG, PNG, WebP (Max 10MB per image)",
  PROGRESS_BAR_HEIGHT: "h-2",
  SPINNER_SIZE: 12,
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_MODEL_NAME_LENGTH: 3,
  MAX_MODEL_NAME_LENGTH: 50,
  MIN_EPOCHS: 1,
  MAX_EPOCHS: 50,
  MIN_LEARNING_RATE: 0.00001,
  MAX_LEARNING_RATE: 0.01,
  MIN_BATCH_SIZE: 1,
  MAX_BATCH_SIZE: 4,
  MIN_RESOLUTION: 256,
  MAX_RESOLUTION: 1024,
  MAX_PROMPT_LENGTH: 1000,
  MIN_PROMPT_LENGTH: 5,
  MAX_NEGATIVE_PROMPT_LENGTH: 500,
};

// ============================================================================
// TRAINING CONSTANTS
// ============================================================================

export const TRAINING_CONSTANTS = {
  POLL_INTERVAL: 5000, // 5 seconds
  MAX_POLL_ATTEMPTS: 360, // 30 minutes
  PROGRESS_UPDATE_INTERVAL: 1000, // 1 second
  ESTIMATED_TIME_PER_EPOCH: 2, // minutes
  MAX_PROGRESS: 95, // Maximum progress percentage
};

// Default configuration values
export const DEFAULT_TRAINING_CONFIG = {
  epochs: 10,
  learningRate: 0.0001,
  batchSize: 1,
  resolution: 512,
};

// ============================================================================
// GENERATION CONSTANTS
// ============================================================================

export const GENERATION_CONSTANTS = {
  MAX_PROMPT_LENGTH: 1000,
  MIN_PROMPT_LENGTH: 5,
  MAX_NEGATIVE_PROMPT_LENGTH: 500,
  DEFAULT_SEED: -1,
  RANDOM_SEED_VALUE: -1,
};

export const DEFAULT_GENERATION_CONFIG = {
  steps: 20,
  guidanceScale: 7.5,
  width: 512,
  height: 512,
  seed: -1,
  loraScale: 0.8,
};

// Sample prompts for image generation
export const SAMPLE_PROMPTS = [
  "A majestic dragon soaring over a medieval castle, fantasy art style",
  "A brave knight in shining armor standing in a mystical forest",
  "A wise wizard casting spells in an ancient library",
  "A beautiful princess in a magical garden with glowing flowers",
  "A fierce warrior riding a mythical creature through the clouds",
  "A mysterious sorcerer in a dark tower surrounded by magical energy",
  "A gentle fairy tending to enchanted plants in a hidden grove",
  "A powerful king sitting on a throne made of crystal and gold",
];

// ============================================================================
// FAL.AI MODEL CONFIGURATIONS
// ============================================================================

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

export const FAL_AI_INFO: FalAiInfo = {
  name: "Fal AI",
  url: "https://fal.ai",
  description: "Real-time AI inference platform",
  tagline: "Powered by Fal AI",
} as const;

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  TRAINING_DATA: "book-vision-training-data",
  TRAINED_MODELS: "book-vision-trained-models",
  GENERATED_CONTENT: "book-vision-generated-content",
  ACTIVE_TAB: "book-vision-active-tab",
  CURRENT_TRAINING: "book-vision-current-training",
} as const;

// ============================================================================
// MESSAGES
// ============================================================================

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "File size exceeds 10MB limit",
  INVALID_FILE_TYPE:
    "Invalid file type. Please upload JPG, PNG, or WebP images",
  DESCRIPTION_TOO_SHORT: "Description must be at least 10 characters long",
  DESCRIPTION_TOO_LONG: "Description must be less than 500 characters",
  MODEL_NAME_TOO_SHORT: "Model name must be at least 3 characters long",
  MODEL_NAME_TOO_LONG: "Model name must be less than 50 characters",
  INVALID_EPOCHS: "Epochs must be between 1 and 50",
  INVALID_LEARNING_RATE: "Learning rate must be between 0.00001 and 0.01",
  INVALID_BATCH_SIZE: "Batch size must be between 1 and 4",
  INVALID_RESOLUTION: "Resolution must be between 256 and 1024",
  PROMPT_TOO_SHORT: "Prompt must be at least 5 characters long",
  PROMPT_TOO_LONG: "Prompt must be less than 1000 characters",
  NEGATIVE_PROMPT_TOO_LONG: "Negative prompt must be less than 500 characters",
};

// Success messages
export const SUCCESS_MESSAGES = {
  TRAINING_STARTED: "Training started successfully!",
  MODEL_IMPORTED: "Model imported successfully!",
  CONTENT_GENERATED: "Content generated successfully!",
  DATA_SAVED: "Data saved successfully!",
};

// Confirmation messages
export const CONFIRMATION_MESSAGES = {
  clearAllData:
    "Are you sure you want to clear all data? This action cannot be undone.",
};

// ============================================================================
// DEFAULT STATES
// ============================================================================

export const DEFAULT_STATES = {
  activeTab: "data" as TabType,
  isLoading: true,
};

// Data summary labels
export const DATA_SUMMARY_LABELS = {
  trainingImages: "Training Images",
  trainedModels: "Trained Models",
  generatedItems: "Generated Items",
};

// Button labels
export const BUTTON_LABELS = {
  clearAllData: "Clear All Data",
  loading: "Loading...",
};

// Layout constants
export const LAYOUT = {
  minHeight: "min-h-screen",
  containerMaxWidth: "max-w-6xl",
  headerPadding: "py-8",
  contentPadding: "p-6",
  roundedCorners: "rounded-lg",
  shadow: "shadow-lg",
};
