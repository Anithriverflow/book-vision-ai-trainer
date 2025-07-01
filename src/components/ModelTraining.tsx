"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  CheckCircle,
  AlertCircle,
  History,
  Loader2,
  Download,
  Plus,
} from "lucide-react";
import { FAL_MODELS } from "@/lib/models";
import {
  TrainingDataItem,
  TrainedModel,
  saveCurrentTraining,
  loadCurrentTraining,
} from "@/lib/client-storage";
import {
  ModelTrainingProps,
  TrainingConfig,
  ExternalModelData,
  TrainingLog,
} from "@/lib/types";
import {
  VALIDATION,
  TRAINING_CONSTANTS,
  DEFAULT_TRAINING_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@/lib/constants";

export function ModelTraining({
  trainingData,
  setTrainedModel,
  trainedModel,
  trainedModels,
}: ModelTrainingProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [trainingError, setTrainingError] = useState("");
  const [currentTrainingModel, setCurrentTrainingModel] =
    useState<TrainedModel | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [showImportForm, setShowImportForm] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [config, setConfig] = useState<TrainingConfig>({
    modelName: "",
    epochs: DEFAULT_TRAINING_CONFIG.epochs,
    learningRate: DEFAULT_TRAINING_CONFIG.learningRate,
    batchSize: DEFAULT_TRAINING_CONFIG.batchSize,
    resolution: DEFAULT_TRAINING_CONFIG.resolution,
  });
  const [externalModelData, setExternalModelData] = useState<ExternalModelData>(
    {
      modelName: "",
      modelId: "",
      loraId: "",
      configFileUrl: "",
      loraFileUrl: "",
      steps: 1100,
      createdAt: new Date().toISOString(),
    }
  );

  const isDataReady =
    trainingData.length >= VALIDATION.MIN_EPOCHS &&
    trainingData.every(
      (item) =>
        item.description &&
        item.description.trim().length >= VALIDATION.MIN_DESCRIPTION_LENGTH
    );

  // Check for ongoing training sessions on component mount
  useEffect(() => {
    const checkOngoingTraining = async () => {
      // First check localStorage for current training
      const savedCurrentTraining = loadCurrentTraining();

      if (savedCurrentTraining && savedCurrentTraining.status === "training") {
        setCurrentTrainingModel(savedCurrentTraining);
        setIsTraining(true);
        startStatusPolling(savedCurrentTraining.modelId);
        return;
      }

      // Fallback: Look for models with "training" status in trainedModels
      const trainingModels = trainedModels.filter(
        (model) => model.status === "training"
      );

      if (trainingModels.length > 0) {
        const latestTrainingModel = trainingModels[trainingModels.length - 1];
        setCurrentTrainingModel(latestTrainingModel);
        setIsTraining(true);
        saveCurrentTraining(latestTrainingModel);
        startStatusPolling(latestTrainingModel.modelId);
      }
    };

    checkOngoingTraining();
  }, [trainedModels]);

  const startStatusPolling = (requestId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/training-status?requestId=${requestId}`
        );
        if (response.ok) {
          const data = await response.json();

          if (data.logs) {
            setTrainingLogs(
              data.logs.map((log: TrainingLog) => log.message || log)
            );
          }

          if (data.status === "completed") {
            setIsTraining(false);
            setCurrentTrainingModel(null);
            setTrainingProgress(100);
            saveCurrentTraining(null);
            clearInterval(pollInterval);

            // Update the model in the parent component
            if (data.model) {
              setTrainedModel(data.model);
            }
          } else if (data.status === "training") {
            // Update progress based on logs or time elapsed
            const elapsed =
              Date.now() - new Date(data.model.createdAt).getTime();
            const estimatedTotal =
              data.model.trainingConfig.epochs *
              data.model.trainingConfig.imageCount *
              2000; // Rough estimate
            const progress = Math.min(
              (elapsed / estimatedTotal) * 100,
              TRAINING_CONSTANTS.MAX_PROGRESS
            );
            setTrainingProgress(progress);

            // Update current training model
            setCurrentTrainingModel(data.model);
            saveCurrentTraining(data.model);
          }
        }
      } catch (error) {
        console.error("Error polling training status:", error);
      }
    }, TRAINING_CONSTANTS.POLL_INTERVAL); // Poll every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  };

  const startTraining = async () => {
    if (!isDataReady) {
      setTrainingError(ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
      return;
    }
    if (!config.modelName.trim()) {
      setTrainingError("Please enter a model name.");
      return;
    }

    setIsTraining(true);
    setTrainingError("");
    setTrainingProgress(0);
    setTrainingLogs([]);

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
        formData.append(`image_url_${index}`, item.imageUrl);
        formData.append(`description_${index}`, item.description);
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
        status: "training",
        createdAt: new Date().toISOString(),
        trainingData: trainingData,
      };

      setCurrentTrainingModel(newTrainedModel);
      setTrainedModel(newTrainedModel);
      saveCurrentTraining(newTrainedModel);

      // Start polling for status updates
      startStatusPolling(data.modelId);

      // Update estimated time
      const totalTime = config.epochs * trainingData.length * 2; // Rough estimate
      setEstimatedTime(`${Math.round(totalTime / 60)} minutes`);
    } catch (error) {
      setTrainingError(
        error instanceof Error ? error.message : "Training failed"
      );
      setIsTraining(false);
    }
  };

  const importExternalModel = async () => {
    if (
      !externalModelData.modelName.trim() ||
      !externalModelData.modelId.trim() ||
      !externalModelData.loraFileUrl.trim()
    ) {
      setImportError("Model name, Model ID, and LoRA File URL are required");
      return;
    }

    try {
      setImportError("");
      setImportSuccess("");

      // Create a TrainedModel object from external data
      const importedModel: TrainedModel = {
        modelName: externalModelData.modelName,
        modelId: externalModelData.modelId,
        loraId: externalModelData.loraFileUrl,
        trainingConfig: {
          epochs: 100, // Default values since we don't have the original config
          learningRate: 0.0001,
          batchSize: 1,
          resolution: 512,
          imageCount: 0, // We don't have the original training data
        },
        status: "completed",
        createdAt: externalModelData.createdAt,
        trainingData: [], // Empty since we don't have the original training data
      };

      // Add to models list
      setTrainedModel(importedModel);

      setImportSuccess(
        `Model "${externalModelData.modelName}" imported successfully!`
      );
      setShowImportForm(false);

      // Reset form
      setExternalModelData({
        modelName: "",
        modelId: "",
        loraId: "",
        configFileUrl: "",
        loraFileUrl: "",
        steps: 1100,
        createdAt: new Date().toISOString(),
      });

      // Clear success message after 3 seconds
      setTimeout(() => setImportSuccess(""), 3000);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Failed to import model"
      );
    }
  };

  const prefillWithUserModel = () => {
    setExternalModelData({
      modelName: "My Book Style Model",
      modelId: "1eba12f7-e71f-429f-a384-e0db65126315",
      loraId:
        "https://v3.fal.media/files/penguin/9My4JUI_rFpSxZ1JLBifX_pytorch_lora_weights.safetensors",
      configFileUrl:
        "https://v3.fal.media/files/kangaroo/xHIVONLA3TublS0NBEskn_config.json",
      loraFileUrl:
        "https://v3.fal.media/files/penguin/9My4JUI_rFpSxZ1JLBifX_pytorch_lora_weights.safetensors",
      steps: 1100,
      createdAt: new Date().toISOString(),
    });
    setShowImportForm(true);
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

      {/* Import External Model */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Download size={20} className="text-green-400" />
            <span className="text-white font-medium">
              Import External Model
            </span>
          </div>
          <button
            onClick={() => setShowImportForm(!showImportForm)}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Plus size={16} />
            <span>{showImportForm ? "Cancel" : "Import Model"}</span>
          </button>
        </div>

        {showImportForm && (
          <div className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-300">
              Import a model that was trained externally on Fal.ai. This will
              make it available for image generation.
            </p>

            <div className="flex space-x-2 mb-4">
              <button
                onClick={prefillWithUserModel}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Use My Model Data
              </button>
              <span className="text-xs text-gray-400 self-center">
                (Demo/example only. Paste your own LoRA File URL for real use.)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Model Name *
                </label>
                <input
                  type="text"
                  value={externalModelData.modelName}
                  onChange={(e) =>
                    setExternalModelData({
                      ...externalModelData,
                      modelName: e.target.value,
                    })
                  }
                  placeholder="e.g., my-book-style"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Model ID / Request ID *
                </label>
                <input
                  type="text"
                  value={externalModelData.modelId}
                  onChange={(e) =>
                    setExternalModelData({
                      ...externalModelData,
                      modelId: e.target.value,
                    })
                  }
                  placeholder="e.g., 1eba12f7-e71f-429f-a384-e0db65126315"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  LoRA ID
                </label>
                <input
                  type="text"
                  value={externalModelData.loraId}
                  onChange={(e) =>
                    setExternalModelData({
                      ...externalModelData,
                      loraId: e.target.value,
                    })
                  }
                  placeholder="e.g., penguin/9My4JUI_rFpSxZ1JLBifX"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Training Steps
                </label>
                <input
                  type="number"
                  value={externalModelData.steps}
                  onChange={(e) =>
                    setExternalModelData({
                      ...externalModelData,
                      steps: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Config File URL
                </label>
                <input
                  type="url"
                  value={externalModelData.configFileUrl}
                  onChange={(e) =>
                    setExternalModelData({
                      ...externalModelData,
                      configFileUrl: e.target.value,
                    })
                  }
                  placeholder="https://v3.fal.media/files/kangaroo/xHIVONLA3TublS0NBEskn_config.json"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  LoRA File URL
                </label>
                <input
                  type="url"
                  value={externalModelData.loraFileUrl}
                  onChange={(e) =>
                    setExternalModelData({
                      ...externalModelData,
                      loraFileUrl: e.target.value,
                    })
                  }
                  placeholder="https://v3.fal.media/files/penguin/9My4JUI_rFpSxZ1JLBifX_pytorch_lora_weights.safetensors"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
              </div>
            </div>

            <button
              onClick={importExternalModel}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold cursor-pointer"
            >
              Import Model
            </button>

            {importError && (
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-3">
                <p className="text-red-300 text-sm">{importError}</p>
              </div>
            )}

            {importSuccess && (
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-3">
                <p className="text-green-300 text-sm">{importSuccess}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Training History */}
      {trainedModels.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <History size={20} className="text-blue-400" />
            <span className="text-white font-medium">Training History</span>
          </div>
          <div className="space-y-2">
            {trainedModels.map((model) => (
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
                  <div className="text-white font-medium">
                    {model.modelName}
                  </div>
                  <div className="text-sm text-gray-400">
                    Trained on {model.trainingConfig.imageCount} images •{" "}
                    {new Date(model.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-blue-300 break-all">
                    LoRA URL: {model.loraId}
                  </div>
                  {model.status === "training" && (
                    <div className="text-sm text-yellow-400 flex items-center space-x-1 mt-1">
                      <Loader2 size={12} className="animate-spin" />
                      <span>Training in progress...</span>
                    </div>
                  )}
                </div>
                {model.status === "completed" ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : model.status === "training" ? (
                  <Loader2 size={16} className="text-yellow-400 animate-spin" />
                ) : (
                  <AlertCircle size={16} className="text-red-400" />
                )}
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
            : `${trainingData.filter((item) => item.description).length}/${
                trainingData.length
              } images have complete descriptions`}
        </div>
      </div>

      {/* Training Configuration */}
      {!isTraining && (
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
            disabled={!isDataReady}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer"
          >
            Start Training
          </button>
        </div>
      )}

      {/* Training Progress */}
      {isTraining && currentTrainingModel && (
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
              Training model: {currentTrainingModel.modelName}
            </div>
            {estimatedTime && (
              <div className="text-sm text-gray-400">
                Estimated time remaining: {estimatedTime}
              </div>
            )}

            {/* Training Logs */}
            {trainingLogs.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Training Logs
                </h4>
                <div className="bg-gray-900 rounded p-3 max-h-32 overflow-y-auto">
                  {trainingLogs.slice(-5).map((log, index) => (
                    <div key={index} className="text-xs text-gray-400 mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Training Results */}
      {trainedModel && trainedModel.status === "completed" && !isTraining && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Training Complete!
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 font-medium">
                Model &quot;{trainedModel.modelName}&quot; trained successfully
              </span>
            </div>
            <div className="text-sm text-gray-300">
              <p>Model ID: {trainedModel.modelId}</p>
              <p>LoRA ID: {trainedModel.loraId}</p>
              <p>
                Created: {new Date(trainedModel.createdAt).toLocaleString()}
              </p>
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
