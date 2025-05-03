import React, { useState, useEffect } from 'react';
import { suggestions } from './suggest.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

const Suggestion = ({ inputValue, onSelect }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!inputValue.trim()) {
      return setFilteredSuggestions([]);
    }
    const filtered = suggestions.filter(item =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [inputValue]);

  if (filteredSuggestions.length === 0) return null;

  return (
    <div
  className={`${
    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
  } shadow rounded-md mt-1 max-h-40 overflow-y-auto`}
>
  {filteredSuggestions.map((item, index) => (
    <div
      key={index}
      onClick={() => onSelect(item)}
      className={`p-2 cursor-pointer ${
        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
      }`}
    >
      {item}
    </div>
  ))}
</div>


  );
};

export default Suggestion;
