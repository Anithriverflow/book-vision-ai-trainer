"use client";

import { useState } from "react";
import { Brain, Play, Clock, CheckCircle, AlertCircle, History } from "lucide-react";
import { FAL_MODELS } from "@/lib/models";
import { TrainingDataItem, TrainedModel } from "@/lib/storage";

interface ModelTrainingProps {
  trainingData: TrainingDataItem[];
  setTrainedModel: (model: TrainedModel) => void;
  trainedModel: TrainedModel | null;
  trainedModels: TrainedModel[];
  setTrainedModels: (models: TrainedModel[]) => void;
}

interface TrainingConfig {
  modelName: string;
  epochs: number;
  learningRate: number;
  batchSize: number;
  resolution: number;
}

export default function ModelTraining({
  trainingData,
  setTrainedModel,
  trainedModel,
  trainedModels,
  setTrainedModels,
}: ModelTrainingProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [trainingError, setTrainingError] = useState("");
  const [config, setConfig] = useState<TrainingConfig>({
    modelName: "",
    epochs: 100,
    learningRate: 0.0001,
    batchSize: 1,
    resolution: 512,
  });

  const isDataReady =
    trainingData.length >= 10 &&
    trainingData.every(
      (item) =>
        item.description &&
        item.characterName &&
        item.sceneDescription &&
        item.styleDescription
    );

  const startTraining = async () => {
    if (!isDataReady || !config.modelName.trim()) {
      setTrainingError(
        "Please ensure you have at least 10 images with complete descriptions and a model name."
      );
      return;
    }

    setIsTraining(true);
    setTrainingError("");
    setTrainingProgress(0);

    try {
      // Prepare training data
      const formData = new FormData();
      formData.append("model_name", config.modelName);
      formData.append("epochs", config.epochs.toString());
      formData.append("learning_rate", config.learningRate.toString());
      formData.append("batch_size", config.batchSize.toString());
      formData.append("resolution", config.resolution.toString());

      // Add images and descriptions
      trainingData.forEach((item, index) => {
        formData.append(`image_${index}`, item.image);
        formData.append(
          `description_${index}`,
          `${item.characterName}: ${item.description}. Scene: ${item.sceneDescription}. Style: ${item.styleDescription}`
        );
      });

      formData.append("image_count", trainingData.length.toString());

      const response = await fetch("/api/train-model", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Training failed");
      }

      const data = await response.json();
      
      // Create trained model object
      const newTrainedModel: TrainedModel = {
        modelName: config.modelName,
        modelId: data.modelId,
        loraId: data.loraId,
        trainingConfig: {
          epochs: config.epochs,
          learningRate: config.learningRate,
          batchSize: config.batchSize,
          resolution: config.resolution,
          imageCount: trainingData.length,
        },
        status: 'completed',
        createdAt: new Date().toISOString(),
        trainingData: trainingData,
      };

      setTrainedModel(newTrainedModel);

      // Simulate progress updates (in real implementation, this would come from WebSocket or polling)
      const progressInterval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 2000);

      // Update estimated time
      const totalTime = config.epochs * trainingData.length * 2; // Rough estimate
      setEstimatedTime(`${Math.round(totalTime / 60)} minutes`);
    } catch (error) {
      setTrainingError(
        error instanceof Error ? error.message : "Training failed"
      );
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Train Your LoRA Model</h2>
        <p className="text-gray-300">
          Configure training parameters and start training your custom model for
          book visualization.
        </p>
        <p className="text-xs text-blue-300">
          Powered by{" "}
          <a
            href={FAL_MODELS.FLUX_LORA_FAST_TRAINING.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-blue-200 transition-colors"
          >
            {FAL_MODELS.FLUX_LORA_FAST_TRAINING.endpoint}
          </a>
        </p>
      </div>

      {/* Training History */}
      {trainedModels.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <History size={20} className="text-blue-400" />
            <span className="text-white font-medium">Training History</span>
          </div>
          <div className="space-y-2">
            {trainedModels.map((model, index) => (
              <div
                key={model.modelId}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  trainedModel?.modelId === model.modelId
                    ? "bg-blue-600/20 border border-blue-500"
                    : "bg-gray-700/50 hover:bg-gray-600/50"
                }`}
                onClick={() => setTrainedModel(model)}
              >
                <div>
                  <div className="text-white font-medium">{model.modelName}</div>
                  <div className="text-sm text-gray-400">
                    Trained on {model.trainingConfig.imageCount} images • {new Date(model.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <CheckCircle size={16} className="text-green-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Status */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain size={20} className="text-blue-400" />
            <span className="text-white font-medium">Training Data Status</span>
          </div>
          <div className="flex items-center space-x-2">
            {isDataReady ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <AlertCircle size={16} className="text-yellow-400" />
            )}
            <span
              className={`text-sm ${
                isDataReady ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {trainingData.length}/10 images ready
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          {trainingData.length < 10
            ? `Need ${10 - trainingData.length} more images`
            : `${
                trainingData.filter(
                  (item) =>
                    item.description &&
                    item.characterName &&
                    item.sceneDescription &&
                    item.styleDescription
                ).length
              }/${trainingData.length} images have complete descriptions`}
        </div>
      </div>

      {/* Training Configuration */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Training Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Model Name *
            </label>
            <input
              type="text"
              value={config.modelName}
              onChange={(e) =>
                setConfig({ ...config, modelName: e.target.value })
              }
              placeholder="e.g., three-body-problem-style"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Epochs
            </label>
            <input
              type="number"
              value={config.epochs}
              onChange={(e) =>
                setConfig({ ...config, epochs: parseInt(e.target.value) })
              }
              min="50"
              max="500"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Learning Rate
            </label>
            <input
              type="number"
              value={config.learningRate}
              onChange={(e) =>
                setConfig({
                  ...config,
                  learningRate: parseFloat(e.target.value),
                })
              }
              step="0.0001"
              min="0.0001"
              max="0.01"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Batch Size
            </label>
            <select
              value={config.batchSize}
              onChange={(e) =>
                setConfig({ ...config, batchSize: parseInt(e.target.value) })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Resolution
            </label>
            <select
              value={config.resolution}
              onChange={(e) =>
                setConfig({ ...config, resolution: parseInt(e.target.value) })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value={512}>512x512</option>
              <option value={768}>768x768</option>
              <option value={1024}>1024x1024</option>
            </select>
          </div>
        </div>

        <button
          onClick={startTraining}
          disabled={!isDataReady || isTraining}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer"
        >
          {isTraining ? "Training..." : "Start Training"}
        </button>
      </div>

      {/* Training Progress */}
      {isTraining && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Training Progress
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Progress</span>
              <span className="text-sm text-gray-400">
                {Math.round(trainingProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${trainingProgress}%`,
                }}
              />
            </div>
            <div className="text-sm text-gray-400">
              Estimated time remaining: {estimatedTime}
            </div>
          </div>
        </div>
      )}

      {/* Training Results */}
      {trainedModel && !isTraining && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Training Complete!
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 font-medium">
                Model "{trainedModel.modelName}" trained successfully
              </span>
            </div>
            <div className="text-sm text-gray-300">
              <p>Model ID: {trainedModel.modelId}</p>
              <p>LoRA ID: {trainedModel.loraId}</p>
              <p>Created: {new Date(trainedModel.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {trainingError && (
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-400 font-medium">Training Error</span>
          </div>
          <p className="text-red-300 mt-2">{trainingError}</p>
        </div>
      )}
    </div>
  );
}
