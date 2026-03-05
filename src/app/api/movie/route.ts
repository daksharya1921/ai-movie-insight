import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google Gen AI
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function fetchOmdbData(id?: string, title?: string) {
  const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  let url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

  if (id) {
    url += `&i=${id}`;
  } else if (title) {
    url += `&t=${encodeURIComponent(title)}`;
  } else {
    throw new Error('No search criteria provided');
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to retrieve data from OMDB API');
  }
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Movie not found in OMDB');
  return data;
}

async function scrapeImdbReviews(imdbId: string) {
  try {
    const res = await fetch(`https://www.imdb.com/title/${imdbId}/reviews`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch IMDB reviews page', res.status);
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const reviews: string[] = [];
    $('.text.show-more__control').each((i, el) => {
      if (i < 10) { // Limit to 10 reviews top
        let reviewText = $(el).text().trim();
        if (reviewText) {
          reviews.push(reviewText);
        }
      }
    });

    return reviews;
  } catch (error) {
    console.error('Error scraping IMDB:', error);
    return [];
  }
}

async function analyzeSentiment(reviews: string[]) {
  if (!reviews || reviews.length === 0) {
    return {
      summary: "No reviews were able to be retrieved for this movie.",
      classification: "Mixed"
    };
  }

  const reviewsText = reviews.map((r, i) => `Review ${i + 1}: ${r}`).join('\n\n');
  const prompt = `
    Analyze the following top audience reviews for a movie. 
    1. Summarize the overall audience sentiment in 2-3 concise sentences. Focus on what people liked and disliked.
    2. Classify the overall sentiment rigidly as strictly one of the following: "Positive", "Mixed", or "Negative".

    Return the result strictly as a JSON object with this shape:
    {
      "summary": "Your precise summary here...",
      "classification": "Positive" | "Mixed" | "Negative"
    }

    Reviews:
    ${reviewsText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text || '{}';
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Error running AI sentiment analysis:', error);
    return {
      summary: "AI sentiment analysis is currently unavailable.",
      classification: "Mixed"
    };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || searchParams.get('id');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // 1. Determine if it's an ID or a Title
    const isId = /^tt\d{7,8}$/.test(query);

    // 2. Fetch from OMDB
    const omdbData = await fetchOmdbData(isId ? query : undefined, isId ? undefined : query);
    const resolvedId = omdbData.imdbID;

    // 3. Scrape reviews using the resolved ID
    const reviews = await scrapeImdbReviews(resolvedId);

    // 4. Analyze Sentiment
    const sentiment = await analyzeSentiment(reviews);

    // Filter relevant fields for the frontend
    const movieDetails = {
      title: omdbData.Title,
      year: omdbData.Year,
      rated: omdbData.Rated,
      runtime: omdbData.Runtime,
      genre: omdbData.Genre,
      director: omdbData.Director,
      actors: omdbData.Actors,
      plot: omdbData.Plot,
      poster: omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
      imdbId: resolvedId,
      imdbRating: omdbData.imdbRating,
      imdbVotes: omdbData.imdbVotes,
      country: omdbData.Country,
      awards: omdbData.Awards,
      language: omdbData.Language,
      boxOffice: omdbData.BoxOffice,
      trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(omdbData.Title + ' ' + omdbData.Year + ' official trailer')}`,
      aiInsights: sentiment,
    };

    return NextResponse.json(movieDetails);
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to fetch movie details' }, { status: 500 });
  }
}
