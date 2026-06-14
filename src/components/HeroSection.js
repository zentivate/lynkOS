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
        <aside className="hero-worldlynk-card" aria-label="WorldLynk app summary">
          <img
            className="hero-worldlynk-logo"
            src="/medias/wordlynk.png"
            alt="WorldLynk"
          />
          <p className="hero-worldlynk-wordmark">WorldLynk</p>
          <p className="hero-worldlynk-lead">
            The first consumer app powered by Lynk Network
          </p>
          <p className="hero-worldlynk-copy">
            Starting with international students, relocation, jobs, housing, and
            services
          </p>
        </aside>

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

        <aside className="hero-problem-solution-card" aria-label="Problem and solution summary">
          <div className="hero-problem-solution-section">
            <div className="hero-problem-solution-label hero-problem-solution-label-problem">
              <span className="hero-problem-solution-icon" aria-hidden="true">
                <svg
                  className="hero-problem-solution-svg hero-problem-solution-svg-problem"
                  viewBox="0 0 30 30"
                  role="presentation"
                >
                  <circle cx="15" cy="4.5" r="1.8" />
                  <circle cx="7.5" cy="8.2" r="1.8" />
                  <circle cx="22.5" cy="8.2" r="1.8" />
                  <circle cx="4.2" cy="15" r="1.8" />
                  <circle cx="11" cy="12.4" r="1.8" />
                  <circle cx="19" cy="12.4" r="1.8" />
                  <circle cx="25.8" cy="15" r="1.8" />
                  <circle cx="8.8" cy="21.6" r="1.8" />
                  <circle cx="15" cy="17.6" r="1.8" />
                  <circle cx="21.2" cy="21.6" r="1.8" />
                  <circle cx="15" cy="26" r="1.8" />
                </svg>
              </span>
              <span>Problem</span>
            </div>
            <p className="hero-problem-solution-copy">
              Scattered platforms, chats, portals, and websites.
            </p>
          </div>

          <div className="hero-problem-solution-divider" aria-hidden="true">
            <span className="hero-problem-solution-arrow"></span>
          </div>

          <div className="hero-problem-solution-section">
            <div className="hero-problem-solution-label hero-problem-solution-label-solution">
              <span className="hero-problem-solution-icon" aria-hidden="true">
                <svg
                  className="hero-problem-solution-svg hero-problem-solution-svg-solution"
                  viewBox="0 0 30 30"
                  role="presentation"
                >
                  <circle cx="15" cy="4.5" r="2.3" />
                  <circle cx="4.8" cy="15" r="2.3" />
                  <circle cx="25.2" cy="15" r="2.3" />
                  <circle cx="15" cy="25.5" r="2.3" />
                  <rect x="8.4" y="8.4" width="13.2" height="13.2" rx="1.8" />
                </svg>
              </span>
              <span>Solution</span>
            </div>
            <p className="hero-problem-solution-copy">
              One verified supply graph.
            </p>
          </div>
        </aside>

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
