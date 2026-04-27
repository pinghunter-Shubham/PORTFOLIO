# AI Engineer Portfolio

A world-class portfolio website with an embedded AI clone — built with Next.js 14, FastAPI, and Claude.

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Next.js 14 · TypeScript · Tailwind · Framer Motion · Three.js |
| Backend   | FastAPI · Python 3.11 · LangChain · Anthropic Claude |
| AI        | RAG pipeline · Chroma vector store · Claude claude-sonnet-4-20250514 |
| Infra     | Redis · Docker Compose · Vercel · Render        |

---

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Redis (or Docker)

### 1. Clone and set up environment variables

```bash
# Frontend
cp frontend/.env.local.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
# Fill in your API keys in backend/.env
```

### 2. Start with Docker Compose (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 3. Start manually

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Customization

### Fill in your information

1. **Knowledge base** — edit the `.md` files in `backend/data/knowledge_base/`:
   - `resume.md` — your experience, skills, education
   - `projects.md` — detailed project descriptions
   - `about.md` — your philosophy and work style

2. **Portfolio data** — edit `frontend/lib/data.ts`:
   - `projects[]` — your actual projects
   - `skills[]` — your skill set
   - `experiences[]` — your work history
   - `blogPosts[]` — your blog metadata

3. **Branding** — update in `frontend/app/layout.tsx`:
   - Site title, description, OG metadata

4. **Contact/Social** — update links in:
   - `frontend/components/sections/Contact.tsx`
   - `frontend/components/layout/Footer.tsx`

5. **Blog posts** — add `.mdx` files to `frontend/content/blog/`

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (`backend/.env`)
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...          # Used for embeddings (text-embedding-3-small)
RESEND_API_KEY=re_...          # For contact form emails
MY_EMAIL=your@email.com
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```
Set `NEXT_PUBLIC_API_URL` to your Render backend URL in Vercel dashboard.

### Backend → Render
1. Push to GitHub
2. Create a new Web Service on Render
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `backend/.env.example`

---

## Project Structure

```
portfolio/
├── frontend/          # Next.js 14 App
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   │   ├── cursor/    # Custom cursor
│   │   ├── layout/    # Navbar, Footer
│   │   ├── sections/  # Page sections
│   │   └── ui/        # Reusable UI components
│   ├── content/blog/  # MDX blog posts
│   └── lib/           # API client, data, utils
│
├── backend/           # FastAPI Python
│   ├── routers/       # API route handlers
│   ├── services/      # Business logic (LLM, RAG, email)
│   ├── data/          # Knowledge base markdown files
│   └── main.py        # App entry point
│
└── docker-compose.yml
```

---

Built with Next.js, FastAPI & Claude — Made in Hyderabad, India 🇮🇳
