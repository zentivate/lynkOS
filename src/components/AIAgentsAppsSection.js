import { useState } from "react";
import { Bot, LayoutDashboard } from "lucide-react";

const AI_APP_CARDS = [
  { label: "ChatGPT", image: "/medias/chatgpt.png" },
  { label: "Mistral", image: "/medias/mistral.png" },
  { label: "AI Agents", icon: Bot },
  { label: "Copilot", image: "/medias/copilot.png" },
  { label: "Claude", image: "/medias/claude-logo.svg" },
  { label: "Gemini", image: "/medias/gemini.png" },
  { label: "Perplexity", image: "/medias/perplexity.png" },
  { label: "WhatsApp", image: "/medias/vector-whatsapp-social-media-logo_1093524-447.avif" },
  { label: "Telegram", image: "/medias/telegram.png" },
  { label: "Microsoft Teams", image: "/medias/teams logo.png" },
  { label: "Slack", image: "/medias/slack.png" },
  { label: "University Dashboards", icon: LayoutDashboard },
];

// Arc controls for the scatter layout.
// - `arcYOffset` moves the entire arc up or down.
// - `bulge` increases or decreases the bend of the arc.
// - `bulgeYOffset` moves the bulge point itself up or down.
// - `centerYOffset` moves the control point up or down without changing the endpoints.
// - `startYOffset` and `endYOffset` move the left/right endpoints up or down.
const DEFAULT_ARC_CONTROLS = {
  startX: -20,
  endX: 118,
  centerX: 50,
  arcYOffset: -12.5,
  bulge: 20.6,
  bulgeYOffset: 50.1,
  centerYOffset: 30,
  startYOffset: -50,
  endYOffset: -50,
  gapScale: 0.92,
};

const ARC_BASE_Y = 54;
const ARC_CENTER_BASE_Y = 55;

function getArcGeometry(controls) {
  const start = {
    x: controls.startX,
    y: ARC_BASE_Y + controls.arcYOffset + controls.startYOffset,
  };
  const end = {
    x: controls.endX,
    y: ARC_BASE_Y + controls.arcYOffset + controls.endYOffset,
  };
  const control = {
    x: controls.centerX,
    y:
      ARC_CENTER_BASE_Y +
      controls.arcYOffset +
      controls.centerYOffset +
      controls.bulgeYOffset -
      controls.bulge,
  };

  return { start, control, end };
}

function getQuadraticPoint(t, start, control, end) {
  const mt = 1 - t;
  return {
    x: mt * mt * start.x + 2 * mt * t * control.x + t * t * end.x,
    y: mt * mt * start.y + 2 * mt * t * control.y + t * t * end.y,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getSpreadFraction(baseFraction, gapScale) {
  return clamp(0.5 + (baseFraction - 0.5) * gapScale, 0.01, 0.99);
}

function getArcLengthMap(start, control, end, sampleCount = 240) {
  const samples = [{ t: 0, length: 0 }];
  let totalLength = 0;
  let previous = getQuadraticPoint(0, start, control, end);

  for (let i = 1; i <= sampleCount; i += 1) {
    const t = i / sampleCount;
    const next = getQuadraticPoint(t, start, control, end);
    totalLength += Math.hypot(next.x - previous.x, next.y - previous.y);
    samples.push({ t, length: totalLength });
    previous = next;
  }

  return { samples, totalLength };
}

function getTForLengthFraction(fraction, arcMap) {
  const targetLength = arcMap.totalLength * fraction;
  const { samples } = arcMap;

  for (let i = 1; i < samples.length; i += 1) {
    const prev = samples[i - 1];
    const next = samples[i];
    if (targetLength <= next.length) {
      const segmentLength = next.length - prev.length || 1;
      const local = (targetLength - prev.length) / segmentLength;
      return prev.t + (next.t - prev.t) * local;
    }
  }

  return 1;
}

function ControlField({ label, value, min, max, step, onChange, precision = 2 }) {
  return (
    <label className="ai-agents-controls-field">
      <span>{label}</span>
      <strong>{Number(value).toFixed(precision)}</strong>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function AIAgentsAppsSection() {
  const [controls, setControls] = useState(DEFAULT_ARC_CONTROLS);

  const updateControl = (key) => (nextValue) => {
    setControls((current) => ({
      ...current,
      [key]: Number.parseFloat(nextValue),
    }));
  };

  const { start, control, end } = getArcGeometry(controls);
  const arcMap = getArcLengthMap(start, control, end);
  const pathD = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;

  return (
    <section className="ai-agents-section" aria-label="AI agents and apps">
      <div className="ai-agents-inner">
        <div className="ai-agents-stage">
          <header className="business-model-header ai-agents-header">
            <p className="business-model-kicker">AI agents and apps</p>
            <h2 className="business-model-title">
              Built for the next layer of <span className="business-model-title-accent">agent-native demand.</span>
            </h2>
            <p className="business-model-subtitle">
              Lynk gives AI agents and apps a structured, verified supply layer to discover, reason
              over, and act on. Instead of scraping fragmented listings or closed chats, they can
              connect to live network-ready inventory across jobs, housing, travel, services, and more.
            </p>
          </header>

          <svg className="ai-agents-arc is-hidden" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={pathD} />
          </svg>

          <div className="ai-agents-board" aria-label="AI apps and channel integrations">
            {AI_APP_CARDS.map((card, index) => {
              const baseFraction = AI_APP_CARDS.length === 1 ? 0.5 : index / (AI_APP_CARDS.length - 1);
              const spreadFraction = getSpreadFraction(baseFraction, controls.gapScale);
              const t = getTForLengthFraction(spreadFraction, arcMap);
              const point = getQuadraticPoint(t, start, control, end);
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="ai-agents-card"
                  style={{
                    top: `${point.y}%`,
                    left: `${point.x}%`,
                  }}
                >
                  <span className="ai-agents-card-logo" aria-hidden="true">
                    {Icon ? <Icon size={34} strokeWidth={1.9} /> : <img src={card.image} alt="" />}
                  </span>
                  <span className="ai-agents-card-label">{card.label}</span>
                </article>
              );
            })}
          </div>

          <details className="ai-agents-controls is-hidden" open>
            <summary>Arc Controls</summary>
            <div className="ai-agents-controls-grid">
              <ControlField label="Gap" value={controls.gapScale} min={0.35} max={2.8} step={0.01} onChange={updateControl("gapScale")} />
              <ControlField label="Bulge" value={controls.bulge} min={-20} max={90} step={0.1} onChange={updateControl("bulge")} />
              <ControlField label="Arc Y" value={controls.arcYOffset} min={-80} max={80} step={0.1} onChange={updateControl("arcYOffset")} />
              <ControlField label="Bulge Y" value={controls.bulgeYOffset} min={-80} max={80} step={0.1} onChange={updateControl("bulgeYOffset")} />
              <ControlField label="Center Y" value={controls.centerYOffset} min={-80} max={80} step={0.1} onChange={updateControl("centerYOffset")} />
              <ControlField label="Start Y" value={controls.startYOffset} min={-80} max={80} step={0.1} onChange={updateControl("startYOffset")} />
              <ControlField label="End Y" value={controls.endYOffset} min={-80} max={80} step={0.1} onChange={updateControl("endYOffset")} />
              <ControlField label="Start X" value={controls.startX} min={-20} max={55} step={0.1} onChange={updateControl("startX")} />
              <ControlField label="End X" value={controls.endX} min={45} max={120} step={0.1} onChange={updateControl("endX")} />
              <ControlField label="Center X" value={controls.centerX} min={0} max={100} step={0.1} onChange={updateControl("centerX")} />
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

export default AIAgentsAppsSection;
