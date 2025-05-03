// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout() {
  const { darkMode } = useTheme();
  
  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <Outlet />
    </div>
  );
}