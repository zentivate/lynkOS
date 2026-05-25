import BusinessModelSection from "../components/BusinessModelSection";
import HeroSection from "../components/HeroSection";
import DemoSectionV2 from "../components/DemoSectionV2";
import FooterSection from "../components/FooterSection";
import ProblemSection from "../components/ProblemSection";
import TopNav from "../components/TopNav";
import TrustSection from "../components/TrustSection";

function HomePage({ startGlobeAnimation }) {
  return (
    <main className="app-shell">
      <TopNav />
      <HeroSection startGlobeAnimation={startGlobeAnimation} />
      <ProblemSection />
      <DemoSectionV2 />
      <BusinessModelSection />
      <TrustSection />
      <FooterSection />
    </main>
  );
}

export default HomePage;
