import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Analysis } from "../types";

interface AnalysisResultProps {
  analysis: Analysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <section className="panel" aria-labelledby="analysis-heading">
      <div className="section-title">
        <CheckCircle2 size={22} aria-hidden="true" />
        <div>
          <p className="eyebrow">AI analysis result</p>
          <h2 id="analysis-heading">Structured internal triage</h2>
        </div>
      </div>

      <div className="metrics">
        <div>
          <span>Practice area</span>
          <strong>{analysis.practice_area}</strong>
        </div>
        <div>
          <span>Urgency</span>
          <strong className={`urgency ${analysis.urgency.toLowerCase()}`}>{analysis.urgency}</strong>
        </div>
      </div>

      <p className="summary">{analysis.summary}</p>

      <ListBlock title="Key facts" items={analysis.key_facts} />
      <ListBlock title="Missing information" items={analysis.missing_information} />
      <div className="callout">
        <strong>Recommended internal next step</strong>
        <p>{analysis.recommended_next_step}</p>
      </div>
      <ListBlock title="Suggested staff follow-up questions" items={analysis.follow_up_questions} />
      <div className="risk-block">
        <div className="risk-title">
          <AlertTriangle size={18} aria-hidden="true" />
          <strong>Risk/sensitivity notes</strong>
        </div>
        <ul>
          {analysis.risk_notes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="list-block">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

