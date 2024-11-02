import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const path = searchParams.get('path') ; 
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTE1MTI4MmZmMzUwNjg5MDFlODQ4NTU0Y2RiY2I5MSIsIm5iZiI6MTcyOTQxODA1Ny4xOTIzODEsInN1YiI6IjY3MTRkMWZlZDViNzkyNmU5NDcwMTBiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._3V-WtISDrcTJS37Y0fdnMR-VBGm2ixffj-WSTTDKMo',
    },    
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/${path}?language=en-US&page=1`, options);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
