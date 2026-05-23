import HeroSection from "../components/HeroSection";
import DemoSection from "../components/DemoSection";
import ProblemSection from "../components/ProblemSection";
import TopNav from "../components/TopNav";

function HomePage({ startGlobeAnimation }) {
  return (
    <main className="app-shell">
      <TopNav />
      <HeroSection startGlobeAnimation={startGlobeAnimation} />
      <ProblemSection />
      <DemoSection />
    </main>
  );
}

export default HomePage;
