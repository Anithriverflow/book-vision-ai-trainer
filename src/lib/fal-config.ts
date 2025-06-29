import { fal } from "@fal-ai/client";

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
