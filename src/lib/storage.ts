import path from "path";

// Types for persistent data
export interface TrainingDataItem {
  id: string;
  image: File;
  imageUrl: string;
  description: string;
  characterName: string;
  sceneDescription: string;
  styleDescription: string;
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

// Client-side storage (localStorage)
export class ClientStorage {
  private static readonly STORAGE_KEYS = {
    TRAINING_DATA: "book_vision_training_data",
    TRAINED_MODELS: "book_vision_trained_models",
    GENERATED_CONTENT: "book_vision_generated_content",
    ACTIVE_TAB: "book_vision_active_tab",
    UI_STATE: "book_vision_ui_state",
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

  // UI State
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

  // Clear all data
  static clearAllData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  }
}

// Server-side storage
export class ServerStorage {
  private static readonly STORAGE_DIR = path.join(process.cwd(), "data");
  private static readonly UPLOADS_DIR = path.join(this.STORAGE_DIR, "uploads");
  private static readonly GENERATED_DIR = path.join(
    this.STORAGE_DIR,
    "generated"
  );
  private static readonly MODELS_FILE = path.join(
    this.STORAGE_DIR,
    "models.json"
  );
  private static readonly CONTENT_FILE = path.join(
    this.STORAGE_DIR,
    "content.json"
  );

  // Initialize storage directories
  static initialize(): void {
    try {
      // Only run on server side
      if (typeof window !== "undefined") return;

      const fs = require("fs");
      [this.STORAGE_DIR, this.UPLOADS_DIR, this.GENERATED_DIR].forEach(
        (dir) => {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
        }
      );
    } catch (error) {
      console.error("Failed to initialize storage directories:", error);
    }
  }

  // Save uploaded image
  static async saveUploadedImage(
    file: File,
    filename: string
  ): Promise<string> {
    try {
      // Only run on server side
      if (typeof window !== "undefined") {
        throw new Error("This method can only be called on the server side");
      }

      const fs = require("fs");
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(this.UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      return `/api/uploads/${filename}`;
    } catch (error) {
      console.error("Failed to save uploaded image:", error);
      throw error;
    }
  }

  // Save generated content
  static async saveGeneratedContent(
    content: Buffer,
    filename: string,
    type: "image" | "video"
  ): Promise<string> {
    try {
      // Only run on server side
      if (typeof window !== "undefined") {
        throw new Error("This method can only be called on the server side");
      }

      const fs = require("fs");
      const filePath = path.join(this.GENERATED_DIR, filename);
      fs.writeFileSync(filePath, content);
      return `/api/generated/${filename}`;
    } catch (error) {
      console.error("Failed to save generated content:", error);
      throw error;
    }
  }

  // Save model metadata
  static saveModelMetadata(model: TrainedModel): void {
    try {
      // Only run on server side
      if (typeof window !== "undefined") return;

      const fs = require("fs");
      const models = this.loadModelMetadata();
      models.push(model);
      fs.writeFileSync(this.MODELS_FILE, JSON.stringify(models, null, 2));
    } catch (error) {
      console.error("Failed to save model metadata:", error);
    }
  }

  // Load model metadata
  static loadModelMetadata(): TrainedModel[] {
    try {
      // Only run on server side
      if (typeof window !== "undefined") return [];

      const fs = require("fs");
      if (!fs.existsSync(this.MODELS_FILE)) {
        return [];
      }
      const data = fs.readFileSync(this.MODELS_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load model metadata:", error);
      return [];
    }
  }

  // Save content metadata
  static saveContentMetadata(content: GeneratedContent): void {
    try {
      // Only run on server side
      if (typeof window !== "undefined") return;

      const fs = require("fs");
      const contents = this.loadContentMetadata();
      contents.push(content);
      fs.writeFileSync(this.CONTENT_FILE, JSON.stringify(contents, null, 2));
    } catch (error) {
      console.error("Failed to save content metadata:", error);
    }
  }

  // Load content metadata
  static loadContentMetadata(): GeneratedContent[] {
    try {
      // Only run on server side
      if (typeof window !== "undefined") return [];

      const fs = require("fs");
      if (!fs.existsSync(this.CONTENT_FILE)) {
        return [];
      }
      const data = fs.readFileSync(this.CONTENT_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load content metadata:", error);
      return [];
    }
  }

  // Get upload path
  static getUploadPath(filename: string): string {
    return path.join(this.UPLOADS_DIR, filename);
  }

  // Get generated path
  static getGeneratedPath(filename: string): string {
    return path.join(this.GENERATED_DIR, filename);
  }

  // Cleanup old files
  static cleanupOldFiles(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    try {
      // Only run on server side
      if (typeof window !== "undefined") return;

      const fs = require("fs");
      const now = Date.now();

      [this.UPLOADS_DIR, this.GENERATED_DIR].forEach((dir) => {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          files.forEach((file: string) => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (now - stats.mtime.getTime() > maxAge) {
              fs.unlinkSync(filePath);
            }
          });
        }
      });
    } catch (error) {
      console.error("Failed to cleanup old files:", error);
    }
  }
}
