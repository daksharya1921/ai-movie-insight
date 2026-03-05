# AI Movie Insight Builder

A modern, full-stack Next.js application that fetches movie metadata and utilizes Google's Gemini AI to analyze audience sentiment from IMDb reviews.

## 🚀 Live Demo
[Insert Deployment Link Here]

## 🛠️ Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Next.js API Routes (Node.js)
- **Data Sources**: OMDB API (Movie Metadata), Cheerio (IMDb Web Scraping)
- **AI Integration**: Google Gemini (`@google/genai`)

## 💡 Tech Stack Rationale
- **Next.js & React**: Chosen for seamless frontend styling with Server/Client components, paired directly with API routes eliminating the need for a separate backend server.
- **Tailwind CSS & Framer Motion**: Ensures rapid UI development with a premium, responsive dark mode and delightful animations.
- **Cheerio**: Lightweight and fast HTML parser, perfect for extracting the raw reviews from IMDb's public DOM without the overhead of headless browsers like Puppeteer.
- **Gemini AI**: Excellent context window and rapid summarization capabilities out of the box.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- OMDB API Key (Free tier)
- Google Gemini API Key

### Local Installation
1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-movie-insight
```

2. Install dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a `.env.local` file in the root directory and add:
```env
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Assumptions
- **IMDb Scraping**: The app scrapes the initial user reviews loaded on the DOM of `https://www.imdb.com/title/{id}/reviews`. If IMDb changes their class names (`.text.show-more__control`), the scraper will return an empty array and the AI will gracefully fallback to a "No reviews available" state.
- **Token Limits**: Restricted the scrape to the top 10 visible reviews to ensure we stay well within free-tier AI token limits and prompt processing times.
- **OMDB API**: Assumed OMDB API is reliable for all provided `tt...` IDs.
