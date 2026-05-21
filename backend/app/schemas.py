from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


PracticeArea = Literal[
    "Tax Controversy",
    "Tax Planning",
    "Estate Planning",
    "Business Law",
    "Unsure",
]
Urgency = Literal["Low", "Medium", "High"]
PipelineStatus = Literal["pending", "success", "skipped", "error"]


class IntakeCreate(BaseModel):
    full_name: str = Field(..., min_length=2)
    email: EmailStr
    phone: str = Field(..., min_length=7)
    practice_area_guess: PracticeArea
    description: str = Field(..., min_length=20)
    deadline: Optional[str] = None
    notes: Optional[str] = None


class Intake(IntakeCreate):
    pass


class Analysis(BaseModel):
    practice_area: PracticeArea
    urgency: Urgency
    summary: str
    key_facts: list[str]
    missing_information: list[str]
    recommended_next_step: str
    follow_up_questions: list[str]
    risk_notes: list[str]


class PipelineStep(BaseModel):
    label: str
    tool: str
    status: PipelineStatus
    timestamp: Optional[str] = None
    note: Optional[str] = None


class RunResponse(BaseModel):
    run_id: str
    intake: Intake
    analysis: Analysis
    pipeline: list[PipelineStep]
