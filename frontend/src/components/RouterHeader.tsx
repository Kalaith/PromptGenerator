import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getGeneratorTypes } from '../config/generatorTypes';

const RouterHeader: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Get dynamic generator types plus static admin pages
  const generatorTypes = getGeneratorTypes();
  const navItems = [
    // Dynamic generator types
    ...generatorTypes.map(type => ({
      path: `/${type.slug}`,
      label: type.name,
      icon: type.icon
    })),
    // Static admin pages
    { path: '/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/templates', label: 'Templates', icon: '📝' },
    { path: '/description-templates', label: 'Description Templates', icon: '📖' },
    { path: '/attribute-manager', label: 'Attributes', icon: '⚙️' },
    { path: '/attribute-options', label: 'Attribute Options', icon: '🎯' },
    { path: '/generator-types', label: 'Generator Types', icon: '🔧' },
  ];

  return (
    <header className="relative">
      {/* Header background with gradient and glass effect */}
      <div className="bg-gradient-sunset backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          {/* Main title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-heading font-bold text-white mb-2 drop-shadow-lg">
              ✨ Anime Prompt Generator ✨
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Create magical characters and worlds with AI
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-2 md:gap-3">
            {navItems.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`
                  group relative px-4 py-2 rounded-xl font-medium text-sm md:text-base
                  transition-all duration-300 transform hover:scale-105
                  backdrop-blur-sm border border-white/30
                  flex items-center gap-2 min-w-fit
                  ${isActive(path)
                    ? 'bg-white/20 text-white shadow-glow border-white/50 scale-105'
                    : 'bg-white/10 text-white/90 hover:bg-white/20 hover:text-white hover:border-white/40'
                  }
                `}
              >
                <span className="text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
                
                {/* Active indicator */}
                {isActive(path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-glow-pulse"></div>
                )}
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sakura-400/20 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-sakura-400 via-violet-400 to-ocean-400"></div>
    </header>
  );
};

export default RouterHeader;