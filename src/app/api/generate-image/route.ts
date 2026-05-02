import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, prompt, model, size, n = 1, image } = await request.json();
    
    console.log('Received request:', {
      hasApiKey: !!apiKey,
      hasPrompt: !!prompt,
      model,
      size,
      n,
      hasImage: !!image,
    });
    
    if (!apiKey) {
      console.error('API key is required');
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!prompt) {
      console.error('Prompt is required');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const requestBody: Record<string, any> = {
      model: model || 'gpt-image-2-all',
      prompt,
      size: size || '1024x1024',
      n,
      format: 'jpeg',
      quality: 'high',
    };

    if (image && Array.isArray(image) && image.length > 0) {
      requestBody.image = image;
    }

    console.log('Sending request to API:', {
      url: 'https://yunwu.ai/v1/images/generations',
      model: requestBody.model,
      size: requestBody.size,
      hasImage: !!requestBody.image,
    });

    const response = await fetch('https://yunwu.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('API error:', response.status, errorData);
      return NextResponse.json(
        { error: errorData.message || `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API response received:', { hasData: !!data, dataLength: data?.data?.length });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
