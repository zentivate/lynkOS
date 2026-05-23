import { useState } from "react";

const FLOW_STEPS = [
  {
    id: "01",
    label: "Provider message",
    summary:
      "Incoming supply from WhatsApp, Teams, voice, and WorldLynk app in natural language.",
    panelTitle: "Raw provider message",
    panelSubtitle: "Source channels",
    message:
      "\"Need 3 weekend staff in Egham. £12/hr. Friday to Sunday. Immediate start.\"",
    badge: "Live input",
    fields: [
      ["Channel", "WhatsApp"],
      ["Language", "English"],
      ["Timestamp", "Now"],
      ["Intent", "Hiring request"],
    ],
    actions: ["Queue", "Review"],
  },
  {
    id: "02",
    label: "AI structures",
    summary:
      "Lynk converts unstructured text into a normalized supply object with typed fields.",
    panelTitle: "Structured supply object",
    panelSubtitle: "AI extraction",
    message: "Normalized with role, location, pay, availability, and source metadata.",
    badge: "Structured",
    fields: [
      ["Type", "Job"],
      ["Role", "Weekend Staff"],
      ["Location", "Egham"],
      ["Pay", "£12/hr"],
      ["Availability", "Fri-Sun"],
      ["Source", "WhatsApp"],
    ],
    actions: ["Edit", "Save"],
  },
  {
    id: "03",
    label: "Verification",
    summary:
      "Identity, source reliability, and consistency checks run before publishing.",
    panelTitle: "Verification checks",
    panelSubtitle: "Trust layer",
    message: "Entity checks, source confidence, and spam/risk filters are applied.",
    badge: "In progress",
    fields: [
      ["Identity", "Verified"],
      ["Source trust", "High"],
      ["Risk score", "Low"],
      ["Status", "Approved"],
    ],
    actions: ["View checks", "Override"],
  },
  {
    id: "04",
    label: "Discovery",
    summary:
      "Verified supply is indexed for search, feed ranking, and agent-compatible retrieval.",
    panelTitle: "Discovery index",
    panelSubtitle: "Distribution layer",
    message: "Published to people, apps, and agents with ranking and relevance signals.",
    badge: "Indexed",
    fields: [
      ["Search", "Enabled"],
      ["Ranking", "Contextual"],
      ["Geo reach", "Regional"],
      ["Freshness", "Real-time"],
    ],
    actions: ["Preview", "Re-rank"],
  },
  {
    id: "05",
    label: "User action",
    summary:
      "Users and agents trigger outcomes: apply, message, book, or transact immediately.",
    panelTitle: "Action outcomes",
    panelSubtitle: "Execution layer",
    message: "Supply converts into real-world actions with traceable interaction history.",
    badge: "Active",
    fields: [
      ["Applies", "Open"],
      ["Messages", "Enabled"],
      ["Bookings", "Enabled"],
      ["Conversions", "Tracked"],
    ],
    actions: ["Apply", "Message", "Save"],
  },
];

function NetworkFlowSection() {
  const [activeStepId, setActiveStepId] = useState(FLOW_STEPS[0].id);
  const activeStep =
    FLOW_STEPS.find((step) => step.id === activeStepId) ?? FLOW_STEPS[0];

  return (
    <section className="network-flow-section">
      <div className="network-flow-shell">
        <aside className="network-flow-sidebar">
          <h2 className="network-flow-title">Lynk Network</h2>
          <p className="network-flow-summary">
            A clear pipeline for turning unstructured provider messages into
            verified, discoverable, real-world actions.
          </p>

          <nav className="network-flow-menu" aria-label="Flow steps">
            {FLOW_STEPS.map((step) => {
              const isActive = step.id === activeStepId;

              return (
                <button
                  key={step.id}
                  className={isActive ? "is-active" : undefined}
                  onClick={() => setActiveStepId(step.id)}
                  type="button"
                >
                  <span className="network-flow-menu-step">Step {step.id}</span>
                  <span className="network-flow-menu-label">{step.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="network-flow-stage">
          <div className="network-flow-stage-head">
            <p className="network-flow-stage-kicker">Step {activeStep.id}</p>
            <h3>{activeStep.label}</h3>
            <p>{activeStep.summary}</p>
          </div>

          <div className="network-flow-panels">
            <article className="network-flow-panel">
              <p className="network-flow-panel-title">{activeStep.panelTitle}</p>
              <p className="network-flow-panel-subtitle">{activeStep.panelSubtitle}</p>
              <p className="network-flow-message">{activeStep.message}</p>
            </article>

            <article className="network-flow-panel">
              <div className="network-flow-panel-head">
                <p className="network-flow-panel-title">{activeStep.label}</p>
                <span className="network-flow-pill">{activeStep.badge}</span>
              </div>
              <div className="network-flow-grid">
                {activeStep.fields.map(([key, value]) => (
                  <div key={key}>
                    <span>{key}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="network-flow-actions">
                {activeStep.actions.map((action) => (
                  <button key={action} type="button">
                    {action}
                  </button>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NetworkFlowSection;
