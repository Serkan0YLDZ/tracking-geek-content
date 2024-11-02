import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subject = searchParams.get('subject') || 'fantasy';
  const limit = searchParams.get('limit') || '10';

  try {
    const response = await fetch(
      `https://openlibrary.org/subjects/${subject}.json?limit=20`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } 
  catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}