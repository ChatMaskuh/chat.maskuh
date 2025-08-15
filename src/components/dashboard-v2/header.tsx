"use client";

import React, { useState, useEffect } from 'react';
import { Moon, ShoppingCart } from 'lucide-react';

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <ShoppingCart className="text-indigo-600" size={32} />
          Marketplace Dashboard
        </h1>
      </div>
      <button
        id="theme-toggle"
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
      >
        <Moon className="dark:text-yellow-400 text-gray-800" size={24} />
      </button>
    </header>
  );
}
