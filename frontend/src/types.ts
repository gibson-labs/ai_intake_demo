export type PracticeArea =
  | "Tax Controversy"
  | "Tax Planning"
  | "Estate Planning"
  | "Business Law"
  | "Unsure";

export type Urgency = "Low" | "Medium" | "High";
export type PipelineStatus = "pending" | "success" | "skipped" | "error";

export interface IntakePayload {
  full_name: string;
  email: string;
  phone: string;
  practice_area_guess: PracticeArea;
  description: string;
  deadline: string | null;
  notes: string | null;
}

export interface Analysis {
  practice_area: PracticeArea;
  urgency: Urgency;
  summary: string;
  key_facts: string[];
  missing_information: string[];
  recommended_next_step: string;
  follow_up_questions: string[];
  risk_notes: string[];
}

export interface PipelineStep {
  label: string;
  tool: string;
  status: PipelineStatus;
  timestamp: string | null;
  note: string | null;
}

export interface IntakeResponse {
  run_id: string;
  intake: IntakePayload;
  analysis: Analysis;
  pipeline: PipelineStep[];
}

