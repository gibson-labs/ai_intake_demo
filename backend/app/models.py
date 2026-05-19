from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from .schemas import PipelineStep, PipelineStatus


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class Pipeline:
    steps: list[PipelineStep]

    def add(
        self,
        label: str,
        tool: str,
        status: PipelineStatus,
        note: str | None = None,
        timestamp: bool = True,
    ) -> None:
        self.steps.append(
            PipelineStep(
                label=label,
                tool=tool,
                status=status,
                timestamp=utc_now_iso() if timestamp else None,
                note=note,
            )
        )

    def as_dicts(self) -> list[dict]:
        return [step.model_dump() for step in self.steps]
