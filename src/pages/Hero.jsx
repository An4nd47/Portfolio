import React, { useState } from 'react';
import ParticlesBg from '../components/ParticlesBg';

export default function Hero({ onInitiate, navigationMode }) {
  const [isInitiating, setIsInitiating] = useState(false);

  const handleInitiate = (dest) => {
    if (navigationMode === 'scroll') {
      onInitiate(dest, false);
      return;
    }

    setIsInitiating(true);
    setTimeout(() => {
      onInitiate(dest, true);
      setTimeout(() => setIsInitiating(false), 1000);
    }, 1500);
  };

  return (
    <section id="hero">
      <div className="hero-bg" />
      <ParticlesBg />
      <div className="scanline-effect" />

      {/* Fade to black overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'black',
          opacity: isInitiating ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
          zIndex: 99998,
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: isInitiating ? 99999 : 1, textAlign: 'center', width: '100%', maxWidth: '900px', transition: 'z-index 0s' }}>
        
        <div style={{ opacity: isInitiating ? 0 : 1, transition: 'opacity 1.5s ease-in-out' }}>
          <div className="hero-eyebrow">⬡ TEMPORAL JOURNEY INITIALIZED ⬡</div>
          <h1 className="hero-title">
            Travelling Through the<br />
            <span>Evolution of A Software Developer</span>
          </h1>
          <p className="hero-sub">
            From writing the first line of code to building intelligent systems. Each year, a new timeline unlocked.
          </p>
        </div>

        <div className="delorean-container">
          <div className="speed-lines" style={{ top: '60%', opacity: isInitiating ? 0 : 1, transition: 'opacity 1.5s ease-in-out' }}>
            <div
              className="speed-line"
              style={{
                animationDuration: '1.2s',
                animationDelay: '0s',
                top: 0,
                background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.6), transparent)',
              }}
            />
            <div
              className="speed-line"
              style={{
                animationDuration: '1.8s',
                animationDelay: '0.4s',
                top: '8px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.4), transparent)',
              }}
            />
            <div
              className="speed-line"
              style={{
                animationDuration: '1.4s',
                animationDelay: '0.8s',
                top: '-5px',
              }}
            />
          </div>
          <img
            src="/delorian.webp"
            alt="DeLorean Time Machine"
            width="600"
            height="300"
            fetchPriority="high"
            className="delorean-img"
            style={{ width: '100%', height: 'auto', position: 'relative', zIndex: isInitiating ? 51 : 1, transform: 'scale(1.2) translateY(-20px)', filter: isInitiating ? 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))' : 'none', transition: 'filter 1.5s ease-in-out' }}
          />
          <div className="delorean-glow" style={{ opacity: isInitiating ? 0 : 1, transition: 'opacity 1.5s ease-in-out' }} />
        </div>

        <div style={{ marginBottom: '2rem', opacity: isInitiating ? 0 : 1, transition: 'opacity 1.5s ease-in-out' }}>
          <button className="cta-btn" onClick={() => handleInitiate('y2023')}>
            INITIATE JOURNEY <span className="arrow">→</span>
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '2px',
            opacity: isInitiating ? 0 : 1,
            transition: 'opacity 1.5s ease-in-out'
          }}
        >
          <span>DEPARTURE: 2023</span>
          <span>DESTINATION: ∞</span>
          <span>POWER: 1.21 GW</span>
        </div>
      </div>

      <div className="scroll-indicator" style={{ opacity: isInitiating ? 0 : 1, transition: 'opacity 1.5s ease-in-out' }}>
        <span>SCROLL</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}
