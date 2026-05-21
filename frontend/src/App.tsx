import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { submitIntake } from "./api";
import { AnalysisResult } from "./components/AnalysisResult";
import { ArchitectureSection } from "./components/ArchitectureSection";
import { IntakeForm } from "./components/IntakeForm";
import { PipelineTrace } from "./components/PipelineTrace";
import { StaffBrief } from "./components/StaffBrief";
import type { IntakePayload, IntakeResponse } from "./types";

const emptyIntake: IntakePayload = {
  full_name: "",
  email: "",
  phone: "",
  practice_area_guess: "Unsure",
  description: "",
  deadline: null,
  notes: null
};

const sampleIntake: IntakePayload = {
  full_name: "Jordan Rivera",
  email: "jordan.rivera@example.com",
  phone: "801-555-0147",
  practice_area_guess: "Unsure",
  description:
    "I got a CP504 notice from the IRS saying I owe around $18,000 from 2021 and they might levy me. I need help fast but I don't know what documents they need.",
  deadline: "Notice says I should respond right away, but I am not sure of the exact date.",
  notes:
    "Client sounded stressed and mentioned they may have moved since filing the 2021 return."
};

export default function App() {
  const [intake, setIntake] = useState<IntakePayload>(emptyIntake);
  const [result, setResult] = useState<IntakeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const response = await submitIntake(intake);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze intake.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="hero">
        <nav>
          <span className="brand">AI Intake Form Demo</span>
          <span className="nav-note">AI intake workflow demo</span>
        </nav>
        <div className="hero-content">
          <p className="eyebrow">AI Solutions Engineer demo project</p>
          <h1>AI Intake Form Demo</h1>
          <p>
            A practical AI workflow demo that turns messy client intake submissions into structured
            internal staff briefs using Python, OpenAI, Zapier, and Google Workspace-style
            automation.
          </p>
          <div className="disclaimer">
            <ShieldCheck size={20} aria-hidden="true" />
            Demo only. This tool does not provide legal advice.
          </div>
        </div>
      </header>

      <section className="overview">
        <div>
          <h2>What this proves</h2>
          <p>
            The app focuses on a real internal workflow: intake triage, summarization,
            missing-information detection, automation routing, and staff-readable output.
          </p>
        </div>
        <div>
          <h2>What it avoids</h2>
          <p>
            It is not a CRM, not a chatbot, not a legal advice product, and not a replacement for
            professional review.
          </p>
        </div>
      </section>

      <div className="workspace">
        <IntakeForm
          value={intake}
          loading={loading}
          onChange={setIntake}
          onSubmit={handleSubmit}
          onLoadSample={() => {
            setIntake(sampleIntake);
            setError(null);
          }}
        />

        {error ? <div className="error-box">{error}</div> : null}

        {result ? (
          <div className="results-grid">
            <AnalysisResult analysis={result.analysis} />
            <PipelineTrace pipeline={result.pipeline} />
            <StaffBrief result={result} />
          </div>
        ) : (
          <section className="empty-state">
            <h2>Run the sample intake to see the full workflow.</h2>
            <p>
              The backend will use OpenAI when configured, or a deterministic mock analysis when no
              API key is present.
            </p>
          </section>
        )}
      </div>

      <ArchitectureSection />
    </main>
  );
}
