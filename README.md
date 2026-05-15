# Shubham Singh — AI Engineer Portfolio

A portfolio website with an embedded AI clone that answers questions about my background, projects, and skills in real time.

**Live:** [portfolio-bay-gamma-58.vercel.app](https://portfolio-bay-gamma-58.vercel.app)

## Tech Stack

| Layer     | Technology                                                          |
|-----------|---------------------------------------------------------------------|
| Frontend  | Next.js 14 · TypeScript · Tailwind · Framer Motion · Three.js       |
| Backend   | FastAPI · Python 3.11                                               |
| AI        | Google Gemini 2.5 Flash · context-stuffing RAG (1M-token window)    |
| Infra     | Vercel (frontend) · Render (backend) · optional Redis for sessions  |

---

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+

### 1. Clone and set up environment variables

```bash
# Frontend
cp frontend/.env.local.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
# Add your Gemini API key to backend/.env
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## How the AI Chat Works

Instead of vector embeddings + similarity search, the entire knowledge base (resume, project descriptions, bio — ~11k chars total) is loaded directly into Gemini 2.5 Flash's context window on every request. Gemini's 1M-token context comfortably fits everything, so there's no need for Chroma, embeddings, or model downloads.

Trade-off: slightly higher input-token cost per request, but zero infrastructure to maintain and instant updates when the knowledge base changes.

---

## Customization

1. **Knowledge base** — edit the `.md` files in `backend/data/knowledge_base/`:
   - `resume.md` — experience, skills, education
   - `projects.md` — detailed project descriptions
   - `about.md` — bio and work style

2. **Portfolio data** — edit `frontend/lib/data.ts`:
   - `projects[]`, `skills[]`, `experiences[]`, `blogPosts[]`

3. **Branding** — update `frontend/app/layout.tsx` (metadata) and the layout components.

4. **Blog posts** — add `.mdx` files to `frontend/content/blog/`

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=...            # Free tier: aistudio.google.com
RESEND_API_KEY=re_...         # Optional — for the contact form
MY_EMAIL=your@email.com
REDIS_URL=redis://localhost:6379   # Optional — rate limiting + session history
ALLOWED_ORIGINS=http://localhost:3000
LLM_MODEL=gemini-2.5-flash
```

Redis is optional — the backend degrades gracefully if it's unavailable (no rate limiting, no chat history persistence).

---

## Deployment

### Frontend → Vercel
1. Import the repo on vercel.com
2. Root directory: `frontend`
3. Add env var: `NEXT_PUBLIC_API_URL` = your backend URL

### Backend → Render
1. New Web Service → connect repo → root directory `backend`
2. Runtime: Docker (Dockerfile is included)
3. **Region: US (Oregon)** — Gemini's free tier is geo-restricted and blocks calls from some non-US server regions
4. Env vars: `GEMINI_API_KEY`, `ALLOWED_ORIGINS`

---

## Project Structure

```
portfolio/
├── frontend/             # Next.js 14 App Router
│   ├── app/              # Routes
│   ├── components/       # React components
│   ├── content/blog/     # MDX blog posts
│   └── lib/              # API client, data, utils
│
└── backend/              # FastAPI
    ├── routers/          # /chat, /contact, /health
    ├── services/         # LLM (Gemini) + RAG (context stuffing)
    ├── data/knowledge_base/   # Markdown source for the AI clone
    └── main.py           # App entry point
```

---

Made in West Bengal, India 🇮🇳
