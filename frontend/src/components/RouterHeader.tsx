import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const RouterHeader: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-blue-500 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">Random Image Prompt Generator</h1>
      <div className="mt-2">
        <Link
          to="/anime"
          className={`py-1 px-3 rounded-md mr-2 transition-colors ${
            isActive('/anime') 
              ? 'bg-blue-700 text-white' 
              : 'bg-white text-blue-500 hover:bg-gray-200'
          }`}
        >
          Anime Generator
        </Link>
        <Link
          to="/adventurer"
          className={`py-1 px-3 rounded-md mr-2 transition-colors ${
            isActive('/adventurer') 
              ? 'bg-blue-700 text-white' 
              : 'bg-white text-blue-500 hover:bg-gray-200'
          }`}
        >
          Adventurer Generator
        </Link>
        <Link
          to="/alien"
          className={`py-1 px-3 rounded-md transition-colors ${
            isActive('/alien') 
              ? 'bg-blue-700 text-white' 
              : 'bg-white text-blue-500 hover:bg-gray-200'
          }`}
        >
          Alien Generator
        </Link>
      </div>
    </header>
  );
};

export default RouterHeader;