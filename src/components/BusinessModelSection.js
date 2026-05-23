const PRICING_TIERS = [
  {
    id: "starter",
    label: "Universities · SaaS per student",
    name: "Starter",
    price: "£5",
    priceSuffix: "/student/year",
    features: [
      "Onboarding journey",
      "Student app (WorldLynk)",
      "Basic dashboard",
      "Email & chat support",
    ],
    cta: "Pilot",
    ctaVariant: "secondary",
  },
  {
    id: "growth",
    label: "Universities · SaaS per student",
    name: "Growth",
    price: "£8–£12",
    priceSuffix: "/student/year",
    features: [
      "AI insights & cohort signals",
      "Support workflows",
      "SIS / CRM / LMS integrations",
      "Dedicated success manager",
    ],
    cta: "Most popular",
    ctaVariant: "primary",
    badge: "Most popular",
    highlighted: true,
  },
  {
    id: "enterprise",
    label: "Universities · SaaS per student",
    name: "Enterprise",
    price: "£15+",
    priceSuffix: "/student/year",
    features: [
      "Full context engine",
      "Custom workflows & branding",
      "Dedicated instance",
      "Advanced analytics & SLAs",
    ],
    cta: "Contact us",
    ctaVariant: "secondary",
  },
];

function BuildingIcon() {
  return (
    <svg
      aria-hidden="true"
      className="business-model-tier-icon"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 20V8.5L12 4l8 4.5V20H4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9 20v-5h6v5M9 10h1.5M13.5 10H15M9 13.5h1.5M13.5 13.5H15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="business-model-check-icon"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 8.2 6.4 11 12.5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BusinessModelSection() {
  return (
    <section className="business-model-section" id="business-model">
      <div className="business-model-inner">
        <header className="business-model-header">
          <p className="business-model-kicker">Business model</p>
          <h2 className="business-model-title">
            Three <span className="business-model-title-accent">revenue layers.</span>
          </h2>
          <p className="business-model-subtitle">
            A SaaS foundation for universities. Optional premium for students.
            Marketplace economics for verified providers.
          </p>
        </header>

        <div className="business-model-grid">
          {PRICING_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={
                tier.highlighted
                  ? "business-model-card is-highlighted"
                  : "business-model-card"
              }
            >
              {tier.badge ? (
                <span className="business-model-badge">{tier.badge}</span>
              ) : null}

              <p className="business-model-tier-label">{tier.label}</p>

              <div className="business-model-tier-head">
                <BuildingIcon />
                <h3>{tier.name}</h3>
              </div>

              <div className="business-model-price">
                <span className="business-model-price-value">{tier.price}</span>
                <span className="business-model-price-suffix">{tier.priceSuffix}</span>
              </div>

              <ul className="business-model-features">
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                className={
                  tier.ctaVariant === "primary"
                    ? "business-model-cta business-model-cta-primary"
                    : "business-model-cta business-model-cta-secondary"
                }
                href="/provider"
              >
                {tier.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BusinessModelSection;
