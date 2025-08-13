'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitch = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`grid grid-rows-[1fr_1fr] gap-2 ${className}`}>
      <label className='text-primary font-bold'>Theme Selection</label>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value='system'>System</option>
        <option value='dark'>Dark</option>
        <option value='light'>Light</option>
        <option value='modern-light'>Modern Light</option>
        <option value='modern-dark'>Modern Dark</option>
        <option value='retro-light'>Retro Light</option>
        <option value='retro-dark'>Retro Dark</option>
        <option value='bubbly'>Bubbly</option>
      </select>
    </div>
  );
};

export default ThemeSwitch;
