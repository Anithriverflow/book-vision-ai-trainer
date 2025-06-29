// Types for persistent data
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

// Client-side storage (localStorage)
export class ClientStorage {
  private static readonly STORAGE_KEYS = {
    TRAINING_DATA: "book_vision_training_data",
    TRAINED_MODELS: "book_vision_trained_models",
    GENERATED_CONTENT: "book_vision_generated_content",
    ACTIVE_TAB: "book_vision_active_tab",
    UI_STATE: "book_vision_ui_state",
    CURRENT_TRAINING: "book_vision_current_training",
  };

  // Training Data
  static saveTrainingData(data: TrainingDataItem[]): void {
    try {
      // Convert File objects to serializable format
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
        this.STORAGE_KEYS.TRAINING_DATA,
        JSON.stringify(serializedData)
      );
    } catch (error) {
      console.error("Failed to save training data:", error);
    }
  }

  static loadTrainingData(): TrainingDataItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.TRAINING_DATA);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load training data:", error);
      return [];
    }
  }

  // Trained Models
  static saveTrainedModels(models: TrainedModel[]): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.TRAINED_MODELS,
        JSON.stringify(models)
      );
    } catch (error) {
      console.error("Failed to save trained models:", error);
    }
  }

  static loadTrainedModels(): TrainedModel[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.TRAINED_MODELS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load trained models:", error);
      return [];
    }
  }

  // Current Training Status
  static saveCurrentTraining(model: TrainedModel | null): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.CURRENT_TRAINING,
        JSON.stringify(model)
      );
    } catch (error) {
      console.error("Failed to save current training:", error);
    }
  }

  static loadCurrentTraining(): TrainedModel | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_TRAINING);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load current training:", error);
      return null;
    }
  }

  // Generated Content
  static saveGeneratedContent(content: GeneratedContent[]): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.GENERATED_CONTENT,
        JSON.stringify(content)
      );
    } catch (error) {
      console.error("Failed to save generated content:", error);
    }
  }

  static loadGeneratedContent(): GeneratedContent[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.GENERATED_CONTENT);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load generated content:", error);
      return [];
    }
  }

  // Active Tab
  static saveActiveTab(tab: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.ACTIVE_TAB, tab);
    } catch (error) {
      console.error("Failed to save active tab:", error);
    }
  }

  static loadActiveTab(): string {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.ACTIVE_TAB) || "data";
    } catch (error) {
      console.error("Failed to load active tab:", error);
      return "data";
    }
  }

  // UI State
  static saveUIState(state: UIState): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.UI_STATE, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save UI state:", error);
    }
  }

  static loadUIState(): UIState {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.UI_STATE);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Failed to load UI state:", error);
      return {};
    }
  }

  // Clear all data
  static clearAllData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear all data:", error);
    }
  }
}
