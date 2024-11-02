import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type =  'manga';  
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `https://api.jikan.moe/v4/manga?type=${type}&sfw=true&order_by=popularity&sort=asc&limit=20`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid data structure received from API');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch manga data. Please try again in a few moments.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}