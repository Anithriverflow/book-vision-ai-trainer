"use client";

import { useState, useRef } from "react";
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react";
import { FAL_MODELS } from "@/lib/models";
import { TrainingDataItem } from "@/lib/storage";

interface DataPreparationProps {
  trainingData: TrainingDataItem[];
  setTrainingData: (data: TrainingDataItem[]) => void;
}

export default function DataPreparation({
  trainingData,
  setTrainingData,
}: DataPreparationProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        const newItem: TrainingDataItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          image: file,
          imageUrl,
          description: "",
          characterName: "",
          sceneDescription: "",
          styleDescription: "",
        };

        setTrainingData([...trainingData, newItem]);
      }
    });

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeItem = (id: string) => {
    const item = trainingData.find((item) => item.id === id);
    if (item) {
      URL.revokeObjectURL(item.imageUrl);
    }
    setTrainingData(trainingData.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof TrainingDataItem,
    value: string
  ) => {
    setTrainingData(
      trainingData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const descriptionTemplate = `Character: [Describe the character's appearance, clothing, expressions, pose]
Scene: [Describe the setting, lighting, atmosphere, background]
Style: [Describe the art style, color palette, mood, artistic technique]`;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">
          Prepare Your Training Data
        </h2>
        <p className="text-gray-300">
          Upload 10-20 images of characters, scenes, or art styles from your
          book. Add detailed descriptions to help the AI learn effectively.
        </p>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/30">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition-colors cursor-pointer"
        >
          <Upload size={20} />
          <span>{isUploading ? "Uploading..." : "Upload Images"}</span>
        </button>
        <p className="text-gray-400 mt-2">
          Supported formats: JPG, PNG, WebP (Max 10MB per image)
        </p>
      </div>

      {/* Description Template */}
      <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">
          Description Template
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Use this template for optimal LoRA training results with Flux LoRA
          Fast Training:
        </p>
        <pre className="text-sm text-gray-200 bg-gray-800 p-3 rounded border overflow-auto">
          {descriptionTemplate}
        </pre>
        <p className="text-xs text-blue-200 mt-2">
          Optimized for{" "}
          <a
            href={FAL_MODELS.FLUX_LORA_FAST_TRAINING.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-blue-100 transition-colors"
          >
            {FAL_MODELS.FLUX_LORA_FAST_TRAINING.endpoint}
          </a>
        </p>
      </div>

      {/* Training Data List */}
      {trainingData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Training Data ({trainingData.length} images)
          </h3>
          <div className="space-y-4">
            {trainingData.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt="Training image"
                      className="w-24 h-24 object-cover rounded border border-gray-600"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Character Name
                      </label>
                      <input
                        type="text"
                        value={item.characterName}
                        onChange={(e) =>
                          updateItem(item.id, "characterName", e.target.value)
                        }
                        placeholder="e.g., Ye Wenjie, Luo Ji"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Character Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Describe the character's appearance, clothing, expressions, pose..."
                        rows={2}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Scene Description
                      </label>
                      <textarea
                        value={item.sceneDescription}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "sceneDescription",
                            e.target.value
                          )
                        }
                        placeholder="Describe the setting, lighting, atmosphere, background..."
                        rows={2}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Style Description
                      </label>
                      <textarea
                        value={item.styleDescription}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "styleDescription",
                            e.target.value
                          )
                        }
                        placeholder="Describe the art style, color palette, mood, artistic technique..."
                        rows={2}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {trainingData.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Data Preparation Progress
            </span>
            <span className="text-sm text-gray-400">
              {
                trainingData.filter(
                  (item) =>
                    item.description &&
                    item.characterName &&
                    item.sceneDescription &&
                    item.styleDescription
                ).length
              }
              /{trainingData.length} complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (trainingData.filter(
                    (item) =>
                      item.description &&
                      item.characterName &&
                      item.sceneDescription &&
                      item.styleDescription
                  ).length /
                    Math.max(trainingData.length, 1)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
