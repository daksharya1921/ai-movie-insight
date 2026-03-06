import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';

// ─────────────────────────────────────────────────────────────────────────────
// Environment variables
//
// GEMINI_API_KEY   – Server-only key (no NEXT_PUBLIC_ prefix).
//                    Set in .env.local.  Next.js exposes it only to server-side
//                    code (API routes, Server Actions) and never to the browser.
//
// NEXT_PUBLIC_OMDB_API_KEY – Prefixed with NEXT_PUBLIC_ so it is available on
//                    both server and client, but we only use it server-side here.
// ─────────────────────────────────────────────────────────────────────────────
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ─────────────────────────────────────────────────────────────────────────────
// Google Gen AI client (@google/genai v1.x)
//
// CORRECT initialisation:
//   • Pass only `apiKey` – no `apiVersion` override.
//     The SDK defaults to the beta endpoint which supports all current models.
//   • NOT the old @google/generative-ai package – this is the newer
//     @google/genai SDK where the client class is GoogleGenAI.
//
// WRONG (old pattern that causes 404):
//   new GoogleGenAI({ apiKey, apiVersion: 'v1beta' })
//   → Locking to 'v1beta' can route to a different endpoint base and cause
//     model-not-found 404s for some model strings.
// ─────────────────────────────────────────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

// ─────────────────────────────────────────────────────────────────────────────
// OMDB lookup
// ─────────────────────────────────────────────────────────────────────────────
async function fetchOmdbData(id?: string, title?: string) {
  let url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

  if (id) {
    url += `&i=${id}`;
  } else if (title) {
    url += `&t=${encodeURIComponent(title)}`;
  } else {
    throw new Error('No search criteria provided');
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to retrieve data from OMDB API');

  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Movie not found in OMDB');
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// IMDb review scraper
//
// We scrape the public review page using Cheerio.  IMDb blocks automated
// requests aggressively – if fewer than 1 review is returned the sentiment
// step gracefully handles that case without crashing.
// ─────────────────────────────────────────────────────────────────────────────
async function scrapeImdbReviews(imdbId: string): Promise<string[]> {
  try {
    const res = await fetch(`https://www.imdb.com/title/${imdbId}/reviews`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      console.error('[scrapeImdbReviews] HTTP error', res.status, 'for', imdbId);
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const reviews: string[] = [];

    // Selector targets the inner text container of each review block.
    // IMDb updates its markup frequently; if this returns 0 results the
    // sentiment step will still produce a graceful "No reviews" response.
    $('.ipc-html-content-inner-div').each((i, el) => {
      if (i < 10) {
        const txt = $(el).text().trim();
        if (txt) reviews.push(txt);
      }
    });

    console.log(`[scrapeImdbReviews] Scraped ${reviews.length} reviews for ${imdbId}`);
    return reviews;
  } catch (err) {
    console.error('[scrapeImdbReviews] Unexpected error:', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini sentiment analysis
//
// How the request is made
// ───────────────────────
//   ai.models.generateContent({ model, contents })
//     • `model`    – just the short model identifier, e.g. "gemini-2.0-flash".
//                    DO NOT prefix with "models/" – that is only needed in the
//                    REST API, not in this SDK.
//     • `contents` – plain string or Content[] array.
//     • `response.text` – string property on the returned GenerateContentResponse.
//
// Why 404 was happening before
// ────────────────────────────
//   The original code used 'models/gemini-1.5-flash' as the model string AND
//   set apiVersion: 'v1beta' on the client.  Together these caused the SDK to
//   build a malformed request URL that the Gemini API could not resolve,
//   returning a 404 ApiError.  Two fixes applied:
//     1. Removed apiVersion override from client initialisation (use SDK default).
//     2. Changed model to 'gemini-2.5-flash' without the 'models/' prefix.
//
// Troubleshooting guide for future developers
// ───────────────────────────────────────────
//   • 404 ApiError  → Wrong model name or endpoint. List available models at
//                     https://ai.google.dev/gemini-api/docs/models
//   • 403 ApiError  → GEMINI_API_KEY is missing, expired, or has no quota.
//                     Check https://aistudio.google.com/apikey
//   • Empty summary → IMDb blocked the scraper. The fallback message is shown.
//   • JSON parse error → Model wrapped JSON in markdown fences; the regex strip
//                     handles that, but for edge cases add more cleaning.
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeSentiment(reviews: string[]): Promise<{ summary: string; classification: string }> {
  // ── Guard: no reviews scraped ──────────────────────────────────────────────
  if (!reviews || reviews.length === 0) {
    console.warn('[analyzeSentiment] No reviews to analyse – returning neutral fallback.');
    return {
      classification: 'Mixed',
      summary:
        'No audience reviews could be retrieved for this title at this time. ' +
        'This is usually because IMDb blocked the automated request. ' +
        'Try again later or search for a more popular title.',
    };
  }

  // ── Guard: API key missing ─────────────────────────────────────────────────
  if (!GEMINI_API_KEY) {
    console.error('[analyzeSentiment] GEMINI_API_KEY is not set in .env.local');
    return {
      classification: 'Mixed',
      summary: 'AI analysis is unavailable: the GEMINI_API_KEY environment variable is not configured.',
    };
  }

  const reviewsText = reviews.map((r, i) => `Review ${i + 1}: ${r}`).join('\n\n');

  const prompt = `
Analyze the following top audience reviews for a movie.
1. Summarize the overall audience sentiment in 2-3 concise sentences. Focus on what people liked and disliked.
2. Classify the overall sentiment as strictly ONE of: "Positive", "Mixed", or "Negative".

Return ONLY a valid JSON object – no markdown fences, no extra text:
{
  "summary": "Your 2-3 sentence summary here.",
  "classification": "Positive" | "Mixed" | "Negative"
}

Reviews:
${reviewsText}
  `.trim();

  try {
    // ── Gemini API call ────────────────────────────────────────────────────
    // Model: 'gemini-2.0-flash'
    // • Standard model for @google/genai v1.x SDK.
    // • Fast, stable, and widely available.
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    // response.text is a string property (not a function) in @google/genai v1.x
    const rawText = response.text ?? '{}';

    // Strip any accidental markdown code fences the model may wrap around JSON
    const cleanJson = rawText.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();

    console.log('[analyzeSentiment] Raw Gemini response:', cleanJson);

    const parsed = JSON.parse(cleanJson);

    // Validate the classification field to avoid downstream display issues
    const validClasses = ['Positive', 'Mixed', 'Negative'];
    if (!validClasses.includes(parsed.classification)) {
      parsed.classification = 'Mixed';
    }

    return parsed;
  } catch (err: any) {
    // Provide a meaningful message without leaking raw error objects into the UI
    const status = err?.status ? ` (HTTP ${err.status})` : '';
    const message = err?.message ?? String(err);
    const isLeaked = message.toLowerCase().includes('leaked');

    console.error(`[analyzeSentiment] Gemini call failed${status}:`, message);

    // Return a graceful fallback – the movie card still renders, only insights
    // show the fallback text rather than a broken JSON blob.
    return {
      classification: 'Mixed',
      summary: isLeaked
        ? 'CRITICAL SECURITY ERROR: Your Gemini API key has been reported as leaked and disabled by Google. Please generate a new key in Google AI Studio and update your .env.local file.'
        : err?.status === 429
          ? 'The AI is currently at its free-tier capacity (Rate Limit Exceeded). Please wait 60 seconds and try again.'
          : `AI analysis is temporarily unavailable${status}. ${err?.status === 403
            ? 'Your Gemini API key may be unauthorized, missing, or has run out of quota.'
            : err?.status === 404
              ? 'The requested Gemini model was not found. Check the model name in route.ts.'
              : 'Please try again in a moment.'
          }`,
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
    // Detect IMDb ID format (tt followed by 7-8 digits) vs free-text title
    const isId = /^tt\d{7,8}$/.test(query);
    const omdbData = await fetchOmdbData(isId ? query : undefined, isId ? undefined : query);
    const resolvedId = omdbData.imdbID;

    // Run review scraping and Gemini analysis sequentially –
    // sentiment depends on the scraped reviews
    const reviews = await scrapeImdbReviews(resolvedId);
    const sentiment = await analyzeSentiment(reviews);

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
      trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        omdbData.Title + ' ' + omdbData.Year + ' official trailer',
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
