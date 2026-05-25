import TelegramChatMockup from "./TelegramChatMockup";
import TeamsChatMockup from "./TeamsChatMockup";
import WhatsAppChatMockup from "./WhatsAppChatMockup";
import {
  Boxes,
  Mail,
  Mic,
} from "lucide-react";

const CHANNELS = [
  { label: "WhatsApp", logo: "/medias/whatsapp.avif" },
  { label: "Microsoft Teams", logo: "/medias/teams logo.png" },
  { label: "Slack", logo: "/medias/slack.png" },
  { label: "Voice", icon: Mic },
  { label: "Email", icon: Mail },
  { label: "WorldLynk app", logo: "/medias/wordlynk.png" },
  { label: "API", icon: Boxes },
];

const NETWORK_CIRCLES = [
  { src: "/network/1.jpg", top: "8%", left: "10%", size: 62 },
  { src: "/network/69b15b68fb5a0ea0e6ef7bed_671e7e1d679d80948b2b7f15_651bc886dd70424477208ca7_iI6qxSvZTY2zj5zbDAix.png", top: "12%", left: "88%", size: 68 },
  { src: "/network/Brunel-UoL-96dpi-650px.png", top: "22%", left: "9%", size: 78 },
  { src: "/network/King's_College_London_logo.svg.png", top: "30%", left: "19%", size: 72 },
  { src: "/network/university-of-cambridge-logo-png_seeklogo-310247.png", top: "74%", left: "10%", size: 74 },
  { src: "/network/regent-university-logo-png_seeklogo-431888.png", top: "86%", left: "18%", size: 66 },
  { src: "/network/Chicago-University-Logo.png", top: "41%", left: "5%", size: 72 },
  { src: "/network/Northeastern-University-Logo.png", top: "58%", left: "6%", size: 66 },
  { src: "/network/ChatGPT Image Nov 22, 2025, 05_12_08 PM.png", top: "24%", left: "84%", size: 82 },
  { src: "/network/Patch.webp", top: "91%", left: "9%", size: 64 },
  { src: "/network/pexels-olly-3762800.jpg", top: "36%", left: "91%", size: 68 },
  { src: "/network/pexels-olly-3776185.jpg", top: "48%", left: "84%", size: 74 },
  { src: "/network/pexels-olly-3808181.jpg", top: "16%", left: "76%", size: 70 },
  { src: "/network/pexels-mart-production-7252045.jpg", top: "82%", left: "91%", size: 66 },
  { src: "/network/pexels-tima-miroshnichenko-6550411.jpg", top: "92%", left: "79%", size: 62 },
  { src: "/network/pexels-armin-rimoldi-5553686.jpg", top: "88%", left: "66%", size: 64 },
  { src: "/network/pexels-armin-rimoldi-5553629.jpg", top: "80%", left: "58%", size: 62 },
  { src: "/network/pexels-keira-burton-6084076.jpg", top: "90%", left: "35%", size: 70 },
  { src: "/network/pexels-gipain-5324830.jpg", top: "18%", left: "68%", size: 66 },
  { src: "/network/pexels-lauren-boswell-191857954-15768006.jpg", top: "16%", left: "30%", size: 62 },
  { src: "/network/pexels-yankrukov-8199138.jpg", top: "94%", left: "44%", size: 60 },
  { src: "/network/pexels-raul-sotomayor-2154397849-33265585.jpg", top: "94%", left: "54%", size: 72 },
  { src: "/network/logo_1089619772651.webp", top: "68%", left: "60%", size: 62 },
  { src: "/network/images.jpeg", top: "58%", left: "38%", size: 60 },
  { src: "/network/images (1).png", top: "34%", left: "31%", size: 56 },
  { src: "/network/images (2).png", top: "34%", left: "70%", size: 56 },
];

const SCATTERED_NETWORK_CIRCLES = NETWORK_CIRCLES.map((circle) => {
  const x = Number.parseFloat(circle.left);
  const shiftedX = x < 50 ? Math.max(1, x - 12) : Math.min(99, x + 12);

  return {
    ...circle,
    id: circle.src,
    x: shiftedX,
    y: Number.parseFloat(circle.top),
  };
});

const CENTER_NODE = { id: "lynkos", x: 50, y: 50 };

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function buildNetworkEdges(nodes) {
  const roots = [...nodes]
    .sort((a, b) => distance(a, CENTER_NODE) - distance(b, CENTER_NODE))
    .slice(0, 6);

  const connected = [...roots];
  const connectedIds = new Set(roots.map((node) => node.id));
  const edges = roots.map((node) => ({ from: CENTER_NODE, to: node }));

  const remaining = nodes.filter((node) => !connectedIds.has(node.id));
  remaining.sort((a, b) => distance(a, CENTER_NODE) - distance(b, CENTER_NODE));

  remaining.forEach((node) => {
    let nearestParent = connected[0];
    let nearestDistance = distance(node, connected[0]);

    for (let i = 1; i < connected.length; i += 1) {
      const candidate = connected[i];
      const candidateDistance = distance(node, candidate);
      if (candidateDistance < nearestDistance) {
        nearestDistance = candidateDistance;
        nearestParent = candidate;
      }
    }

    edges.push({ from: nearestParent, to: node });
    connected.push(node);
    connectedIds.add(node.id);
  });

  return edges;
}

const NETWORK_EDGES = buildNetworkEdges(SCATTERED_NETWORK_CIRCLES);

function DemoSectionV2() {
  return (
    <section className="demo-section demo-section-v2" aria-label="Operate the network from any channel">
      <div className="demo-input-wrap">
        <div className="demo-section-v2-main">
          <header className="business-model-header demo-section-v2-header">
            <p className="business-model-kicker">Channel operations</p>
            <h2 className="business-model-title">
              Operate the network from <span className="business-model-title-accent">any channel.</span>
            </h2>
            <p className="business-model-subtitle">
              Providers do not need to learn a new dashboard. They can post from WhatsApp,
              Microsoft Teams, Slack, voice calls, email, the WorldLynk app, portals, APIs, or
              AI-agent connections. Lynk uses AI to structure the message and translate it into
              network-ready supply.
            </p>
          </header>

          <div className="demo-section-v2-channels">
            <p className="demo-section-v2-channels-title">Connect from</p>
            <div className="demo-section-v2-channels-grid">
              {CHANNELS.map(({ label, icon: Icon, logo }) => (
                <div key={label} className="demo-section-v2-channel-item">
                  <span className="demo-section-v2-channel-icon" aria-hidden="true">
                    {logo ? (
                      <img src={logo} alt="" className="demo-section-v2-channel-logo" />
                    ) : (
                      <Icon size={16} strokeWidth={2} />
                    )}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="demo-section-v2-network-zone">
          <div className="demo-section-v2-arc">
            <div className="demo-section-v2-phone demo-section-v2-phone-whatsapp">
              <WhatsAppChatMockup contactName="LynkOS" useBrandMarkAvatar />
            </div>
            <div className="demo-section-v2-phone demo-section-v2-phone-teams">
              <TeamsChatMockup chatTitle="LynkOS Ops" />
            </div>
            <div className="demo-section-v2-phone demo-section-v2-phone-telegram">
              <TelegramChatMockup contactName="LynkOS" useBrandMarkAvatar />
            </div>
          </div>
        </div>

        <div className="demo-section-v2-circles-zone">
          <svg
            className="demo-section-v2-network-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {NETWORK_EDGES.map((edge) => (
              <line
                key={`line-${edge.from.id}-${edge.to.id}`}
                className="demo-section-v2-network-line"
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
              />
            ))}
          </svg>

          <div className="demo-section-v2-core-node" aria-hidden="true">
            <span>Lynk OS</span>
          </div>

          <div className="demo-section-v2-network-scatter" aria-hidden="true">
            {SCATTERED_NETWORK_CIRCLES.map((circle) => (
              <span
                key={`${circle.src}-${circle.y}-${circle.x}`}
                className="demo-section-v2-network-circle"
                style={{
                  top: `${circle.y}%`,
                  left: `${circle.x}%`,
                  width: `${circle.size}px`,
                  height: `${circle.size}px`,
                }}
              >
                <img src={circle.src} alt="" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoSectionV2;
