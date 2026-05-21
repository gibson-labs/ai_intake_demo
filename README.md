# AI Intake Form Demo

AI Intake Form Demo is a small workflow automation project that turns messy legal/tax intake submissions into structured internal staff briefs using React, Python, OpenAI structured output, SQLite, and an optional Zapier webhook.

This demo was built to show how AI and automation can support internal legal operations without replacing professional judgment. It focuses on intake triage, summarization, missing-information detection, and workflow routing.

## Why I Built It

The goal is to demonstrate practical AI Solutions Engineer skills in a realistic business workflow: taking unstructured intake details, validating them, using an LLM safely, saving the run locally, and optionally routing the result into Google Workspace-style tools through Zapier.

It is intentionally not a full SaaS product. There is no auth, no CRM, no payment workflow, and no legal advice chatbot.

## What It Demonstrates

- Python and FastAPI backend development
- OpenAI structured JSON output with a mock fallback mode
- Pydantic validation for intake and response contracts
- SQLite persistence for local demo runs
- Optional Zapier webhook handoff for Google Sheets, Docs, Gmail, or similar tools
- React and TypeScript frontend with a clean staff-facing workflow
- Docker Compose deployment suitable for a VPS behind Nginx Proxy Manager or Cloudflare
- Clear explanation of a technical workflow for nontechnical staff

## Architecture

```text
Client Intake Form
  -> FastAPI Backend
  -> OpenAI Structured Analysis
  -> Zapier Webhook
  -> Google Sheets / Docs / Gmail
  -> Staff Review
```

The React frontend collects the intake and calls the FastAPI backend. The backend validates input, stores the run, calls OpenAI when configured, falls back to deterministic mock analysis when no API key is present, posts to Zapier when configured, and returns an automation trace for the UI.

## Tech Stack

- Frontend: React, TypeScript, Vite, plain CSS
- Backend: Python, FastAPI, Pydantic, OpenAI Python SDK
- Persistence: SQLite
- Automation: Optional Zapier webhook
- Deployment: Docker Compose, Nginx frontend container, FastAPI backend container

## Features

- Demo-only legal/tax intake form
- Load Sample Intake button with a realistic IRS CP504-style scenario
- AI analysis result with practice area, urgency, summary, key facts, missing information, next step, follow-up questions, and risk notes
- Automation trace with status, timestamp, and tool label for each step
- Clear skipped status when Zapier is not configured
- Staff brief preview written for a nontechnical employee
- Plain-English architecture section
- Runs without OpenAI or Zapier configured

## Safety and Legal Disclaimer

This project does not provide legal advice. It is an internal intake triage and staff-assistance demo only. It does not make legal conclusions, promise outcomes, or replace review by qualified professionals.

Do not enter real client data into a public demo environment.

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/api/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:8000`.

## Environment Variables

Copy `.env.example` to `.env` for Docker Compose or export the variables in your shell for local backend development.

```bash
cp .env.example .env
```

Variables:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=
OPENROUTER_API_KEY=
OPENROUTER_SITE_URL=https://ai-intake.johnmgibson.com
OPENROUTER_APP_NAME=AI Intake Form Demo
ZAPIER_WEBHOOK_URL=
DATABASE_URL=sqlite:///./data/frostflow.db
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:8080
```

If no direct OpenAI or OpenRouter key is configured, the backend uses deterministic mock analysis so the demo still works. If `ZAPIER_WEBHOOK_URL` is empty, the Zapier and Google Workspace trace steps are marked as skipped.

## OpenAI or OpenRouter Configuration

For direct OpenAI API usage, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL`.

For OpenRouter usage, set:

```text
OPENROUTER_API_KEY=sk-or-your-openrouter-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=https://ai-intake.johnmgibson.com
OPENROUTER_APP_NAME=AI Intake Form Demo
```

OpenRouter is OpenAI-compatible, so the backend still uses the modern OpenAI Python SDK while pointing it at OpenRouter's base URL. Use an OpenRouter model ID that supports structured outputs. OpenRouter documents `response_format` with `json_schema` for compatible models.

The backend requests structured JSON matching this schema:

```json
{
  "practice_area": "Tax Controversy | Tax Planning | Estate Planning | Business Law | Unsure",
  "urgency": "Low | Medium | High",
  "summary": "string",
  "key_facts": ["string"],
  "missing_information": ["string"],
  "recommended_next_step": "string",
  "follow_up_questions": ["string"],
  "risk_notes": ["string"]
}
```

The system prompt explicitly states that the assistant is not giving legal advice, is assisting internal staff only, should avoid legal conclusions, should avoid promising outcomes, and should use cautious language.

## Zapier Workflow Example

Create a Zap with a Webhooks by Zapier trigger:

1. Choose `Catch Hook`.
2. Copy the generated webhook URL.
3. Set `ZAPIER_WEBHOOK_URL` in `.env`.
4. Submit a demo intake.
5. In Zapier, map fields from the payload to actions such as:
   - Create Google Sheets row
   - Create Google Docs brief
   - Send Gmail notification to intake staff

The webhook payload includes `run_id`, `timestamp`, `intake`, and `analysis`.

## Docker Compose

Run the app locally in containers:

```bash
docker compose up --build
```

Open:

```text
http://localhost:8080
```

The frontend container serves the Vite build with Nginx and proxies `/api` to the backend container.

## VPS Deployment Notes

This repo includes a GitHub Actions workflow aligned with the existing Hostinger self-hosted runner pattern:

- `main` uses `docker-compose.yml` and project name `frostflow`
- `dev` uses `docker-compose.dev.yml` and project name `frostflow-dev`
- The frontend service joins the external `proxy` network for Nginx Proxy Manager

On the VPS, create or reuse the Docker network expected by Nginx Proxy Manager:

```bash
docker network create proxy
```

Then point Nginx Proxy Manager or Cloudflare tunnel routing at the frontend container/service port. A typical public subdomain would be:

```text
ai-intake.johnmgibson.com
```

## Screenshots

Add screenshots after deployment:

- Intake form
- AI analysis result
- Automation trace with Zapier skipped or successful
- Staff brief preview

## Future Improvements

- Add file upload for notices and supporting documents
- Add Google Docs generation through Zapier
- Add admin-only run history view
- Add test coverage for backend services
- Add structured logging for webhook failures
- Add configurable practice-area routing rules

## Production Readiness

This is a polished demo, not a production legal operations system. A production version would need authentication, access controls, audit logging, retention policies, encryption review, secret management, privacy review, stronger validation, monitoring, and firm-specific process approvals.
