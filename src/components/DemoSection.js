import { useEffect, useRef, useState } from "react";
import whatsappBg from "../assets/whatsapp-doodle-bg.svg";

const TARGET_LINE =
  "Need 3 weekend staff in Egham. £12/hr. Friday to Sunday. Immediate start.";

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

  return (
    <section ref={sectionRef} className="demo-section">
      <div className="demo-input-wrap">
        <button type="button" className="demo-reset-button" onClick={handleResetAnimation}>
          Reset Animation
        </button>

        <div
          className={`demo-input-block${isInView ? " is-visible" : ""}${
            phase === "highlight" ? " is-phase-one-complete" : ""
          }${phase === "exit" || phase === "whatsapp" ? " is-phase-one-exit" : ""}`}
          role="textbox"
          aria-label="Demo typed input"
        >
          <span className="demo-input-text">{typedText}</span>
          <button type="button" className="demo-send-button">
            Send
          </button>
        </div>

        <div className={`wa-mockup${phase === "whatsapp" ? " is-visible" : ""}`}>
          <div className="wa-screen" style={{ backgroundImage: `url(${whatsappBg})` }}>
            <header className="wa-header">
              <div className="wa-left">
                <span className="wa-arrow" aria-hidden="true">
                  ‹
                </span>
                <span className="wa-avatar" aria-hidden="true">
                  MC
                </span>
                <div className="wa-contact">
                  <p>Martha Craig</p>
                  <span>tap here for contact info</span>
                </div>
              </div>
              <div className="wa-right" aria-hidden="true">
                <span className="wa-video" />
                <span className="wa-phone" />
              </div>
            </header>

            <main className="wa-chat">
              <div className="wa-bubble wa-bubble-out">{TARGET_LINE}</div>
            </main>

            <footer className="wa-footer">
              <span className="wa-plus" aria-hidden="true">
                +
              </span>
              <div className="wa-input-shell" aria-hidden="true">
                <span className="wa-input-icon" />
              </div>
              <span className="wa-camera" aria-hidden="true" />
              <span className="wa-mic" aria-hidden="true" />
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoSection;
