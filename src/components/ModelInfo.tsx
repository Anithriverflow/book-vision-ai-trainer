"use client";

import { Info, Zap, Brain, Video, Image as ImageIcon } from "lucide-react";
import { FAL_MODELS, FAL_AI_INFO } from "@/lib/models";

interface ModelInfoProps {
  className?: string;
}

export default function ModelInfo({ className = "" }: ModelInfoProps) {
  return (
    <div
      className={`bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3 ${className}`}
    >
      <div className="flex items-center space-x-2">
        <Info size={16} className="text-blue-400" />
        <a
          href={FAL_AI_INFO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-white hover:text-blue-300 transition-colors"
        >
          {FAL_AI_INFO.tagline}
        </a>
      </div>

      <div className="grid gap-3">
        {/* Generation Model */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Zap size={16} className="text-green-400 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <a
                href={FAL_MODELS.FLUX_1_DEV.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white hover:text-blue-300 transition-colors"
              >
                {FAL_MODELS.FLUX_1_DEV.name}
              </a>
              <span className="text-xs text-gray-300">
                ({FAL_MODELS.FLUX_1_DEV.endpoint})
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {FAL_MODELS.FLUX_1_DEV.description}
            </p>
            <div className="flex items-center space-x-3 mt-2">
              {FAL_MODELS.FLUX_1_DEV.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center space-x-1">
                  {capability.includes("Image") && (
                    <ImageIcon size={10} className="text-blue-400" />
                  )}
                  {capability.includes("Video") && (
                    <Video size={10} className="text-purple-400" />
                  )}
                  {capability.includes("LoRA") && (
                    <Brain size={10} className="text-green-400" />
                  )}
                  <span className="text-xs text-gray-300">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Model */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Brain size={16} className="text-purple-400 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <a
                href={FAL_MODELS.FLUX_LORA_FAST_TRAINING.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white hover:text-blue-300 transition-colors"
              >
                {FAL_MODELS.FLUX_LORA_FAST_TRAINING.name}
              </a>
              <span className="text-xs text-gray-300">
                ({FAL_MODELS.FLUX_LORA_FAST_TRAINING.endpoint})
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {FAL_MODELS.FLUX_LORA_FAST_TRAINING.description}
            </p>
            <div className="flex items-center space-x-3 mt-2">
              {FAL_MODELS.FLUX_LORA_FAST_TRAINING.capabilities.map(
                (capability, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    {capability.includes("Training") && (
                      <Brain size={10} className="text-purple-400" />
                    )}
                    {capability.includes("Custom") && (
                      <Zap size={10} className="text-green-400" />
                    )}
                    <span className="text-xs text-gray-300">{capability}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
