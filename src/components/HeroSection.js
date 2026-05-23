import GlobeNetwork from "./globe/GlobeNetwork";

function HeroSection({ startGlobeAnimation }) {
  return (
    <section className="hero-section">
      <div className="hero-background-layer">
        <div className="hero-visual-frame">
          <GlobeNetwork startAnimation={startGlobeAnimation} />
        </div>
      </div>

      <div className="hero-content-layer">
        <div className="hero-copy">
          <h1 className="hero-title">The verified network for real-world action.</h1>
          <p className="hero-description">
            Lynk Network lets anyone connect and submit real-world supply —
            jobs, housing, travel, services, offers, talent, events, bookings and
            more. Lynk structures it, verifies it, and makes it discoverable to
            people, apps, and AI agents.
          </p>
          <div className="hero-actions">
            <a className="hero-button hero-button-primary" href="/supply">
              Post supply
            </a>
            <a className="hero-button hero-button-secondary" href="/agent-demo">
              See agent demo
            </a>
          </div>
        </div>

        <div className="hero-bottom-left">
          <p className="hero-footnote">
            “Anyone can connect. Lynk verifies. Apps and agents discover. Users
            act.”
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
