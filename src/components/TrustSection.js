const TRUST_LEVELS = [
  {
    level: "Level 0",
    name: "Connected",
    detail: "Provider has joined the network but cannot publish trusted listings yet.",
    status: "Entry",
  },
  {
    level: "Level 1",
    name: "Submitted",
    detail: "Provider can submit supply and profile data for trust review.",
    status: "Review",
  },
  {
    level: "Level 2",
    name: "Verified",
    detail: "Identity and listing checks are passed and provider becomes discoverable.",
    status: "Visible",
  },
  {
    level: "Level 3",
    name: "Trusted",
    detail: "Strong operating history unlocks leads, applications, and managed messaging.",
    status: "Operational",
  },
  {
    level: "Level 4",
    name: "Partner",
    detail: "Deep API and agent integration enables direct high-volume transactions.",
    status: "Scale",
  },
];

function TrustSection() {
  return (
    <section className="trust-section" id="trust-model">
      <div className="trust-inner">
        <header className="business-model-header trust-header">
          <p className="business-model-kicker">Trust</p>
          <h2 className="business-model-title">
            Open to connect. Verified to publish. <span className="business-model-title-accent">Trusted to transact.</span>
          </h2>
          <p className="business-model-subtitle">
            Every provider can join. Trust levels progressively unlock visibility, workflow access,
            and transaction capability.
          </p>
        </header>

        <div className="trust-rail" role="list" aria-label="Provider trust progression">
          {TRUST_LEVELS.map((item, index) => {
            const progress = ((index + 1) / TRUST_LEVELS.length) * 100;
            return (
              <article className="trust-step" key={item.name} role="listitem">
                <div className="trust-step-head">
                  <div className="trust-step-labels">
                    <p className="trust-level">{item.level}</p>
                    <h3>{item.name}</h3>
                  </div>
                  <p className="trust-status">{item.status}</p>
                </div>

                <div className="trust-progress" aria-hidden="true">
                  <span style={{ width: `${progress}%` }} />
                </div>

                <div className="trust-step-body">
                  <span className="trust-step-number">{String(index + 1).padStart(2, "0")}</span>
                  <p>{item.detail}</p>
                </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
