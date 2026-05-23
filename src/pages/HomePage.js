import HeroSection from "../components/HeroSection";
import NetworkFlowSection from "../components/NetworkFlowSection";
import ProblemSection from "../components/ProblemSection";
import TopNav from "../components/TopNav";

function HomePage({ startGlobeAnimation }) {
  return (
    <main className="app-shell">
      <TopNav />
      <HeroSection startGlobeAnimation={startGlobeAnimation} />
      <ProblemSection />
      <NetworkFlowSection />
    </main>
  );
}

export default HomePage;
