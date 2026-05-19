from __future__ import annotations

import json
import os
import sqlite3
from pathlib import Path
from typing import Any


def _database_path() -> Path:
    database_url = os.getenv("DATABASE_URL", "sqlite:///./frostflow.db")
    if not database_url.startswith("sqlite:///"):
        raise ValueError("Only sqlite:/// DATABASE_URL values are supported by this demo.")
    path = database_url.replace("sqlite:///", "", 1)
    return Path(path)


def get_connection() -> sqlite3.Connection:
    db_path = _database_path()
    if db_path.parent != Path("."):
        db_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS runs (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                intake_json TEXT NOT NULL,
                analysis_json TEXT NOT NULL,
                pipeline_json TEXT NOT NULL
            )
            """
        )


def save_run(
    run_id: str,
    created_at: str,
    intake: dict[str, Any],
    analysis: dict[str, Any],
    pipeline: list[dict[str, Any]],
) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT OR REPLACE INTO runs (
                id, created_at, intake_json, analysis_json, pipeline_json
            ) VALUES (?, ?, ?, ?, ?)
            """,
            (
                run_id,
                created_at,
                json.dumps(intake),
                json.dumps(analysis),
                json.dumps(pipeline),
            ),
        )


def get_run(run_id: str) -> dict[str, Any] | None:
    with get_connection() as connection:
        row = connection.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
    if row is None:
        return None
    return {
        "run_id": row["id"],
        "intake": json.loads(row["intake_json"]),
        "analysis": json.loads(row["analysis_json"]),
        "pipeline": json.loads(row["pipeline_json"]),
    }
