import './styles/base.css';
import './styles/sections.css';
import './styles/pages.css';
import './styles/extras.css';
import './styles/polish.css';
import './styles/typography.css';
import 'lenis/dist/lenis.css';

import useTheme from './hooks/useTheme';
import useLenis from './hooks/useLenis';
import useSiteEngines from './hooks/useSiteEngines';
import useScrollReveal from './hooks/useScrollReveal';
import DeptTransition from './components/layout/DeptTransition';
import BackgroundLayers from './components/layout/BackgroundLayers';
import Navbar from './components/layout/Navbar';
import Hero from './components/hero/Hero';
import Showcase from './components/sections/Showcase';
import Fleet from './components/sections/Fleet';
import Council from './components/sections/Council';
import Teams from './components/sections/Teams';
import TeamPage from './components/sections/TeamPage';
import About from './components/pages/About';
import Ugvc from './components/pages/Ugvc';
import Isdc from './components/pages/Isdc';
import Igvc from './components/pages/Igvc';
import Achievements from './components/pages/Achievements';
import Research from './components/pages/Research';
import ResearchArticles from './components/pages/ResearchArticles';
import Sponsors from './components/pages/Sponsors';
import Visuals from './components/pages/Visuals';
import Blogs from './components/pages/Blogs';
import BlogPosts from './components/pages/BlogPosts';
import Contact from './components/pages/Contact';
import BotPage from './components/sections/BotPage';
import Footer from './components/layout/Footer';

export default function App() {
  const [light, toggleTheme] = useTheme();
  useLenis();
  useSiteEngines();
  useScrollReveal();
  return (
    <>
      <DeptTransition />
      <BackgroundLayers />
      <Navbar light={light} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Showcase />
        <Fleet />
        <Council />
        <Teams />
        <Ugvc />
        <Isdc />
        <Igvc />
        <Achievements />
        <Research />
        <Sponsors />
        <Visuals />
        <Blogs />
        <Contact />
        <ResearchArticles />
        <BlogPosts />
      </main>
      <TeamPage />
      <BotPage />
      <Footer />
    </>
  );
}
