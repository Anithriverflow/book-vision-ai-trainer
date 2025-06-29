import { NextRequest, NextResponse } from 'next/server';
import { ServerStorage, ClientStorage, TrainingDataItem, TrainedModel, GeneratedContent } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'models':
        const models = ServerStorage.loadModelMetadata();
        return NextResponse.json({ models });
      
      case 'content':
        const content = ServerStorage.loadContentMetadata();
        return NextResponse.json({ content });
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error loading data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const body = await request.json();

    switch (type) {
      case 'model':
        const model: TrainedModel = {
          ...body,
          createdAt: new Date().toISOString()
        };
        ServerStorage.saveModelMetadata(model);
        return NextResponse.json({ success: true, model });
      
      case 'content':
        const content: GeneratedContent = {
          ...body,
          createdAt: new Date().toISOString()
        };
        ServerStorage.saveContentMetadata(content);
        return NextResponse.json({ success: true, content });
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter required' }, { status: 400 });
    }

    switch (type) {
      case 'model':
        // Implementation for deleting model metadata
        return NextResponse.json({ success: true });
      
      case 'content':
        // Implementation for deleting content metadata
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
} 