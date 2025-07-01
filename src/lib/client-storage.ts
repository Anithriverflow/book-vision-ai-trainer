export interface TrainingDataItem {
  id: string;
  image: File;
  imageUrl: string;
  description: string;
}

export interface TrainedModel {
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
}

export interface GeneratedContent {
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
}

export interface UIState {
  [key: string]: unknown;
}

// Simple localStorage wrapper functions
export const saveTrainingData = (data: TrainingDataItem[]) => {
  const serializedData = data.map((item) => ({
    ...item,
    image: {
      name: item.image.name,
      size: item.image.size,
      type: item.image.type,
      lastModified: item.image.lastModified,
    },
  }));
  localStorage.setItem(
    "book_vision_training_data",
    JSON.stringify(serializedData)
  );
};

export const loadTrainingData = (): TrainingDataItem[] => {
  const data = localStorage.getItem("book_vision_training_data");
  return data ? JSON.parse(data) : [];
};

export const saveTrainedModels = (models: TrainedModel[]) => {
  localStorage.setItem("book_vision_trained_models", JSON.stringify(models));
};

export const loadTrainedModels = (): TrainedModel[] => {
  const data = localStorage.getItem("book_vision_trained_models");
  return data ? JSON.parse(data) : [];
};

export const saveCurrentTraining = (model: TrainedModel | null) => {
  localStorage.setItem("book_vision_current_training", JSON.stringify(model));
};

export const loadCurrentTraining = (): TrainedModel | null => {
  const data = localStorage.getItem("book_vision_current_training");
  return data ? JSON.parse(data) : null;
};

export const saveGeneratedContent = (content: GeneratedContent[]) => {
  localStorage.setItem(
    "book_vision_generated_content",
    JSON.stringify(content)
  );
};

export const loadGeneratedContent = (): GeneratedContent[] => {
  const data = localStorage.getItem("book_vision_generated_content");
  return data ? JSON.parse(data) : [];
};

export const saveActiveTab = (tab: string) => {
  localStorage.setItem("book_vision_active_tab", tab);
};

export const loadActiveTab = (): string => {
  return localStorage.getItem("book_vision_active_tab") || "data";
};

export const clearAllData = () => {
  localStorage.removeItem("book_vision_training_data");
  localStorage.removeItem("book_vision_trained_models");
  localStorage.removeItem("book_vision_generated_content");
  localStorage.removeItem("book_vision_active_tab");
  localStorage.removeItem("book_vision_current_training");
};
