from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .ai_service import analyze_intake
from .database import get_run, init_db, save_run
from .models import Pipeline, utc_now_iso
from .schemas import IntakeCreate, RunResponse
from .zapier_service import send_to_zapier


def _cors_origins() -> list[str]:
    raw = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="FrostFlow AI Intake Demo API",
    description="Internal intake triage demo. This API does not provide legal advice.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/intake", response_model=RunResponse)
async def create_intake(intake: IntakeCreate) -> dict[str, Any]:
    run_id = str(uuid4())
    created_at = utc_now_iso()
    pipeline = Pipeline(steps=[])
    pipeline.add("Intake received", "FastAPI", "success")
    pipeline.add("Python validation completed", "Pydantic", "success")

    try:
        analysis, used_openai = analyze_intake(intake)
        pipeline.add(
            "OpenAI structured analysis completed",
            "OpenAI" if used_openai else "Mock AI",
            "success",
            None if used_openai else "OPENAI_API_KEY not configured; deterministic mock analysis used.",
        )
    except Exception as exc:
        pipeline.add("OpenAI structured analysis completed", "OpenAI", "error", str(exc))
        raise HTTPException(status_code=502, detail="AI analysis failed.") from exc

    payload = {
        "run_id": run_id,
        "timestamp": utc_now_iso(),
        "intake": intake.model_dump(),
        "analysis": analysis.model_dump(),
    }
    zapier_status, zapier_note = await send_to_zapier(payload)
    pipeline.add("Zapier webhook triggered", "Zapier", zapier_status, zapier_note)

    if zapier_status == "success":
        pipeline.add("Google Sheet row prepared/created", "Google Sheets", "success")
        pipeline.add("Staff brief generated", "FastAPI", "success")
        pipeline.add("Email notification prepared/sent", "Gmail", "success")
    elif zapier_status == "skipped":
        pipeline.add(
            "Google Sheet row prepared/created",
            "Google Sheets",
            "skipped",
            "Zapier webhook not configured in this demo environment.",
        )
        pipeline.add("Staff brief generated", "FastAPI", "success")
        pipeline.add(
            "Email notification prepared/sent",
            "Gmail",
            "skipped",
            "Zapier webhook not configured in this demo environment.",
        )
    else:
        pipeline.add(
            "Google Sheet row prepared/created",
            "Google Sheets",
            "error",
            "Zapier handoff failed before Google Workspace routing.",
        )
        pipeline.add("Staff brief generated", "FastAPI", "success")
        pipeline.add(
            "Email notification prepared/sent",
            "Gmail",
            "error",
            "Zapier handoff failed before email routing.",
        )

    save_run(run_id, created_at, intake.model_dump(), analysis.model_dump(), pipeline.as_dicts())
    return {
        "run_id": run_id,
        "intake": intake.model_dump(),
        "analysis": analysis.model_dump(),
        "pipeline": pipeline.as_dicts(),
    }


@app.get("/api/runs/{run_id}", response_model=RunResponse)
def read_run(run_id: str) -> dict[str, Any]:
    stored_run = get_run(run_id)
    if stored_run is None:
        raise HTTPException(status_code=404, detail="Run not found.")
    return stored_run
