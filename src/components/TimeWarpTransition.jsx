import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────
// Per-timeline config
// ─────────────────────────────────────────────────────────────────
const TIMELINE_CONFIG = {
  hero: {
    color: '#00d4ff',
    label: 'INIT',
    codename: 'TIMELINE ABOUT',
    glowRgb: '0,212,255',
    effect: 'sparks',
  },
  y2023: {
    color: '#00ff88',
    label: '2023',
    codename: 'TIMELINE 2023',
    glowRgb: '0,255,136',
    effect: 'matrix',
  },
  y2024: {
    color: '#00aaff',
    label: '2024',
    codename: 'TIMELINE 2024',
    glowRgb: '0,170,255',
    effect: 'circuit',
  },
  y2025: {
    color: '#aa44ff',
    label: '2025',
    codename: 'TIMELINE 2025',
    glowRgb: '170,68,255',
    effect: 'neural',
  },
  y2026: {
    color: '#ff6b00',
    label: '2026',
    codename: 'TIMELINE 2026',
    glowRgb: '255,107,0',
    effect: 'fire',
  },
  future: {
    color: '#ffffff',
    label: '∞',
    codename: 'TIMELINE FUTURE',
    glowRgb: '255,255,255',
    effect: 'starburst',
  },
};

// ─────────────────────────────────────────────────────────────────
// Effect: Matrix falling code rain (2023)
// ─────────────────────────────────────────────────────────────────
function MatrixEffect({ color }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 18);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = '01アイウエオカキクケコABCDEF#@!?∞⬡⚡';

    let id;
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = '14px Share Tech Mono, monospace';

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = Math.random() * 0.6 + 0.4;
        ctx.fillText(char, i * 18, y * 18);
        if (y * 18 > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i] += 0.6;
      });
      ctx.globalAlpha = 1;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.55 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Effect: Circuit grid expanding lines (2024)
// ─────────────────────────────────────────────────────────────────
function CircuitEffect({ color }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const lines = Array.from({ length: 40 }, () => {
      const angle = (Math.random() * Math.PI * 2);
      const len = Math.random() * 400 + 100;
      const segments = Math.floor(Math.random() * 4) + 2;
      return { angle, len, segments, progress: 0, speed: Math.random() * 0.012 + 0.006, delay: Math.random() * 60 };
    });

    let frame = 0;
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      lines.forEach((line) => {
        if (frame < line.delay) return;
        line.progress = Math.min(1, line.progress + line.speed);
        const totalLen = line.len * line.progress;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.7;

        let x = cx, y = cy;
        const segLen = totalLen / line.segments;
        let dir = line.angle;

        ctx.moveTo(x, y);
        for (let s = 0; s < line.segments; s++) {
          const nx = x + Math.cos(dir) * segLen;
          const ny = y + Math.sin(dir) * segLen;
          ctx.lineTo(nx, ny);
          x = nx; y = ny;
          dir += (Math.random() - 0.5) * (Math.PI / 2);
        }
        ctx.stroke();

        // Node dot at junction
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.65 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Effect: Neural net nodes & edges pulsing (2025)
// ─────────────────────────────────────────────────────────────────
function NeuralEffect({ color }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 3 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));

    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.05;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        const glow = Math.sin(n.pulse) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6 + glow * 0.4;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
      });

      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 160) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = 0.35 * (1 - d / 160);
            ctx.shadowBlur = 6;
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.7 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Effect: Fire ember particles rising (2026)
// ─────────────────────────────────────────────────────────────────
function FireEffect({ color }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const embers = Array.from({ length: 80 }, () => ({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 300,
      y: canvas.height * 0.7,
      vx: (Math.random() - 0.5) * 3,
      vy: -(Math.random() * 3 + 1),
      life: Math.random(),
      r: Math.random() * 4 + 1,
      decay: Math.random() * 0.012 + 0.005,
    }));

    const fireColors = ['#ff6b00', '#ff9500', '#ffcc00', '#ff3300', '#ff8844'];

    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach((e) => {
        e.x += e.vx + (Math.random() - 0.5) * 0.5;
        e.y += e.vy;
        e.life -= e.decay;
        if (e.life <= 0) {
          e.x = canvas.width * 0.5 + (Math.random() - 0.5) * 300;
          e.y = canvas.height * 0.7;
          e.life = 1;
          e.vy = -(Math.random() * 3 + 1);
          e.vx = (Math.random() - 0.5) * 3;
        }
        const fc = fireColors[Math.floor(e.life * fireColors.length) % fireColors.length];
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * e.life, 0, Math.PI * 2);
        ctx.fillStyle = fc;
        ctx.globalAlpha = e.life * 0.8;
        ctx.shadowColor = fc;
        ctx.shadowBlur = 10;
        ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.75 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Effect: Starburst radial beams expanding (future)
// ─────────────────────────────────────────────────────────────────
function StarburstEffect({ color }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const rays = Array.from({ length: 24 }, (_, i) => ({
      angle: (i / 24) * Math.PI * 2,
      len: 0,
      speed: Math.random() * 8 + 4,
      maxLen: Math.random() * 600 + 300,
      width: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rays.forEach((ray) => {
        ray.len = Math.min(ray.maxLen, ray.len + ray.speed);
        if (ray.len >= ray.maxLen) ray.len = 0;

        const grad = ctx.createLinearGradient(
          cx, cy,
          cx + Math.cos(ray.angle) * ray.len,
          cy + Math.sin(ray.angle) * ray.len
        );
        grad.addColorStop(0, `rgba(255,255,255,0.6)`);
        grad.addColorStop(0.5, color);
        grad.addColorStop(1, `rgba(255,255,255,0)`);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(ray.angle) * ray.len,
          cy + Math.sin(ray.angle) * ray.len
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width;
        ctx.globalAlpha = ray.opacity;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.stroke();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.6 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Default spark effect (hero / fallback)
// ─────────────────────────────────────────────────────────────────
function SparkEffect({ color }) {
  const sparks = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 700 + 300;
      return {
        id: i,
        top: `${45 + (Math.random() - 0.5) * 20}%`,
        left: `${50 + (Math.random() - 0.5) * 20}%`,
        dx: `${Math.cos(angle) * dist}px`,
        dy: `${Math.sin(angle) * dist}px`,
        dur: `${Math.random() * 1.5 + 0.5}s`,
        delay: `${Math.random() * 0.6}s`,
      };
    });
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
      {sparks.map((s) => (
        <div
          key={s.id}
          className="warp-spark"
          style={{
            top: s.top, left: s.left,
            '--spark-dx': s.dx, '--spark-dy': s.dy,
            '--spark-color': color,
            animationDuration: s.dur, animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Effect router
// ─────────────────────────────────────────────────────────────────
function TimelineEffect({ effect, color }) {
  switch (effect) {
    case 'matrix':    return <MatrixEffect   color={color} />;
    case 'circuit':   return <CircuitEffect  color={color} />;
    case 'neural':    return <NeuralEffect   color={color} />;
    case 'fire':      return <FireEffect     color={color} />;
    case 'starburst': return <StarburstEffect color={color} />;
    default:          return <SparkEffect    color={color} />;
  }
}

// ─────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────
export default function TimeWarpTransition({ isActive, departure, destination, onMidpoint, onEnd }) {
  const videoRef = useRef(null);
  const [triggerFlash, setTriggerFlash] = useState(false);
  const [telemetry, setTelemetry] = useState({ speed: 0, voltage: '0.00 GW', status: 'CALIBRATING...', progress: 0 });
  const [isFadingOut, setIsFadingOut] = useState(false);

  const cfg = TIMELINE_CONFIG[destination] || TIMELINE_CONFIG['hero'];
  const prevCfg = TIMELINE_CONFIG[departure] || TIMELINE_CONFIG['hero'];

  const TIMELINE_ORDER = ['hero', 'y2023', 'y2024', 'y2025', 'y2026', 'future'];
  const isBackwards = TIMELINE_ORDER.indexOf(destination) < TIMELINE_ORDER.indexOf(departure);
  const videoSrc = "/delorianVideo.webm";

  const isEndingRef = useRef(false);

  // Play / pause video with the overlay
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    
    if (isActive) {
      setIsFadingOut(false);
      isEndingRef.current = false;
      
      vid.currentTime = 0;
      // vid.load(); // Removed to prevent a black flash when starting the video
      
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn('Video play interrupted:', e);
          if (!isEndingRef.current) {
            handleVideoEnded();
          }
        });
      }
    } else {
      vid.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, videoSrc]);

  const handleVideoEnded = useCallback(() => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      if (onMidpoint) onMidpoint(destination);
      if (onEnd) onEnd();
    }, 600); // Wait for black screen transition
  }, [destination, onMidpoint, onEnd]);

  // Reality-jump flash at midpoint
  useEffect(() => {
    if (!isActive) { setTriggerFlash(false); return; }
    setTriggerFlash(false);
    const t = setTimeout(() => setTriggerFlash(true), 600);
    return () => clearTimeout(t);
  }, [isActive, destination]);

  // Telemetry is now updated via the video's onTimeUpdate event
  useEffect(() => {
    if (!isActive) {
      setTelemetry({ speed: 0, voltage: '0.00 GW', status: 'CALIBRATING...', progress: 0 });
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;

    const currentProgress = vid.currentTime / vid.duration;

    // Fallback in case the video stalls at the very end and doesn't trigger onEnded
    if (currentProgress >= 0.99 && !isEndingRef.current) {
      handleVideoEnded();
    }

    const speed = Math.min(88, Math.round(currentProgress * 88));

    const steps = [
      'INITIALIZING TEMPORAL MATRIX...',
      'WORMHOLE APERTURE OPENING...',
      'BYPASSING SPACE-TIME COHERENCE...',
      `LOCKING ONTO ${cfg.codename}...`,
      'REALITY VECTORS SYNCHRONIZED...',
      `TEMPORAL LOCK — ${cfg.codename}!`,
    ];
    
    // Determine which status text to show based on progress
    let stepIndex = Math.floor(currentProgress * steps.length);
    if (stepIndex >= steps.length) stepIndex = steps.length - 1;

    setTelemetry({
      speed,
      voltage: speed === 88 ? '1.21 GW' : `${(Math.random() * 1.4 + 0.1).toFixed(2)} GW`,
      status: steps[stepIndex] || 'CALIBRATING...',
      progress: currentProgress * 100,
    });
  };

  const effectComponent = useMemo(() => {
    return <TimelineEffect effect={cfg.effect} color={cfg.color} />;
  }, [cfg.effect, cfg.color]);

  return (
    <div
      className={`time-warp-overlay ${isActive ? 'active' : ''}`}
      style={{ background: '#000' }}
    >
      {/* ── Video centrepiece ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          aria-hidden="true"
          onEnded={handleVideoEnded}
          onTimeUpdate={handleTimeUpdate}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: `drop-shadow(0 0 40px rgba(${cfg.glowRgb},0.7)) brightness(1.15) contrast(1.05)`,
            transition: 'filter 0.6s ease',
          }}
        />

        {/* Per-destination color tint gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, rgba(${cfg.glowRgb},0.18) 0%, rgba(0,0,0,0.55) 100%)`,
            mixBlendMode: 'screen',
            transition: 'background 0.5s ease',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── HUD Telemetry overlay ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '1.5rem 2rem',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* Title banner */}
        <div
          className="warp-alert"
          style={{
            color: cfg.color,
            textShadow: `0 0 20px ${cfg.color}, 0 0 60px ${cfg.color}`,
            fontSize: '1.1rem',
            marginBottom: 0,
          }}
        >
          ⬡ {cfg.codename} ⬡
        </div>

        {/* Status line */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '2px',
          }}
        >
          STATUS:{' '}
          <span style={{ color: cfg.color, fontWeight: 'bold' }}>
            {telemetry.status}
          </span>
        </div>

        {/* Stat row */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '2px',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.4)' }}>
            FROM:{' '}
            <span style={{ color: prevCfg.color }}>
              {prevCfg.codename}
            </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }}>
            VELOCITY:{' '}
            <span style={{ color: '#ffcc00', textShadow: '0 0 8px #ffcc00' }}>
              {telemetry.speed} MPH
            </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }}>
            FLUX:{' '}
            <span style={{ color: '#00ff88', textShadow: '0 0 8px #00ff88' }}>
              {telemetry.voltage}
            </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }}>
            TO:{' '}
            <span style={{ color: cfg.color, textShadow: `0 0 8px ${cfg.color}` }}>
              {cfg.codename}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            height: '3px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${telemetry.progress}%`,
              background: `linear-gradient(90deg, ${prevCfg.color}, ${cfg.color})`,
              boxShadow: `0 0 10px ${cfg.color}`,
              transition: 'width 0.08s linear',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>

      {/* ── Black fade out overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000',
          opacity: isFadingOut ? 1 : 0,
          transition: 'opacity 0.6s ease',
          zIndex: 999,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
