import { useEffect, useRef, useState } from "react";
import TelegramChatMockup from "./TelegramChatMockup";
import TeamsChatMockup from "./TeamsChatMockup";
import WhatsAppChatMockup from "./WhatsAppChatMockup";

const TARGET_LINE =
  "Need 3 weekend staff in Egham. £12/hr. Friday to Sunday. Immediate start.";

const EDGE_DURATION_MS = 520;

const NETWORK_NODES = [
  { id: "n0", x: 50, y: 54, label: "Lynk OS", tier: 0, delay: 0 },
  { id: "n1", x: 35, y: 40, tier: 1, delay: 820 },
  { id: "n2", x: 65, y: 40, tier: 1, delay: 980 },
  { id: "n3", x: 30, y: 68, tier: 1, delay: 1140 },
  { id: "n4", x: 70, y: 68, tier: 1, delay: 1300 },
  { id: "n5", x: 24, y: 26, tier: 2, delay: 1520 },
  { id: "n6", x: 44, y: 22, tier: 2, delay: 1680 },
  { id: "n7", x: 56, y: 22, tier: 2, delay: 1840 },
  { id: "n8", x: 76, y: 26, tier: 2, delay: 2000 },
  { id: "n9", x: 19, y: 80, tier: 2, delay: 2160 },
  { id: "n10", x: 41, y: 84, tier: 2, delay: 2320 },
  { id: "n11", x: 59, y: 84, tier: 2, delay: 2480 },
  { id: "n12", x: 81, y: 80, tier: 2, delay: 2640 },
  { id: "n13", x: 11, y: 18, tier: 3, delay: 2860 },
  { id: "n14", x: 31, y: 14, tier: 3, delay: 3020 },
  { id: "n15", x: 42, y: 12, tier: 3, delay: 3180 },
  { id: "n16", x: 58, y: 12, tier: 3, delay: 3340 },
  { id: "n17", x: 69, y: 14, tier: 3, delay: 3500 },
  { id: "n18", x: 89, y: 18, tier: 3, delay: 3660 },
  { id: "n19", x: 8, y: 88, tier: 3, delay: 3820 },
  { id: "n20", x: 30, y: 90, tier: 3, delay: 3980 },
  { id: "n21", x: 46, y: 92, tier: 3, delay: 4140 },
  { id: "n22", x: 54, y: 92, tier: 3, delay: 4300 },
  { id: "n23", x: 70, y: 90, tier: 3, delay: 4460 },
  { id: "n24", x: 92, y: 88, tier: 3, delay: 4620 },
];

const NETWORK_EDGES = [
  { from: "n0", to: "n1", delay: 300 },
  { from: "n0", to: "n2", delay: 460 },
  { from: "n0", to: "n3", delay: 620 },
  { from: "n0", to: "n4", delay: 780 },
  { from: "n1", to: "n5", delay: 1000 },
  { from: "n1", to: "n6", delay: 1160 },
  { from: "n2", to: "n7", delay: 1320 },
  { from: "n2", to: "n8", delay: 1480 },
  { from: "n3", to: "n9", delay: 1640 },
  { from: "n3", to: "n10", delay: 1800 },
  { from: "n4", to: "n11", delay: 1960 },
  { from: "n4", to: "n12", delay: 2120 },
  { from: "n5", to: "n13", delay: 2340 },
  { from: "n5", to: "n14", delay: 2500 },
  { from: "n6", to: "n15", delay: 2660 },
  { from: "n7", to: "n16", delay: 2820 },
  { from: "n8", to: "n17", delay: 2980 },
  { from: "n8", to: "n18", delay: 3140 },
  { from: "n9", to: "n19", delay: 3300 },
  { from: "n9", to: "n20", delay: 3460 },
  { from: "n10", to: "n21", delay: 3620 },
  { from: "n11", to: "n22", delay: 3780 },
  { from: "n12", to: "n23", delay: 3940 },
  { from: "n12", to: "n24", delay: 4100 },
];

function DemoSection() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [phase, setPhase] = useState("idle");

  const handleResetAnimation = () => {
    setTypedText("");
    setIsInView(false);
    setPhase("idle");

    window.setTimeout(() => {
      setIsInView(true);
    }, 40);
  };

  useEffect(() => {
    const sectionNode = sectionRef.current;
    if (!sectionNode) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(sectionNode);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPhase("typing");
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isInView]);

  useEffect(() => {
    if (phase !== "typing") {
      return undefined;
    }

    if (typedText.length >= TARGET_LINE.length) {
      setPhase("highlight");
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const nextLength = Math.min(typedText.length + 3, TARGET_LINE.length);
      setTypedText(TARGET_LINE.slice(0, nextLength));
    }, 8);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase, typedText]);

  useEffect(() => {
    if (phase !== "highlight") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPhase("exit");
    }, 320);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPhase("whatsapp");
    }, 260);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "whatsapp") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPhase("network");
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  return (
    <section ref={sectionRef} className="demo-section">
      <div className="demo-input-wrap">
        <button type="button" className="demo-reset-button" onClick={handleResetAnimation}>
          Reset Animation
        </button>

        <div
          className={`demo-input-block${isInView ? " is-visible" : ""}${
            phase === "highlight" ? " is-phase-one-complete" : ""
          }${phase === "exit" || phase === "whatsapp" || phase === "network" ? " is-phase-one-exit" : ""}`}
          role="textbox"
          aria-label="Demo typed input"
        >
          <span className="demo-input-text">{typedText}</span>
          <button type="button" className="demo-send-button">
            Send
          </button>
        </div>

        <div
          className={`wa-mockup${phase === "whatsapp" || phase === "network" ? " is-visible" : ""}${
            phase === "network" ? " is-phase-three" : ""
          }`}
        >
          <div className="mockups-group">
            <div className="mockups-stack">
              <WhatsAppChatMockup className="demo-phone-card demo-phone-card-whatsapp" />
              <TelegramChatMockup
                className="demo-phone-card demo-phone-card-telegram"
                contactName="LynkOS"
              />
              <TeamsChatMockup className="demo-phone-card demo-phone-card-teams" chatTitle="LynkOS Ops" />
            </div>
            <p className="demo-mocks-copy">
              Providers do not need to learn a new dashboard. They can post from WhatsApp,
              Microsoft Teams, Slack, voice calls, email, the WorldLynk app, portals, APIs, or
              AI-agent connections.
            </p>
          </div>

          <div className="demo-network-layer" aria-hidden="true">
            <svg className="demo-network-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {NETWORK_EDGES.map((edge) => {
                const from = NETWORK_NODES.find((node) => node.id === edge.from);
                const to = NETWORK_NODES.find((node) => node.id === edge.to);
                if (!from || !to) {
                  return null;
                }
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    className={`demo-network-edge demo-network-edge--${from.tier}`}
                    style={{
                      animationDelay: `${edge.delay}ms`,
                      animationDuration: `${EDGE_DURATION_MS}ms`,
                    }}
                    pathLength="1"
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                  />
                );
              })}
            </svg>

            {NETWORK_NODES.map((node) => (
              <div
                key={node.id}
                className={`demo-network-node demo-network-node--${node.tier}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  animationDelay: `${node.delay}ms`,
                }}
              >
                {node.label ? <span>{node.label}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoSection;
