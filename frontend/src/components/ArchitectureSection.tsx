import { Network } from "lucide-react";

export function ArchitectureSection() {
  return (
    <section className="architecture" aria-labelledby="architecture-heading">
      <div className="section-title">
        <Network size={22} aria-hidden="true" />
        <div>
          <p className="eyebrow">Technical architecture</p>
          <h2 id="architecture-heading">Built for practical internal automation</h2>
        </div>
      </div>
      <p>
        This demo uses a React frontend for intake, a Python FastAPI backend for validation and AI
        orchestration, OpenAI for structured analysis, and an optional Zapier webhook to route
        results into Google Workspace tools like Sheets, Docs, and Gmail.
      </p>
      <pre className="diagram">{`Client Intake Form
  -> FastAPI Backend
  -> OpenAI Structured Analysis
  -> Zapier Webhook
  -> Google Sheets / Docs / Gmail
  -> Staff Review`}</pre>
      <div className="readme-note">
        Public GitHub README includes local setup, Docker Compose deployment, Zapier configuration,
        safety notes, and future improvements.
      </div>
    </section>
  );
}

