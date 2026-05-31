import React, { useEffect, useState } from 'react';

export default function Navbar({
  activeTimeline,
  onSelectTimeline,
  navigationMode,
  onToggleNavigationMode,
}) {
  const [clockTime, setClockTime] = useState('88:00:00');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setClockTime(`${h}:${m}:${s}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { id: 'hero', label: 'ABOUT' },
    { id: 'y2023', label: '2023' },
    { id: 'y2024', label: '2024' },
    { id: 'y2025', label: '2025' },
    { id: 'y2026', label: '2026' },
    { id: 'future', label: 'FUTURE' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo">DEV.TIMELINE</div>
      
      <div className="nav-links">
        {/* Navigation Mode Toggle Switch */}
        <div className="mode-toggle" title="Toggle between discrete multi-page Time Warp and continuous Timeline scroll">
          <span>TIME WARP</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              aria-label="Toggle navigation mode"
              checked={navigationMode === 'scroll'}
              onChange={() => onToggleNavigationMode(navigationMode === 'scroll' ? 'warp' : 'scroll')}
            />
            <span className="toggle-slider" />
          </label>
          <span>SCROLL</span>
        </div>

        {links.map((link) => (
          <button
            key={link.id}
            className={`nav-link ${activeTimeline === link.id ? 'active' : ''}`}
            onClick={() => onSelectTimeline(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>
      
      <div className="nav-time" id="navClock">
        {clockTime}
      </div>
    </nav>
  );
}
