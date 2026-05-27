import React, { useEffect, useRef, useState, useMemo } from 'react';

export default function Timeline2025() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // NLP Tokenizer State
  const [nlpInput, setNlpInput] = useState('Artificial intelligence is transforming the world');
  const stopwords = useMemo(
    () => ['is', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'as'],
    []
  );

  // Parse tokens and stopwords
  const { tokens, tokensClean } = useMemo(() => {
    const words = nlpInput.split(/\s+/).filter((w) => w.length > 0);
    const clean = words.filter((w) => !stopwords.includes(w.toLowerCase()));
    return { tokens: words, tokensClean: clean };
  }, [nlpInput, stopwords]);

  // Concordance Search State
  const [concordInput, setConcordInput] = useState('');
  const [concordResults, setConcordResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const corpus =
    'artificial intelligence is transforming the world the world is changing with artificial intelligence and machine learning is a powerful technology';

  const handleConcordSearch = () => {
    setSearched(true);
    const word = concordInput.trim().toLowerCase();
    if (!word) {
      setConcordResults([]);
      return;
    }

    const wordsList = corpus.split(' ');
    const contexts = [];
    wordsList.forEach((w, i) => {
      if (w === word) {
        const start = Math.max(0, i - 3);
        const end = i + 4;
        const ctx = wordsList.slice(start, end).join(' ');
        contexts.push(`...${ctx}...`);
      }
    });
    setConcordResults(contexts);
  };

  // Memory Match Game State
  const symbols = useMemo(() => ['🤖', '🧠', '⚡', '🔮', '💡', '🌐', '🔬', '⚙️'], []);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matches, setMatches] = useState(0);
  const [canFlip, setCanFlip] = useState(true);

  const resetGame = () => {
    setMatches(0);
    setFlipped([]);
    setCanFlip(true);
    const pairs = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(pairs.map((s, i) => ({ id: i, symbol: s, isFlipped: false, isMatched: false })));
  };

  // Run on mount
  useEffect(() => {
    resetGame();
  }, [symbols]);

  const handleCardClick = (cardIndex) => {
    if (!canFlip) return;
    const card = cards[cardIndex];
    if (card.isFlipped || card.isMatched) return;

    // Flip card
    const updatedCards = [...cards];
    updatedCards[cardIndex] = { ...card, isFlipped: true };
    setCards(updatedCards);

    const newFlipped = [...flipped, cardIndex];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      const [firstIdx, secondIdx] = newFlipped;
      
      setTimeout(() => {
        const firstCard = updatedCards[firstIdx];
        const secondCard = updatedCards[secondIdx];
        const finalCards = [...updatedCards];

        if (firstCard.symbol === secondCard.symbol) {
          finalCards[firstIdx] = { ...firstCard, isMatched: true, isFlipped: false };
          finalCards[secondIdx] = { ...secondCard, isMatched: true, isFlipped: false };
          setMatches((m) => m + 1);
        } else {
          finalCards[firstIdx] = { ...firstCard, isFlipped: false };
          finalCards[secondIdx] = { ...secondCard, isFlipped: false };
        }

        setCards(finalCards);
        setFlipped([]);
        setCanFlip(true);
      }, 800);
    }
  };

  // NLP Pipeline stages
  const stages = [
    { name: 'RAW TEXT', color: 'rgba(255,255,255,0.3)', ex: 'Natural language input from user' },
    { name: 'TOKENIZATION', color: 'rgba(170,68,255,0.6)', ex: '[Natural, language, input, from, user]' },
    { name: 'STOPWORD REMOVAL', color: 'rgba(0,212,255,0.6)', ex: '[Natural, language, input, user]' },
    { name: 'LEMMATIZATION', color: 'rgba(0,255,136,0.6)', ex: '[natural, languag, input, user]' },
    { name: 'TF-IDF VECTORS', color: 'rgba(255,107,0,0.6)', ex: '[0.82, 0.91, 0.67, 0.45]' },
  ];

  // Neural Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animationFrameId = null;

    const resizeNeural = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodes = [];
      for (let i = 0; i < 20; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 1,
        });
      }
    };

    const animNeural = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(170, 68, 255, 0.5)';
        ctx.fill();
      });

      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(170, 68, 255, ${0.3 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animNeural);
    };

    resizeNeural();
    animNeural();

    // Resize observer
    const ro = new ResizeObserver(() => {
      resizeNeural();
    });
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
    };
  }, []);

  const tokenColors = ['rgba(170,68,255,0.3)', 'rgba(0,212,255,0.2)', 'rgba(0,255,136,0.2)', 'rgba(255,107,0,0.2)'];

  return (
    <section id="y2025" className="year-section fade-in-section nlp-bg visible" ref={containerRef}>
      <canvas className="neural-canvas" ref={canvasRef} />
      
      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-line">
          <div className="year-badge y2025">▸ 2025 — TIMELINE GAMMA</div>
        </div>

        <h2 className="section-title" style={{ color: '#aa44ff' }}>
          Explored NLP
        </h2>
        <p className="section-desc">
          Language became data. Words became vectors. Meaning became math. Natural Language Processing opened a door to
          understanding how machines read human thought.
        </p>

        <div className="skills-grid" style={{ marginBottom: '2rem' }}>
          <span className="skill-chip" style={{ '--chip-color': '#aa44ff' }}>NLTK</span>
          <span className="skill-chip" style={{ '--chip-color': '#aa44ff' }}>Tokenization</span>
          <span className="skill-chip" style={{ '--chip-color': '#aa44ff' }}>TF-IDF</span>
          <span className="skill-chip" style={{ '--chip-color': '#aa44ff' }}>Lemmatization</span>
          <span className="skill-chip" style={{ '--chip-color': '#aa44ff' }}>Stopword Removal</span>
          <span className="skill-chip" style={{ '--chip-color': '#aa44ff' }}>Information Retrieval</span>
          <span className="skill-chip" style={{ '--chip-color': '#aa44ff' }}>Data Preprocessing</span>
        </div>

        <div className="two-col">
          <div>
            {/* LIVE TOKENIZER */}
            <div className="nlp-demo">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(170,68,255,0.6)', letterSpacing: '2px', marginBottom: '1rem' }}>
                // LIVE TOKENIZER
              </div>
              <input
                type="text"
                aria-label="Sentence to tokenize"
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                placeholder="Type a sentence to tokenize..."
                style={{
                  width: '100%',
                  background: 'rgba(170, 68, 255, 0.05)',
                  border: '1px solid rgba(170, 68, 255, 0.3)',
                  color: '#fff',
                  padding: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  outline: 'none',
                  marginBottom: '1rem',
                }}
              />
              <div id="tokenDisplay" style={{ minHeight: '3rem' }}>
                {tokens.map((token, i) => {
                  const color = tokenColors[i % tokenColors.length];
                  return (
                    <span
                      key={i}
                      className="token"
                      style={{
                        background: color,
                        border: `1px solid ${color.replace('0.', '0.6')}`,
                        color: '#fff',
                      }}
                    >
                      {token}
                    </span>
                  );
                })}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
                stopwords removed →{' '}
                <span id="noStopWords" style={{ color: 'rgba(170,68,255,0.7)' }}>
                  {tokensClean.length > 0 ? tokensClean.join(' · ') : 'empty'}
                </span>
              </div>
            </div>

            {/* CONCORDANCE */}
            <div className="glass-card" style={{ marginTop: '1rem', borderColor: 'rgba(170,68,255,0.2)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(170,68,255,0.6)', letterSpacing: '2px', marginBottom: '0.75rem' }}>
                // CONCORDANCE SEARCH
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  aria-label="Search word in corpus"
                  value={concordInput}
                  onChange={(e) => setConcordInput(e.target.value)}
                  placeholder="search word..."
                  style={{
                    flex: 1,
                    background: 'rgba(170, 68, 255, 0.05)',
                    border: '1px solid rgba(170, 68, 255, 0.2)',
                    color: '#fff',
                    padding: '0.4rem 0.6rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    outline: 'none',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleConcordSearch()}
                />
                <button
                  onClick={handleConcordSearch}
                  style={{
                    padding: '0.4rem 0.75rem',
                    border: '1px solid rgba(170, 68, 255, 0.4)',
                    background: 'rgba(170, 68, 255, 0.1)',
                    color: '#aa44ff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                  }}
                >
                  SEARCH
                </button>
              </div>
              <div
                id="concordResult"
                style={{
                  marginTop: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.5)',
                  minHeight: '2rem',
                  lineHeight: '1.8',
                }}
              >
                {searched && concordResults.length === 0 ? (
                  <span style={{ color: 'rgba(255,100,100,0.6)' }}>word not found in corpus</span>
                ) : (
                  concordResults.map((snippet, i) => {
                    const term = concordInput.trim().toLowerCase();
                    const regex = new RegExp(`(${term})`, 'gi');
                    const parts = snippet.split(regex);
                    
                    return (
                      <div key={i} style={{ color: 'rgba(170,68,255,0.8)', marginBottom: '0.3rem' }}>
                        {parts.map((p, idx) =>
                          p.toLowerCase() === term ? (
                            <span key={idx} style={{ color: '#fff', textDecoration: 'underline' }}>
                              {p}
                            </span>
                          ) : (
                            p
                          )
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div>
            {/* STAGES */}
            <div className="glass-card" style={{ borderColor: 'rgba(170,68,255,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(170,68,255,0.6)', letterSpacing: '2px', marginBottom: '1rem' }}>
                // NLP PIPELINE STAGES
              </div>
              <div id="pipelineStages">
                {stages.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: s.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        color: '#000',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: s.color, marginBottom: '0.2rem' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{s.ex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MEMORY CARD GAME */}
            <div className="game-container" style={{ marginTop: '1rem', borderColor: 'rgba(170,68,255,0.3)' }}>
              <div className="game-bar" style={{ color: '#aa44ff', borderColor: 'rgba(170,68,255,0.2)', background: 'rgba(170,68,255,0.1)' }}>
                <span>AI MEMORY MATCH</span>
                <span id="gameScore" style={{ color: '#aa44ff' }}>
                  MATCHES: {matches}/8
                </span>
              </div>
              
              <div className="memory-grid">
                {cards.map((card, i) => {
                  const showSymbol = card.isFlipped || card.isMatched;
                  return (
                    <div
                      key={card.id}
                      className={`mem-card${card.isFlipped ? ' flipped' : ''}${card.isMatched ? ' matched' : ''}`}
                      onClick={() => handleCardClick(i)}
                    >
                      {showSymbol ? card.symbol : '?'}
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', padding: '0 1rem 1rem' }}>
                <button
                  onClick={resetGame}
                  style={{
                    padding: '0.3rem 1rem',
                    border: '1px solid rgba(170, 68, 255, 0.3)',
                    background: 'transparent',
                    color: '#aa44ff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                  }}
                  className="game-reset-btn"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
