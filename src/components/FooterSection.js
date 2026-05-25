function FooterSection() {
  return (
    <footer className="lynkos-footer" aria-label="Site footer">
      <div className="lynkos-footer-main">
        <div className="lynkos-footer-cta">
          <div className="lynkos-footer-cta-inner">
            <h2 className="lynkos-footer-cta-title business-model-title">
              Join the <span>verified network.</span>
            </h2>
            <p className="lynkos-footer-cta-description">
              Post once. Structure once. Verify once. Distribute everywhere.
            </p>
            <div className="lynkos-footer-cta-actions">
              <a className="lynkos-footer-cta-btn lynkos-footer-cta-btn-primary" href="/provider">
                Connect as provider <span aria-hidden="true">→</span>
              </a>
              <a className="lynkos-footer-cta-btn lynkos-footer-cta-btn-secondary" href="/supply">
                Submit supply
              </a>
              <a className="lynkos-footer-cta-link" href="/access">
                Request access
              </a>
            </div>
            <p className="lynkos-footer-cta-note">“AI can answer. Lynk helps it act.”</p>
          </div>
        </div>
        <div className="lynkos-footer-panel lynkos-footer-panel-left">
          <h2 className="lynkos-footer-brand">LynkOS</h2>
          <p className="lynkos-footer-label">Subscribe to our news letter</p>
          <form className="lynkos-footer-subscribe" onSubmit={(event) => event.preventDefault()}>
            <input type="email" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="lynkos-footer-meta">
            <p className="lynkos-footer-heading">SOCIALS</p>
            <p className="lynkos-footer-links">FACEBOOK • LINKEDIN • X</p>
          </div>
        </div>

        <div className="lynkos-footer-panel lynkos-footer-panel-right">
          <h3 className="lynkos-footer-copy-head">
            Anyone can connect. Lynk verifies.
            <br />
            Apps and agents discover. Users act.
          </h3>
          <p className="lynkos-footer-app-title">LynkOS</p>
          <p className="lynkos-footer-app-copy">
            The first app built on Lynk Network. Student housing, jobs, services and onboarding.
          </p>

          <div className="lynkos-footer-nav">
            <p className="lynkos-footer-heading">NAVIGATION</p>
            <p className="lynkos-footer-links">HOME • SERVICES • ABOUT • CONTACT</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
