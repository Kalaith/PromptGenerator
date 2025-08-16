import React, { useState } from 'react';

const Header: React.FC<{ setActivePanel: (panel: 'generator' | 'adventurer' | 'alien') => void }> = ({ setActivePanel }) => {
  return (
    <header className="bg-blue-500 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">Random Image Prompt Generator</h1>
      <div className="mt-2">
        <button
          onClick={() => setActivePanel('generator')}
          className="bg-white text-blue-500 py-1 px-3 rounded-md mr-2 hover:bg-gray-200"
        >
          Generator Panel
        </button>
        <button
          onClick={() => setActivePanel('adventurer')}
          className="bg-white text-blue-500 py-1 px-3 rounded-md mr-2 hover:bg-gray-200"
        >
          Adventurer Generator Panel
        </button>
        <button
          onClick={() => setActivePanel('alien')}
          className="bg-white text-blue-500 py-1 px-3 rounded-md hover:bg-gray-200"
        >
          Alien Generator Panel
        </button>
      </div>
    </header>
  );
};

export default Header;
