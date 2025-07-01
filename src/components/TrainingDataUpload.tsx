"use client";

import { useState, useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { TrainingDataItem } from "@/lib/localStorage";
import { DataPreparationProps } from "@/lib/types";
import { UI_CONSTANTS, VALIDATION } from "@/lib/constants";

export function TrainingDataUpload({
  trainingData,
  setTrainingData,
}: DataPreparationProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    // Process all files and create new items
    const newItems: TrainingDataItem[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Convert file to base64 data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const newItem: TrainingDataItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            image: file,
            imageUrl,
            description: "",
          };

          newItems.push(newItem);

          // If this is the last file, update the training data
          if (
            newItems.length ===
            Array.from(files).filter((f) => f.type.startsWith("image/")).length
          ) {
            setTrainingData([...trainingData, ...newItems]);
            setIsUploading(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
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

  const deleteItem = (id: string) => {
    setTrainingData(trainingData.filter((item) => item.id !== id));
  };

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
          accept={UI_CONSTANTS.ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition-colors cursor-pointer"
        >
          <Upload size={20} />
          <span>
            {isUploading
              ? UI_CONSTANTS.UPLOADING_TEXT
              : UI_CONSTANTS.UPLOAD_BUTTON_TEXT}
          </span>
        </button>
        <p className="text-gray-400 mt-2">{UI_CONSTANTS.SUPPORTED_FORMATS}</p>
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
                {/* Item Header with Delete Button */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.imageUrl}
                      alt="Training image"
                      className="w-12 h-12 object-cover rounded border border-gray-600"
                    />
                    <span className="text-sm text-gray-400">
                      {item.image.name}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    title="Delete this training image"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Image Description
                    </label>
                    <p className="text-xs text-gray-400 mb-1">
                      Tip: Describe the subject, setting, style, and any
                      relevant details about the image to help the AI learn
                      effectively.
                    </p>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder="Describe the subject, setting, style, and any relevant details about the image..."
                      rows={3}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                    />
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
              {trainingData.filter((item) => item.description).length}/
              {trainingData.length} complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (trainingData.filter((item) => item.description).length /
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
