import { ClipboardList, Play, Wand2 } from "lucide-react";
import type { IntakePayload, PracticeArea } from "../types";

const practiceAreas: { label: string; value: PracticeArea }[] = [
  { label: "Tax notice, audit, collection, or IRS issue", value: "Tax Controversy" },
  { label: "Tax planning question", value: "Tax Planning" },
  { label: "Estate plan, will, or trust question", value: "Estate Planning" },
  { label: "Business legal question", value: "Business Law" },
  { label: "I am not sure yet", value: "Unsure" }
];

interface IntakeFormProps {
  value: IntakePayload;
  loading: boolean;
  onChange: (value: IntakePayload) => void;
  onSubmit: () => void;
  onLoadSample: () => void;
}

export function IntakeForm({
  value,
  loading,
  onChange,
  onSubmit,
  onLoadSample
}: IntakeFormProps) {
  const update = (field: keyof IntakePayload, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue === "" && (field === "deadline" || field === "notes") ? null : fieldValue
    });
  };

  return (
    <form
      className="panel form-panel"
      aria-labelledby="intake-heading"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="section-title">
        <ClipboardList size={22} aria-hidden="true" />
        <div>
          <p className="eyebrow">Client intake</p>
          <h2 id="intake-heading">Messy submission in, structured triage out</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Full name *
          <input
            value={value.full_name}
            onChange={(event) => update("full_name", event.target.value)}
            placeholder="Jane Example"
            required
            minLength={2}
          />
        </label>
        <label>
          Email *
          <input
            type="email"
            value={value.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="jane@example.com"
            required
          />
        </label>
        <label>
          Phone *
          <input
            type="tel"
            value={value.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="801-555-0198"
            required
            minLength={7}
          />
        </label>
        <label>
          What do you need help with? *
          <select
            value={value.practice_area_guess}
            onChange={(event) => update("practice_area_guess", event.target.value)}
            required
          >
            {practiceAreas.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Description of issue *
        <textarea
          value={value.description}
          onChange={(event) => update("description", event.target.value)}
          rows={6}
          placeholder="Describe the intake in the client’s own words."
          required
          minLength={20}
        />
      </label>

      <div className="form-grid two">
        <label>
          Important date/deadline
          <input
            value={value.deadline ?? ""}
            onChange={(event) => update("deadline", event.target.value)}
            placeholder="e.g. Notice says 30 days"
          />
        </label>
        <label>
          Optional notes
          <input
            value={value.notes ?? ""}
            onChange={(event) => update("notes", event.target.value)}
            placeholder="Anything staff should know"
          />
        </label>
      </div>

      <div className="button-row">
        <button className="secondary" type="button" onClick={onLoadSample}>
          <Wand2 size={18} aria-hidden="true" />
          Load Sample Intake
        </button>
        <button type="submit" disabled={loading}>
          <Play size={18} aria-hidden="true" />
          {loading ? "Analyzing..." : "Analyze Intake"}
        </button>
      </div>
    </form>
  );
}
