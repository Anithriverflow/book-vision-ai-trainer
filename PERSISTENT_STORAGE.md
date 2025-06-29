# Persistent Storage Feature

This application now includes persistent storage to ensure your data survives server restarts. This is especially important since training models and generating images costs money, and you don't want to lose your work.

## What Gets Saved

### Client-Side Storage (localStorage)
- **Training Data**: Images and descriptions you upload for model training
- **Trained Models**: Metadata about your trained LoRA models
- **Generated Content**: History of images and videos you've generated
- **UI State**: Active tab and other interface preferences

### Server-Side Storage (File System)
- **Uploaded Images**: Original training images saved to disk
- **Generated Content**: Images and videos you generate
- **Model Metadata**: Detailed information about trained models
- **Content Metadata**: Information about generated content

## Storage Locations

```
fal-demo/
├── data/                    # Main storage directory
│   ├── uploads/            # Uploaded training images
│   ├── generated/          # Generated images and videos
│   ├── models.json         # Model metadata
│   └── content.json        # Generated content metadata
└── scripts/
    └── init-storage.js     # Storage initialization script
```

## How It Works

### Automatic Persistence
- Data is automatically saved whenever you make changes
- localStorage handles client-side data persistence
- Server-side files are saved to the `data/` directory
- Storage directories are automatically created on startup

### Data Recovery
- When you restart the server, all data is automatically loaded
- Training data, models, and generated content are restored
- You can continue where you left off

### Data Management
- Use the "Clear All Data" button to reset everything
- Individual items can be removed from their respective sections
- Storage is cleaned up automatically (old files are removed after 7 days)

## Benefits

1. **Cost Protection**: Don't lose expensive training runs or generated content
2. **Work Continuity**: Pick up where you left off after server restarts
3. **Data Safety**: Multiple layers of storage (client + server)
4. **Easy Management**: Clear interface for managing your data

## File Structure

### Training Data
```typescript
interface TrainingDataItem {
  id: string;
  image: File;
  imageUrl: string;
  description: string;
  characterName: string;
  sceneDescription: string;
  styleDescription: string;
}
```

### Trained Models
```typescript
interface TrainedModel {
  modelName: string;
  modelId: string;
  loraId: string;
  trainingConfig: {
    epochs: number;
    learningRate: number;
    batchSize: number;
    resolution: number;
    imageCount: number;
  };
  status: string;
  createdAt: string;
  trainingData: TrainingDataItem[];
}
```

### Generated Content
```typescript
interface GeneratedContent {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  negativePrompt: string;
  config: {
    steps: number;
    guidanceScale: number;
    width: number;
    height: number;
    seed: number;
  };
  modelId: string;
  createdAt: string;
  filename: string;
}
```

## API Endpoints

### File Serving
- `/api/uploads/[...filename]` - Serve uploaded images
- `/api/generated/[...filename]` - Serve generated content

### Data Management
- `/api/storage?type=models` - Get model metadata
- `/api/storage?type=content` - Get content metadata
- `/api/storage` (POST) - Save model or content metadata

## Troubleshooting

### Storage Not Working
1. Check that the `data/` directory exists
2. Ensure the application has write permissions
3. Check browser console for localStorage errors
4. Verify the initialization script ran successfully

### Data Loss
1. Check if localStorage is enabled in your browser
2. Verify the `data/` directory contains your files
3. Check the browser's storage quota (localStorage has limits)

### Performance Issues
1. Large numbers of images may slow down the interface
2. Consider clearing old generated content
3. Monitor disk space usage in the `data/` directory

## Security Notes

- The `data/` directory is excluded from version control
- Uploaded files are served with appropriate content types
- No sensitive data is stored in localStorage
- File access is restricted to the application's domain

## Future Enhancements

- Database integration for better scalability
- Cloud storage options for backup
- Data export/import functionality
- Advanced data management tools 