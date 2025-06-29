"use client";

import { useState, useEffect } from "react";
import { BookOpen, Brain, Image as ImageIcon, Trash2 } from "lucide-react";
import DataPreparation from "@/components/DataPreparation";
import ModelTraining from "@/components/ModelTraining";
import ImageGeneration from "@/components/ImageGeneration";
import ModelInfo from "@/components/ModelInfo";
import {
  ClientStorage,
  TrainingDataItem,
  TrainedModel,
  GeneratedContent,
} from "@/lib/storage";

type TabType = "data" | "training" | "generation";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("data");
  const [trainingData, setTrainingData] = useState<TrainingDataItem[]>([]);
  const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>(
    []
  );
  const [selectedModel, setSelectedModel] = useState<TrainedModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persistent data on component mount
  useEffect(() => {
    const loadPersistentData = () => {
      try {
        // Load from localStorage
        const savedTrainingData = ClientStorage.loadTrainingData();
        const savedTrainedModels = ClientStorage.loadTrainedModels();
        const savedGeneratedContent = ClientStorage.loadGeneratedContent();
        const savedActiveTab = ClientStorage.loadActiveTab() as TabType;

        setTrainingData(savedTrainingData);
        setTrainedModels(savedTrainedModels);
        setGeneratedContent(savedGeneratedContent);
        setActiveTab(savedActiveTab);

        // Set the most recent model as selected
        if (savedTrainedModels.length > 0) {
          setSelectedModel(savedTrainedModels[savedTrainedModels.length - 1]);
        }
      } catch (error) {
        console.error("Failed to load persistent data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistentData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      ClientStorage.saveTrainingData(trainingData);
    }
  }, [trainingData, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      ClientStorage.saveTrainedModels(trainedModels);
    }
  }, [trainedModels, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      ClientStorage.saveGeneratedContent(generatedContent);
    }
  }, [generatedContent, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      ClientStorage.saveActiveTab(activeTab);
    }
  }, [activeTab, isLoading]);

  const handleSetTrainedModel = (model: TrainedModel) => {
    setSelectedModel(model);

    // Add to models list if not already present
    const existingIndex = trainedModels.findIndex(
      (m) => m.modelId === model.modelId
    );
    if (existingIndex >= 0) {
      const updatedModels = [...trainedModels];
      updatedModels[existingIndex] = model;
      setTrainedModels(updatedModels);
    } else {
      setTrainedModels([...trainedModels, model]);
    }
  };

  const handleAddGeneratedContent = (content: GeneratedContent) => {
    setGeneratedContent([...generatedContent, content]);
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      ClientStorage.clearAllData();
      setTrainingData([]);
      setTrainedModels([]);
      setGeneratedContent([]);
      setSelectedModel(null);
      setActiveTab("data");
    }
  };

  const tabs = [
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

  if (isLoading) {
    return (
      <div className="min-h-screen main-gradient-bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen main-gradient-bg text-white">
      <main className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-lg mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <img
              src="/5446441-200.png"
              alt="Book Vision AI"
              className="w-6 h-6 brightness-0 invert"
            />
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
              Book Vision AI
            </h1>
          </div>
          <p className="max-w-xl text-base md:text-lg text-gray-300 text-center mb-2">
            Create your own AI model trained on your favorite book artwork!
            Upload 10-20 of your favorite character illustrations, scene
            depictions, and artwork from books.
          </p>
          <p className="max-w-lg text-sm text-gray-400 text-center">
            Train a custom LoRA model, then generate unlimited images of
            characters, scenes, and settings from your favorite stories!
          </p>
          <div className="mt-3 flex space-x-2">
            <a
              href="https://flux1.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-medium text-xs"
            >
              Powered by Flux 1 Dev
            </a>
            <span className="text-gray-500 text-xs">|</span>
            <a
              href="https://fal.ai/flux-lora-fast-training"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-medium text-xs"
            >
              Flux LoRA Fast Training
            </a>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {trainingData.length}
                </div>
                <div className="text-xs text-gray-400">Training Images</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {trainedModels.length}
                </div>
                <div className="text-xs text-gray-400">Trained Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {generatedContent.length}
                </div>
                <div className="text-xs text-gray-400">Generated Items</div>
              </div>
            </div>
            <button
              onClick={clearAllData}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 size={16} />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-2 flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  } flex items-center space-x-3 px-8 py-4 rounded-lg transition-all duration-200 font-semibold cursor-pointer`}
                >
                  <Icon size={24} />
                  <span className="text-lg">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-6">
          {activeTab === "data" && (
            <DataPreparation
              trainingData={trainingData}
              setTrainingData={setTrainingData}
            />
          )}
          {activeTab === "training" && (
            <ModelTraining
              trainingData={trainingData}
              setTrainedModel={handleSetTrainedModel}
              trainedModel={selectedModel}
              trainedModels={trainedModels}
              setTrainedModels={setTrainedModels}
            />
          )}
          {activeTab === "generation" && (
            <ImageGeneration
              trainedModel={selectedModel}
              trainedModels={trainedModels}
              setSelectedModel={setSelectedModel}
              generatedContent={generatedContent}
              addGeneratedContent={handleAddGeneratedContent}
            />
          )}
        </div>

        {/* Detailed Model Info */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-8">
          <ModelInfo variant="detailed" />
        </div>
      </main>
    </div>
  );
}
