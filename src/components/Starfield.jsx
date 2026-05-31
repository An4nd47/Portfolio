import React, { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationId = null;
    let isRunning = false;

    // Reduce star count for users preferring reduced motion or on low-end CPUs
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;
    const STAR_COUNT = (prefersReducedMotion || isLowEnd) ? 80 : 150;

    const resizeStars = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          twinkleFactor: Math.random() * 0.01 + 0.002,
        });
      }
    };

    const animStars = () => {
      if (!canvas || !ctx || !isRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      stars.forEach((s) => {
        // Smooth twinkling transition
        s.opacity += Math.sin(now * 0.001 + s.x) * s.twinkleFactor;
        s.opacity = Math.max(0.1, Math.min(1, s.opacity));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const isBlue = Math.sin(s.x + s.y) > 0.8;
        ctx.fillStyle = `rgba(${isBlue ? '100,200,255' : '255,255,255'}, ${s.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animStars);
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      animStars();
    };

    const stopLoop = () => {
      isRunning = false;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    // Pause when browser tab is hidden — saves CPU, satisfies bfcache requirements
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    // pagehide/pageshow: required for bfcache eligibility
    // Any persistent window listener must be released on pagehide
    const handlePageHide = () => stopLoop();
    const handlePageShow = () => {
      if (!document.hidden) startLoop();
    };

    resizeStars();
    startLoop();

    window.addEventListener('resize', resizeStars, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      stopLoop();
      window.removeEventListener('resize', resizeStars);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return <canvas id="stars-canvas" ref={canvasRef} />;
}
