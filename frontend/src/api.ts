import type { IntakePayload, IntakeResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function submitIntake(payload: IntakePayload): Promise<IntakeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to analyze intake.");
  }

  return response.json();
}

