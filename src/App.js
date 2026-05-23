import { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";

const LOADER_DURATION_MS = 2600;
const LOADER_EXIT_MS = 700;
const DOT_MATRIX = {
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00010", "11100"],
  "%": ["10001", "00010", "00100", "01000", "10001", "00000", "00000"],
};

function App() {
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [startGlobeAnimation, setStartGlobeAnimation] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now) => {
      const elapsed = now - startedAt;
      const progress = Math.min(100, (elapsed / LOADER_DURATION_MS) * 100);
      setLoaderProgress(progress);

      if (progress < 100) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      setIsLoaderExiting(true);
      window.setTimeout(() => {
        setIsLoaderVisible(false);
        setStartGlobeAnimation(true);
      }, LOADER_EXIT_MS);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      {isLoaderVisible ? (
        <div className={`app-loader ${isLoaderExiting ? "is-exiting" : ""}`} role="status">
          <div className="brand-lockup app-loader-brand" aria-label="Lynk Network logo">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark-core" />
            </span>
            <span className="brand-copy">
              <strong className="brand-name">Lynk</strong>
              <small className="brand-subtitle">Network</small>
            </span>
          </div>
          <div className="app-loader-panel">
            <span className="app-loader-corner app-loader-corner-tl" />
            <span className="app-loader-corner app-loader-corner-tr" />
            <span className="app-loader-corner app-loader-corner-bl" />
            <span className="app-loader-corner app-loader-corner-br" />
            <div className="app-loader-progress-matrix" aria-label={`Loading ${Math.round(loaderProgress)} percent`}>
              {`${Math.round(loaderProgress)}%`.split("").map((char, charIndex) => (
                <div className="app-loader-digit" key={`${char}-${charIndex}`}>
                  {(DOT_MATRIX[char] || []).map((row, rowIndex) =>
                    row.split("").map((cell, cellIndex) => (
                      <span
                        key={`${char}-${rowIndex}-${cellIndex}`}
                        className={`app-loader-dot ${cell === "1" ? "is-on" : ""}`}
                      />
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <HomePage startGlobeAnimation={startGlobeAnimation} />
    </>
  );
}

export default App;
