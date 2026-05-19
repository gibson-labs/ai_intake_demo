from __future__ import annotations

import os
from typing import Any

import httpx


async def send_to_zapier(payload: dict[str, Any]) -> tuple[str, str]:
    webhook_url = os.getenv("ZAPIER_WEBHOOK_URL")
    if not webhook_url:
        return "skipped", "Zapier webhook not configured in this demo environment."

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(webhook_url, json=payload)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        return "error", f"Zapier webhook failed: {exc}"

    return "success", "Structured intake payload posted to Zapier webhook."
