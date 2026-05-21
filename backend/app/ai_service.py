import json
import os

from openai import OpenAI

from .schemas import Analysis, IntakeCreate


SYSTEM_PROMPT = """
You are an internal intake assistant for a tax and legal firm. You do not provide legal advice.
Your job is to summarize the client's intake, classify the likely practice area, estimate urgency
for internal routing, extract key facts, identify missing information, recommend the next internal
staff action, and suggest follow-up questions. Use cautious language. Do not make legal conclusions,
do not provide legal strategy, and do not promise outcomes. Return only valid JSON matching the
provided schema.
""".strip()


ANALYSIS_SCHEMA = {
    "name": "intake_analysis",
    "schema": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "practice_area": {
                "type": "string",
                "enum": [
                    "Tax Controversy",
                    "Tax Planning",
                    "Estate Planning",
                    "Business Law",
                    "Unsure",
                ],
            },
            "urgency": {"type": "string", "enum": ["Low", "Medium", "High"]},
            "summary": {"type": "string"},
            "key_facts": {"type": "array", "items": {"type": "string"}},
            "missing_information": {"type": "array", "items": {"type": "string"}},
            "recommended_next_step": {"type": "string"},
            "follow_up_questions": {"type": "array", "items": {"type": "string"}},
            "risk_notes": {"type": "array", "items": {"type": "string"}},
        },
        "required": [
            "practice_area",
            "urgency",
            "summary",
            "key_facts",
            "missing_information",
            "recommended_next_step",
            "follow_up_questions",
            "risk_notes",
        ],
    },
    "strict": True,
}


def analyze_intake(intake: IntakeCreate) -> tuple[Analysis, bool]:
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return mock_analysis(intake), False

    base_url = os.getenv("OPENAI_BASE_URL")
    default_headers = {}
    if base_url and "openrouter.ai" in base_url:
        default_headers = {
            "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "https://ai-intake.johnmgibson.com"),
            "X-Title": os.getenv("OPENROUTER_APP_NAME", "AI Intake Form Demo"),
        }

    client = OpenAI(
        api_key=api_key,
        base_url=base_url,
        default_headers=default_headers or None,
    )
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    "Analyze this intake for internal triage only. Return structured JSON.\n\n"
                    f"{intake.model_dump_json(indent=2)}"
                ),
            },
        ],
        response_format={
            "type": "json_schema",
            "json_schema": ANALYSIS_SCHEMA,
        },
        temperature=0.2,
    )
    content = response.choices[0].message.content or "{}"
    return Analysis.model_validate(json.loads(content)), True


def mock_analysis(intake: IntakeCreate) -> Analysis:
    text = f"{intake.description} {intake.notes or ''}".lower()
    is_tax_notice = any(term in text for term in ["irs", "cp504", "levy", "tax", "notice"])
    has_deadline = bool(intake.deadline and intake.deadline.strip())
    deadline_text = intake.deadline.strip() if intake.deadline else "None provided"
    urgency = "High" if any(term in text for term in ["levy", "deadline", "notice", "fast"]) else "Medium"
    if not has_deadline and urgency == "High":
        urgency = "Medium"

    practice_area = "Tax Controversy" if is_tax_notice else intake.practice_area_guess
    return Analysis(
        practice_area=practice_area,
        urgency=urgency,
        summary=(
            f"{intake.full_name} submitted an intake describing a possible "
            f"{practice_area.lower()} matter. Staff should review the facts before making any "
            "legal or tax assessment."
        ),
        key_facts=[
            f"Client selected intake category: {intake.practice_area_guess}.",
            f"Client description: {intake.description}",
            f"Important date or deadline provided: {deadline_text}",
        ],
        missing_information=[
            "Copies of notices, letters, or relevant documents.",
            "Preferred contact method and availability for follow-up.",
            "Timeline of prior communications with the IRS, agency, or other parties.",
            "Whether any prior advisor or representative is involved.",
        ],
        recommended_next_step=(
            "Route to an intake coordinator for document collection and conflict/scope screening. "
            "If the deadline is immediate, flag for same-business-day staff review."
        ),
        follow_up_questions=[
            "Can you upload or send the notice or document you received?",
            "What exact deadline or response date appears on the notice?",
            "Have you already contacted the IRS, agency, or another professional about this?",
            "What outcome are you hoping staff can help evaluate?",
        ],
        risk_notes=[
            "Mock analysis mode was used because OPENAI_API_KEY is not configured.",
            "This is intake triage only and should not be treated as legal advice.",
            "Staff should verify all dates, amounts, and documents before relying on the summary.",
        ],
    )
