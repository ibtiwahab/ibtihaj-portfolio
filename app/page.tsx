import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import GameSection from "./components/GameSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Spotlight from "./components/Spotlight";

export default function Home() {
  return (
    <>
      <Spotlight />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <GameSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
