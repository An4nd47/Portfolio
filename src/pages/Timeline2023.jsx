import React, { useState, useRef, useEffect } from 'react';

export default function Timeline2023() {
  const [terminalLines, setTerminalLines] = useState([
    { text: '// Welcome to 2023. The journey begins.', isDim: true },
    { text: '$ echo "Hello, World!"', isDim: false },
    { text: 'Hello, World!', isDim: false, color: 'rgba(0, 255, 136, 0.7)' },
    { text: '// Try typing: hello world', isDim: true },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isBugFixed, setIsBugFixed] = useState(false);
  const [bugResult, setBugResult] = useState('');
  const terminalBodyRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addLine = (text, isDim = false, color = '') => {
    setTerminalLines((prev) => [...prev, { text, isDim, color }]);
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputVal.trim();
      const lowerCmd = cmd.toLowerCase();
      addLine(`$ ${cmd}`);

      const commands = {
        'hello world': () => {
          addLine('🌟 EASTER EGG ACTIVATED!', false, '#ff0');
          addLine('Welcome, fellow traveler. You found it.', false, 'rgba(0, 255, 136, 0.7)');
          triggerConfetti();
        },
        'ls': () => {
          addLine('2023/  2024/  2025/  2026/  future/  .secrets');
        },
        'date': () => {
          addLine(`> ${new Date().toString()}`);
        },
        'whoami': () => {
          addLine('> AI Developer. Time Traveller. Curious Mind.');
        },
        'clear': () => {
          setTerminalLines([]);
        },
        'help': () => {
          addLine('> Commands: ls, date, whoami, hello world, clear, skills, pwd');
        },
        'skills': () => {
          addLine('> HTML CSS JS Python React Node MySQL NLTK TF-IDF AI');
        },
        'pwd': () => {
          addLine('> /timeline/2023/beginning');
        },
      };

      if (commands[lowerCmd]) {
        commands[lowerCmd]();
      } else if (lowerCmd) {
        addLine(`bash: ${cmd}: command not found`, false, 'rgba(255, 100, 100, 0.7)');
      }

      setInputVal('');
    }
  };

  const triggerConfetti = () => {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        background: hsl(${Math.random() * 360}, 100%, 60%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 1.5s ease;
      `;
      document.body.appendChild(p);
      setTimeout(() => {
        p.style.transform = `translate(${(Math.random() - 0.5) * 400}px, ${(Math.random() - 0.5) * 400}px)`;
        p.style.opacity = '0';
      }, 10);
      setTimeout(() => p.remove(), 1600);
    }
  };

  const handleFixBug = () => {
    setIsBugFixed(true);
    setBugResult('✓ FIXED');
  };

  return (
    <section id="y2023" className="year-section fade-in-section visible">
      <div className="scanline-effect" style={{ opacity: 0.5 }} />
      <div className="section-inner">
        <div className="section-line">
          <div className="year-badge y2023">▸ 2023 — TIMELINE ALPHA</div>
        </div>
        <div className="two-col">
          <div>
            <h2 className="section-title" style={{ color: 'var(--neon-green)' }}>
              Started Coding
            </h2>
            <p className="section-desc">
              First contact with the machine. The terminal blinked. Curiosity met logic. Every syntax error was a
              lesson, every working function — a small miracle.
            </p>
            
            <div className="skills-grid">
              <span className="skill-chip" style={{ '--chip-color': '#00ff88' }}>HTML</span>
              <span className="skill-chip" style={{ '--chip-color': '#00ff88' }}>CSS</span>
              <span className="skill-chip" style={{ '--chip-color': '#00ff88' }}>JavaScript</span>
              <span className="skill-chip" style={{ '--chip-color': '#00ff88' }}>Python</span>
              <span className="skill-chip" style={{ '--chip-color': '#00ff88' }}>Git</span>
              <span className="skill-chip" style={{ '--chip-color': '#00ff88' }}>CLI</span>
            </div>

            <div className="glass-card" style={{ marginTop: '1.5rem', borderColor: 'rgba(0, 255, 136, 0.2)' }}>
              <div className="hud-corner tl" />
              <div className="hud-corner tr" />
              <div className="hud-corner bl" />
              <div className="hud-corner br" />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(0, 255, 136, 0.6)', letterSpacing: '2px', marginBottom: '0.75rem' }}>
                ✦ MILESTONE UNLOCKED
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7 }}>
                First GitHub repository pushed. The "Hello, World" echo heard across the digital cosmos.
                Curiosity-driven development engaged.
              </p>
            </div>
          </div>

          <div>
            {/* TERMINAL EMULATOR */}
            <div className="terminal">
              <div className="terminal-bar">
                <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                <div className="terminal-dot" style={{ background: '#febc2e' }} />
                <div className="terminal-dot" style={{ background: '#28c840' }} />
                <span style={{ marginLeft: '0.5rem', color: 'rgba(0, 255, 136, 0.6)', fontSize: '0.65rem', letterSpacing: '2px' }}>
                  TIMELINE_2023 — BASH
                </span>
              </div>
              <div className="terminal-body" ref={terminalBodyRef}>
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className={`terminal-line ${line.isDim ? 'dim' : ''}`}
                    style={line.color ? { color: line.color } : {}}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
              <div className="terminal-input-row" style={{ padding: '0 1rem 1rem' }}>
                <span className="terminal-prompt">$</span>
                <input
                  type="text"
                  className="terminal-input"
                  aria-label="Terminal command input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleCommand}
                  placeholder="type a command..."
                  autoComplete="off"
                />
              </div>
            </div>

            {/* BUG FIXER */}
            <div className="glass-card" style={{ marginTop: '1rem', borderColor: 'rgba(0, 255, 136, 0.15)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(0, 255, 136, 0.5)', marginBottom: '0.5rem' }}>
                // fix the syntax error
              </p>
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: isBugFixed ? 'rgba(0, 255, 136, 0.8)' : 'rgba(255, 255, 255, 0.6)',
                  lineHeight: 1.8,
                  transition: 'color 0.3s',
                }}
              >
                {isBugFixed
                  ? `function greet(name) {\n  console.log("Hello " + name)\n  return name\n}`
                  : `function greet(name {\n  console.log("Hello " + name)\n  return name\n}`}
              </pre>
              <button
                onClick={handleFixBug}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.35rem 1rem',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  background: 'transparent',
                  color: 'var(--neon-green)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                className="bug-fix-btn"
              >
                ▶ RUN FIXER
              </button>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--neon-green)',
                  marginLeft: '1rem',
                  opacity: isBugFixed ? 1 : 0,
                  transition: 'opacity 0.5s',
                }}
              >
                {bugResult}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
