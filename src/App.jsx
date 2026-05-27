import React, { useState, useEffect, useMemo, Suspense } from 'react';
import CustomCursor from './components/CustomCursor';
import Starfield from './components/Starfield';
import Navbar from './components/Navbar';
import TimelineNav from './components/TimelineNav';
import Modal from './components/Modal';
import TimeWarpTransition from './components/TimeWarpTransition';
import Footer from './components/Footer';

// Pages (Lazy Loaded)
const Hero = React.lazy(() => import('./pages/Hero'));
const Timeline2023 = React.lazy(() => import('./pages/Timeline2023'));
const Timeline2024 = React.lazy(() => import('./pages/Timeline2024'));
const Timeline2025 = React.lazy(() => import('./pages/Timeline2025'));
const Timeline2026 = React.lazy(() => import('./pages/Timeline2026'));
const TimelineFuture = React.lazy(() => import('./pages/TimelineFuture'));

export default function App() {
  // Navigation Mode: 'scroll' (continuous smooth scroll) or 'warp' (discrete tab-pages with warp transition)
  const [navigationMode, setNavigationMode] = useState('scroll');
  const [activeTimeline, setActiveTimeline] = useState('hero');

  // Time Warp transition screen states
  const [isWarping, setIsWarping] = useState(false);
  const [warpDeparture, setWarpDeparture] = useState('hero');
  const [warpDestination, setWarpDestination] = useState('hero');

  // Project developer notes modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', content: '' });

  const projectData = useMemo(
    () => ({
      proj1: {
        title: '// AUTH SYSTEM — DEV NOTES',
        content: `> Init: March 2024\n> Stack: Node.js + Express + MySQL\n> Features:\n  - JWT authentication\n  - bcrypt password hashing\n  - Session management\n  - Role-based access control\n> Challenges:\n  - Token refresh logic\n  - SQL injection prevention\n> Lessons:\n  Security is never optional.`,
      },
      proj2: {
        title: '// PORTFOLIO v1 — DEV NOTES',
        content: `> Init: June 2024\n> Stack: React + CSS3\n> Features:\n  - Animated hero section\n  - Mobile-first responsive\n  - Contact form integration\n  - Dark mode toggle\n> Challenges:\n  - CSS animation performance\n  - Cross-browser compatibility\n> Lessons:\n  Design and code must coexist.`,
      },
      proj3: {
        title: '// API INTEGRATIONS — DEV NOTES',
        content: `> Init: September 2024\n> Stack: Express + REST + JSON\n> Features:\n  - Third-party API connections\n  - Rate limiting\n  - Error handling middleware\n  - Data transformation\n> Challenges:\n  - API key security\n  - Response parsing edge cases\n> Lessons:\n  Read the docs. All of them.`,
      },
    }),
    []
  );

  const handleOpenModal = (projId) => {
    const data = projectData[projId];
    if (data) {
      setModalData(data);
      setModalOpen(true);
    }
  };

  const handleSelectTimeline = (id, forceWarp = false) => {
    if (navigationMode === 'scroll' && !forceWarp) {
      setActiveTimeline(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Warp navigation mode with full-screen warp effect
      if (activeTimeline === id && !forceWarp) return;
      setWarpDeparture(activeTimeline);
      setWarpDestination(id);
      setIsWarping(true);
      if (forceWarp && navigationMode !== 'warp') {
        setNavigationMode('warp');
      }
    }
  };

  const handleToggleNavigationMode = (mode) => {
    setNavigationMode(mode);
    if (mode === 'scroll') {
      // Small timeout to allow nodes to mount before scrolling
      setTimeout(() => {
        const element = document.getElementById(activeTimeline);
        if (element) {
          element.scrollIntoView({ behavior: 'auto' });
        }
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Continuous Scroll - Viewport Intersection Observer
  useEffect(() => {
    if (navigationMode !== 'scroll') return;

    const sections = ['hero', 'y2023', 'y2024', 'y2025', 'y2026', 'future'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTimeline(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      threshold: 0.35,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [navigationMode]);

  return (
    <>
      {/* Visual Backdrops */}
      <Starfield />
      <CustomCursor />

      {/* Navigation Headers */}
      <Navbar
        activeTimeline={activeTimeline}
        onSelectTimeline={handleSelectTimeline}
        navigationMode={navigationMode}
        onToggleNavigationMode={handleToggleNavigationMode}
      />

      <TimelineNav
        activeTimeline={activeTimeline}
        onSelectTimeline={handleSelectTimeline}
        navigationMode={navigationMode}
      />

      {/* Dynamic Time Warp screen */}
      <TimeWarpTransition
        isActive={isWarping}
        departure={warpDeparture}
        destination={warpDestination}
        onMidpoint={(id) => {
          setActiveTimeline(id);
          window.scrollTo(0, 0);
        }}
        onEnd={() => setIsWarping(false)}
      />

      {/* Main Content Layout */}
      <main>
        <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020510', color: '#00d4ff', fontFamily: 'monospace'}}>INITIALIZING SYSTEM...</div>}>
          {navigationMode === 'scroll' ? (
            <div className="continuous-timeline-wrapper">
              <Hero onInitiate={handleSelectTimeline} navigationMode={navigationMode} />
              <Timeline2023 />
              <Timeline2024 onOpenModal={handleOpenModal} />
              <Timeline2025 />
              <Timeline2026 />
              <TimelineFuture />
              <Footer />
            </div>
          ) : (
            <div className="discrete-warp-wrapper">
              {activeTimeline === 'hero' && <Hero onInitiate={handleSelectTimeline} navigationMode={navigationMode} />}
              {activeTimeline === 'y2023' && <Timeline2023 />}
              {activeTimeline === 'y2024' && <Timeline2024 onOpenModal={handleOpenModal} />}
              {activeTimeline === 'y2025' && <Timeline2025 />}
              {activeTimeline === 'y2026' && <Timeline2026 />}
              {activeTimeline === 'future' && <TimelineFuture />}
              <Footer />
            </div>
          )}
        </Suspense>
      </main>

      {/* Floating Logs Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalData.title}
        content={modalData.content}
      />
    </>
  );
}
