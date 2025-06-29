# fal AI Integration Setup

This project demonstrates how to securely integrate fal AI with Next.js using modern best practices.

## Environment Setup

### 1. Create Environment File

Create a `.env.local` file in the root directory:

```bash
# fal API Configuration
FAL_API_KEY=PASTE_YOUR_FAL_KEY_HERE

# Optional: Model endpoint (you can change this as needed)
FAL_MODEL_ENDPOINT=fal-ai/flux/dev
```

### 2. Get Your fal API Key

1. Go to [fal.ai](https://fal.ai)
2. Sign up or log in to your account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

## Security Best Practices

✅ **What we're doing right:**

- API key is stored in environment variables (never in code)
- `.env.local` is already in `.gitignore` (won't be committed)
- All fal API calls happen server-side in API routes
- Client-side code never sees the API key
- Centralized configuration in `src/lib/fal-config.ts`

❌ **What to avoid:**

- Never hardcode API keys in your source code
- Never expose API keys to the client-side
- Never commit `.env.local` files to version control
- Don't use `NEXT_PUBLIC_` prefix for sensitive keys

## Usage

1. Start the development server:
   ```bash
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Enter a prompt and generate images!

## API Endpoints

- `POST /api/generate-image` - Generate images using fal AI
  - Body: `{ "prompt": "your text prompt", "modelEndpoint": "optional-model-endpoint" }`

## Available Models

You can use different fal AI models by changing the `modelEndpoint` parameter:

- `fal-ai/flux/dev` - Default FLUX model
- `fal-ai/flux-pro/v1.1-ultra` - FLUX Pro Ultra (2K resolution)
- `fal-ai/flux/schnell` - FLUX Schnell (fast generation)

## Deployment

When deploying to production:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Never commit `.env.local` files
3. Use the same variable names: `FAL_API_KEY` and `FAL_MODEL_ENDPOINT`

## Troubleshooting

- **"FAL_API_KEY environment variable is not set"**: Make sure you've created `.env.local` with your API key
- **"Failed to generate image"**: Check your API key is valid and you have sufficient credits
- **CORS errors**: This shouldn't happen since we're using API routes, but ensure you're calling the correct endpoint 