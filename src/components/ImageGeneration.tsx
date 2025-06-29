"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Download,
  Sparkles,
  BookOpen,
  AlertCircle,
  History,
  Settings,
} from "lucide-react";
import { FAL_MODELS } from "@/lib/models";
import { TrainedModel, GeneratedContent } from "@/lib/storage";

interface ImageGenerationProps {
  trainedModel: TrainedModel | null;
  trainedModels: TrainedModel[];
  setSelectedModel: (model: TrainedModel | null) => void;
  generatedContent: GeneratedContent[];
  addGeneratedContent: (content: GeneratedContent) => void;
}

interface GenerationConfig {
  prompt: string;
  negativePrompt: string;
  steps: number;
  guidanceScale: number;
  width: number;
  height: number;
  seed: number;
  type: "image" | "video";
}

export default function ImageGeneration({
  trainedModel,
  trainedModels,
  setSelectedModel,
  generatedContent,
  addGeneratedContent,
}: ImageGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContentResult, setGeneratedContentResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [config, setConfig] = useState<GenerationConfig>({
    prompt: "",
    negativePrompt: "blurry, low quality, distorted, deformed",
    steps: 20,
    guidanceScale: 7.5,
    width: 512,
    height: 512,
    seed: -1,
    type: "image",
  });

  const samplePrompts = [
    "Ye Wenjie standing on a hilltop overlooking the Red Coast Base, dramatic lighting, cinematic composition",
    "Luo Ji in a dimly lit library surrounded by ancient books, mysterious atmosphere",
    "The Trisolaran fleet approaching Earth, space scene with stars, sci-fi aesthetic",
    "A character in a futuristic control room with holographic displays, neon lighting",
    "A dramatic scene from the Cultural Revolution, historical setting, emotional intensity",
  ];

  const setSamplePrompt = (prompt: string) => {
    setConfig({ ...config, prompt });
  };

  const generateContent = async () => {
    if (!trainedModel || !config.prompt.trim()) {
      setError("Please ensure you have a trained model and enter a prompt.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedContentResult(null);

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...config,
          modelId: trainedModel.modelId,
          loraId: trainedModel.loraId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const data = await response.json();
      setGeneratedContentResult(data);

      // Save generated content to persistent storage
      const newGeneratedContent: GeneratedContent = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: config.type,
        url: config.type === "image" ? data.image : data.video,
        prompt: config.prompt,
        negativePrompt: config.negativePrompt,
        config: {
          steps: config.steps,
          guidanceScale: config.guidanceScale,
          width: config.width,
          height: config.height,
          seed: config.seed,
        },
        modelId: trainedModel.modelId,
        createdAt: new Date().toISOString(),
        filename: config.type === "image" ? "generated-image.png" : "generated-video.mp4",
      };

      addGeneratedContent(newGeneratedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadContent = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!trainedModel) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <BookOpen size={48} className="mx-auto text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">
            No Trained Model Available
          </h2>
          <p className="text-yellow-200">
            You need to train a LoRA model first before you can generate
            content. Go to the "Train Model" tab to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Generate Content</h2>
        <p className="text-gray-300">
          Use your trained model "{trainedModel.modelName}" to generate images
          and videos.
        </p>
        <p className="text-xs text-blue-300">
          Powered by{" "}
          <a
            href={FAL_MODELS.FLUX_1_DEV.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-blue-200 transition-colors"
          >
            {FAL_MODELS.FLUX_1_DEV.endpoint}
          </a>
        </p>
      </div>

      {/* Model Selection */}
      {trainedModels.length > 1 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Settings size={20} className="text-blue-400" />
            <span className="text-white font-medium">Select Model</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {trainedModels.map((model) => (
              <button
                key={model.modelId}
                onClick={() => setSelectedModel(model)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  trainedModel?.modelId === model.modelId
                    ? "bg-blue-600/20 border border-blue-500"
                    : "bg-gray-700/50 hover:bg-gray-600/50"
                }`}
              >
                <div className="text-white font-medium">{model.modelName}</div>
                <div className="text-sm text-gray-400">
                  {new Date(model.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model Info */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles size={20} className="text-blue-400" />
            <span className="text-white font-medium">Active Model</span>
          </div>
          <span className="text-blue-400 font-medium">
            {trainedModel.modelName}
          </span>
        </div>
      </div>

      {/* Generation History */}
      {generatedContent.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <History size={20} className="text-purple-400" />
            <span className="text-white font-medium">Generation History</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedContent.slice(-6).reverse().map((content) => (
              <div key={content.id} className="bg-gray-700/50 rounded-lg p-3">
                {content.type === "image" ? (
                  <img
                    src={content.url}
                    alt="Generated content"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <video
                    src={content.url}
                    className="w-full h-32 object-cover rounded mb-2"
                    muted
                  />
                )}
                <div className="text-xs text-gray-300 truncate">{content.prompt}</div>
                <div className="text-xs text-gray-500">
                  {new Date(content.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Configuration */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Generation Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content Type
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setConfig({ ...config, type: "image" })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
                  config.type === "image"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <ImageIcon size={16} />
                <span>Image</span>
              </button>
              <button
                onClick={() => setConfig({ ...config, type: "video" })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
                  config.type === "video"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Video size={16} />
                <span>Video</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Prompt *
            </label>
            <textarea
              value={config.prompt}
              onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
              placeholder="Describe the scene, character, or concept you want to generate..."
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Negative Prompt
            </label>
            <textarea
              value={config.negativePrompt}
              onChange={(e) =>
                setConfig({ ...config, negativePrompt: e.target.value })
              }
              placeholder="What you don't want in the image..."
              rows={2}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Steps
            </label>
            <input
              type="number"
              value={config.steps}
              onChange={(e) =>
                setConfig({ ...config, steps: parseInt(e.target.value) })
              }
              min="10"
              max="50"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Guidance Scale
            </label>
            <input
              type="number"
              value={config.guidanceScale}
              onChange={(e) =>
                setConfig({
                  ...config,
                  guidanceScale: parseFloat(e.target.value),
                })
              }
              step="0.5"
              min="1"
              max="20"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Width
            </label>
            <select
              value={config.width}
              onChange={(e) =>
                setConfig({ ...config, width: parseInt(e.target.value) })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value={512}>512</option>
              <option value={768}>768</option>
              <option value={1024}>1024</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Height
            </label>
            <select
              value={config.height}
              onChange={(e) =>
                setConfig({ ...config, height: parseInt(e.target.value) })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value={512}>512</option>
              <option value={768}>768</option>
              <option value={1024}>1024</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Seed
            </label>
            <input
              type="number"
              value={config.seed}
              onChange={(e) =>
                setConfig({ ...config, seed: parseInt(e.target.value) })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        </div>

        {/* Sample Prompts */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Sample Prompts
          </label>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setSamplePrompt(prompt)}
                className={`px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors cursor-pointer`}
              >
                {prompt.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateContent}
          disabled={isGenerating || !config.prompt.trim()}
          className={`w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer`}
        >
          {isGenerating ? "Generating..." : "Generate Content"}
        </button>
      </div>

      {/* Generated Content */}
      {generatedContentResult && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Generated Content
          </h3>
          <div className="space-y-4">
            {config.type === "image" ? (
              <div className="text-center">
                <img
                  src={generatedContentResult.image}
                  alt="Generated image"
                  className="max-w-full h-auto rounded-lg border border-gray-600"
                />
                <button
                  onClick={() =>
                    downloadContent(
                      generatedContentResult.image,
                      "generated-image.png"
                    )
                  }
                  className={`mt-4 flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer`}
                >
                  <Download size={16} />
                  <span>Download Image</span>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <video
                  src={generatedContentResult.video}
                  controls
                  className="max-w-full h-auto rounded-lg border border-gray-600"
                />
                <button
                  onClick={() =>
                    downloadContent(
                      generatedContentResult.video,
                      "generated-video.mp4"
                    )
                  }
                  className={`mt-4 flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer`}
                >
                  <Download size={16} />
                  <span>Download Video</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-400 font-medium">Generation Error</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      )}
    </div>
  );
}
