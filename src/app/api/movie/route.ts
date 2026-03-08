import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// ─────────────────────────────────────────────────────────────────────────────
// Environment variables
//
// HUGGINGFACE_API_KEY – Server-only key. Set in .env.local.
// ─────────────────────────────────────────────────────────────────────────────
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const hf = new HfInference(HUGGINGFACE_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// Movie Data Retrieval via Hugging Face (LLM-based)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchMovieDataViaHf(query: string) {
  if (!HUGGINGFACE_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not configured');
  }

  const prompt = `
Generate detailed movie metadata for the following title: "${query}".
Return ONLY a valid JSON object with the following fields:
{
  "Title": "Movie Title",
  "Year": "Release Year",
  "Rated": "Rating (e.g. PG-13)",
  "Runtime": "Duration",
  "Genre": "Genres",
  "Director": "Director Name",
  "Actors": "Lead Actors",
  "Plot": "Brief plot summary",
  "Poster": "A placeholder image URL like https://via.placeholder.com/300x450?text=Poster",
  "imdbRating": "Rating (e.g. 8.5)",
  "imdbVotes": "Votes (e.g. 1,000,000)",
  "Country": "Release Country",
  "Awards": "Major awards",
  "Language": "Primary Language",
  "BoxOffice": "Estimated Box Office",
  "imdbID": "tt0000000"
}
Do not include any other text, only the JSON object.
`.trim();

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      inputs: `<s>[INST] ${prompt} [/INST]`,
      parameters: {
        max_new_tokens: 1000,
        return_full_text: false,
      },
    });

    const rawText = response.generated_text.trim();
    const cleanJson = rawText.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err: any) {
    console.error('[fetchMovieDataViaHf] AI retrieval failed:', err.message);
    throw new Error('Failed to retrieve movie data from Hugging Face');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sentiment analysis via Hugging Face
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeSentimentViaHf(title: string): Promise<{ summary: string; classification: string }> {
  if (!HUGGINGFACE_API_KEY) {
    return {
      classification: 'Mixed',
      summary: 'AI analysis is unavailable: HUGGINGFACE_API_KEY is not configured.',
    };
  }

  const prompt = `
Summarize the general audience sentiment for the movie "${title}".
1. Provide a 2-3 sentence summary of what critics and audiences usually say about this movie.
2. Classify the overall sentiment as strictly ONE of: "Positive", "Mixed", or "Negative".

Return ONLY a valid JSON object:
{
  "summary": "Your 2-3 sentence summary here.",
  "classification": "Positive" | "Mixed" | "Negative"
}
`.trim();

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      inputs: `<s>[INST] ${prompt} [/INST]`,
      parameters: {
        max_new_tokens: 500,
        return_full_text: false,
      },
    });

    const rawText = response.generated_text.trim();
    const cleanJson = rawText.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const validClasses = ['Positive', 'Mixed', 'Negative'];
    if (!validClasses.includes(parsed.classification)) {
      parsed.classification = 'Mixed';
    }

    return parsed;
  } catch (err: any) {
    console.error('[analyzeSentimentViaHf] AI sentiment failed:', err.message);
    return {
      classification: 'Mixed',
      summary: 'Sentiment analysis is temporarily unavailable via Hugging Face.',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main GET handler
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || searchParams.get('id');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // We use the LLM to both retrieve metadata and simulate/summarize sentiment
    // since we are removing OMDB and Gemini.
    const movieData = await fetchMovieDataViaHf(query);
    const sentiment = await analyzeSentimentViaHf(movieData.Title);

    const movieDetails = {
      title: movieData.Title,
      year: movieData.Year,
      rated: movieData.Rated,
      runtime: movieData.Runtime,
      genre: movieData.Genre,
      director: movieData.Director,
      actors: movieData.Actors,
      plot: movieData.Plot,
      poster: movieData.Poster !== 'N/A' ? movieData.Poster : null,
      imdbId: movieData.imdbID,
      imdbRating: movieData.imdbRating,
      imdbVotes: movieData.imdbVotes,
      country: movieData.Country,
      awards: movieData.Awards,
      language: movieData.Language,
      boxOffice: movieData.BoxOffice,
      trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        movieData.Title + ' ' + movieData.Year + ' official trailer',
      )}`,
      aiInsights: sentiment,
    };

    return NextResponse.json(movieDetails);
  } catch (err: any) {
    console.error('[GET /api/movie] Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch movie details' },
      { status: 500 },
    );
  }
}
