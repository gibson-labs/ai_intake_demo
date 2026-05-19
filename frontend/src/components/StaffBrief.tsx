import { FileText } from "lucide-react";
import type { IntakeResponse } from "../types";

interface StaffBriefProps {
  result: IntakeResponse;
}

export function StaffBrief({ result }: StaffBriefProps) {
  const { intake, analysis } = result;

  return (
    <section className="panel brief-panel" aria-labelledby="brief-heading">
      <div className="section-title">
        <FileText size={22} aria-hidden="true" />
        <div>
          <p className="eyebrow">Staff brief preview</p>
          <h2 id="brief-heading">Readable handoff for nontechnical staff</h2>
        </div>
      </div>

      <div className="brief">
        <div className="brief-row">
          <span>Client</span>
          <strong>{intake.full_name}</strong>
        </div>
        <div className="brief-row">
          <span>Contact</span>
          <strong>
            {intake.email} | {intake.phone}
          </strong>
        </div>
        <div className="brief-row">
          <span>Practice Area</span>
          <strong>{analysis.practice_area}</strong>
        </div>
        <div className="brief-row">
          <span>Urgency</span>
          <strong>{analysis.urgency}</strong>
        </div>
        <BriefSection title="Summary" content={analysis.summary} />
        <BriefList title="Key Facts" items={analysis.key_facts} />
        <BriefList title="Missing Information" items={analysis.missing_information} />
        <BriefSection title="Recommended Next Step" content={analysis.recommended_next_step} />
        <BriefList title="Follow-up Questions" items={analysis.follow_up_questions} />
      </div>
    </section>
  );
}

function BriefSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="brief-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

function BriefList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="brief-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

