export type TrainingDataItem = {
  id: string;
  image: File;
  imageUrl: string;
  description: string;
};

export type TrainedModel = {
  modelName: string;
  modelId: string;
  loraId: string;
  trainingConfig: {
    epochs: number;
    learningRate: number;
    batchSize: number;
    resolution: number;
    imageCount: number;
  };
  status: string;
  createdAt: string;
  trainingData: TrainingDataItem[];
};

export type GeneratedContent = {
  id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  negativePrompt: string;
  config: {
    steps: number;
    guidanceScale: number;
    width: number;
    height: number;
    seed: number;
  };
  modelId: string;
  createdAt: string;
  filename: string;
};

export type UIState = {
  [key: string]: unknown;
};

export type TabType = "data" | "training" | "generation";

export type TabConfig = {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  description: string;
};

export type AppState = {
  activeTab: TabType;
  trainingData: TrainingDataItem[];
  trainedModels: TrainedModel[];
  generatedContent: GeneratedContent[];
  selectedModel: TrainedModel | null;
  isLoading: boolean;
};

export type AppMetadata = {
  name: string;
  description: string;
  tagline: string;
  logo: string;
};

export type ExternalLink = {
  label: string;
  url: string;
  description?: string;
};

export type DataSummary = {
  trainingImages: number;
  trainedModels: number;
  generatedItems: number;
};

export type LoadingState = {
  isLoading: boolean;
  message?: string;
  progress?: number;
};

export type AppError = {
  message: string;
  code?: string;
  details?: unknown;
};

export type ErrorState = {
  hasError: boolean;
  message: string;
  details?: unknown;
};

export type AppNavigation = {
  currentTab: TabType;
  previousTab?: TabType;
};

export type PersistentData = {
  trainingData: TrainingDataItem[];
  trainedModels: TrainedModel[];
  generatedContent: GeneratedContent[];
  activeTab: TabType;
};

export type AppEventHandlers = {
  setTrainedModel: (model: TrainedModel) => void;
  addGeneratedContent: (content: GeneratedContent) => void;
  removeGeneratedContent: (id: string) => void;
  clearAllData: () => void;
};

export type ComponentState = {
  [key: string]: unknown;
};

export type UIInteraction = {
  type: "click" | "hover" | "focus" | "blur";
  target: string;
  data?: unknown;
};

export type ModelTrainingProps = {
  trainingData: TrainingDataItem[];
  setTrainedModel: (model: TrainedModel) => void;
  trainedModel: TrainedModel | null;
  trainedModels: TrainedModel[];
};

export type ImageGenerationProps = {
  trainedModel: TrainedModel | null;
  trainedModels: TrainedModel[];
  setSelectedModel: (model: TrainedModel | null) => void;
  generatedContent: GeneratedContent[];
  addGeneratedContent: (content: GeneratedContent) => void;
  removeGeneratedContent: (id: string) => void;
};

export type DataPreparationProps = {
  trainingData: TrainingDataItem[];
  setTrainingData: (data: TrainingDataItem[]) => void;
};

export type ModelInfoProps = {
  className?: string;
};

export type TrainingConfig = {
  modelName: string;
  epochs: number;
  learningRate: number;
  batchSize: number;
  resolution: number;
};

export type GenerationConfig = {
  prompt: string;
  negativePrompt: string;
  steps: number;
  guidanceScale: number;
  width: number;
  height: number;
  seed: number;
  type: "image" | "video";
};

export type FormValidation = {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
};

export type FluxLoraTrainingInput = {
  images_data_url: string;
  trigger_word?: string;
  create_masks?: boolean;
  steps: number;
  is_style?: boolean;
  is_input_format_already_preprocessed?: boolean;
  data_archive_format?: string;
};

export type FluxVideoResult = {
  video: {
    url: string;
    duration: number;
    fps: number;
  };
  seed: number;
};

export type GeneratedContentResult = {
  success: boolean;
  type: "image" | "video";
  images?: { url: string; content_type?: string }[];
  video?: {
    url: string;
    duration: number;
    fps: number;
  };
  seed: number;
  prompt: string;
};

export type ExternalModelData = {
  modelName: string;
  modelId: string;
  loraId: string;
  configFileUrl: string;
  loraFileUrl: string;
  steps: number;
  createdAt: string;
};

export type TrainingLog = {
  message?: string;
  [key: string]: unknown;
};

export type FalModel = {
  name: string;
  endpoint: string;
  url: string;
  description: string;
  capabilities: string[];
  features: string[];
};

export type FalAiInfo = {
  name: string;
  url: string;
  description: string;
  tagline: string;
};
