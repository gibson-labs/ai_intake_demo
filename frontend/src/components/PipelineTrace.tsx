import { Activity } from "lucide-react";
import type { PipelineStep } from "../types";

interface PipelineTraceProps {
  pipeline: PipelineStep[];
}

export function PipelineTrace({ pipeline }: PipelineTraceProps) {
  return (
    <section className="panel" aria-labelledby="pipeline-heading">
      <div className="section-title">
        <Activity size={22} aria-hidden="true" />
        <div>
          <p className="eyebrow">Automation trace</p>
          <h2 id="pipeline-heading">Workflow visibility</h2>
        </div>
      </div>

      <ol className="timeline">
        {pipeline.map((step, index) => (
          <li key={`${step.label}-${index}`} className={`timeline-step ${step.status}`}>
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-content">
              <div className="timeline-top">
                <strong>{step.label}</strong>
                <span className={`status ${step.status}`}>{step.status}</span>
              </div>
              <div className="timeline-meta">
                <span>{step.tool}</span>
                {step.timestamp ? <span>{new Date(step.timestamp).toLocaleString()}</span> : null}
              </div>
              {step.note ? <p>{step.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

