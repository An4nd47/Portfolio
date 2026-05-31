import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mx = 0, my = 0;
    let tx = 0, ty = 0;
    let rafId = null;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;

      // Move main cursor dot instantly — no lag
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;

      // Hover detection for interactive elements — scale the cursor ring
      const target = e.target;
      if (target) {
        const isInteractive = target.closest(
          'a, button, input, textarea, select, [role="button"], .proj-card, .mem-card, .tl-dot, .skill-chip, .ai-orb, [onclick]'
        );
        cursor.classList.toggle('hover', !!isInteractive);
      }
    };

    // RAF-based smooth trail — lerp toward cursor each frame.
    // Replaces the previous setTimeout(80ms) approach which caused
    // timer-queue jank on fast mouse movements.
    const animateTrail = () => {
      // Lerp factor: 0.12 ≈ ~80ms lag at 60fps (matches old setTimeout feel)
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = `${tx}px`;
      trail.style.top = `${ty}px`;
      rafId = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} />
      <div className="cursor-trail" ref={trailRef} />
    </>
  );
}
