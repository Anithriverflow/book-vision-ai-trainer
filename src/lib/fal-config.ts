import { fal } from "@fal-ai/client";

// Configure fal with API key from environment variables
// This should only be called on the server side
export function configureFal() {
  const apiKey = process.env.FAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("FAL_API_KEY environment variable is not set");
  }
  
  fal.config({
    credentials: apiKey,
  });
  
  return fal;
}

// Initialize and export the configured fal instance
export const falInstance = configureFal();

// Get the default model endpoint from environment or use Imagen 4 as fallback
export function getDefaultModelEndpoint(): string {
  return process.env.FAL_MODEL_ENDPOINT || ""; // Could just fallback to "fal-ai/imagen4/preview"
} 