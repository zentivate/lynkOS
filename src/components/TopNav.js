const NAV_ITEMS = [
  "Home",
  "Silos",
  "WhatsApp Demo",
  "Agent Demo",
  "Provider",
  "Discover",
  "Admin",
  "Network",
];

function TopNav() {
  return (
    <header className="top-nav">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-mark-core" />
        </div>
        <div className="brand-copy">
          <span className="brand-name">Lynk</span>
          <span className="brand-subtitle">Network</span>
        </div>
      </div>

      <nav className="top-nav-links" aria-label="Primary">
        {NAV_ITEMS.map((item, index) => (
          <a
            key={item}
            className={index === 0 ? "top-nav-link is-active" : "top-nav-link"}
            href="/"
          >
            {item}
          </a>
        ))}
      </nav>

      <a className="top-nav-cta" href="/provider">
        Connect provider
      </a>
    </header>
  );
}

export default TopNav;
