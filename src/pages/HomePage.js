import BusinessModelSection from "../components/BusinessModelSection";
import HeroSection from "../components/HeroSection";
import DemoSection from "../components/DemoSection";
import ProblemSection from "../components/ProblemSection";
import TopNav from "../components/TopNav";
import TeamsChatMockup from "../components/TeamsChatMockup/TeamsChatMockup";
import TelegramChatMockup from "../components/TelegramChatMockup/TelegramChatMockup";
import WhatsAppChatMockup from "../components/WhatsAppChatMockup/WhatsAppChatMockup";

function HomePage({ startGlobeAnimation }) {
  return (
    <main className="app-shell">
      <TopNav />
      <HeroSection startGlobeAnimation={startGlobeAnimation} />
      <ProblemSection />
      <DemoSection />
      <section className="chat-mockup-preview" aria-label="WhatsApp mockup preview">
        <WhatsAppChatMockup />
      </section>
      <section className="chat-mockup-preview" aria-label="Telegram mockup preview">
        <TelegramChatMockup />
      </section>
      <section className="chat-mockup-preview" aria-label="Teams mockup preview">
        <TeamsChatMockup />
      </section>
      <BusinessModelSection />
    </main>
  );
}

export default HomePage;
