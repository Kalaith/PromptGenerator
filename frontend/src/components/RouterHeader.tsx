import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

interface GeneratorType {
  name: string;
  display_name: string;
  route_key: string;
  endpoint: string;
  is_active: boolean;
  sort_order: number;
}

interface GeneratorTypesResponse {
  success: boolean;
  data?: {
    generator_types?: GeneratorType[];
  };
}

const RouterHeader: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [generatorTypes, setGeneratorTypes] = useState<GeneratorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Protected routes that require authentication
  const protectedRoutes = ['/templates', '/description-templates', '/attribute-manager', '/attribute-options', '/generator-types'];

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (protectedRoutes.includes(path) && !isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    const fetchGeneratorTypes = async () => {
      try {
        const response = await apiClient.get<GeneratorTypesResponse>('/generator-types');
        
        if (response.success) {
          setGeneratorTypes(response.data?.generator_types || []);
        }
      } catch (err) {
        console.error('Error fetching generator types:', err);
        // Fallback to empty array if API fails
        setGeneratorTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratorTypes();
  }, []);

  // Static pages - always visible
  const publicNavItems = [
    { path: '/gallery', label: 'Gallery', icon: '🖼️' },
  ];

  // Management pages - only visible when authenticated
  const managementNavItems = [
    { path: '/templates', label: 'Templates', icon: '📝' },
    { path: '/description-templates', label: 'Description Templates', icon: '📖' },
    { path: '/attribute-manager', label: 'Attributes', icon: '⚙️' },
    { path: '/attribute-options', label: 'Attribute Options', icon: '🎯' },
    { path: '/generator-types', label: 'Generator Types', icon: '🔧' },
  ];

  // Filter management items based on authentication
  const visibleManagementItems = isAuthenticated ? managementNavItems : [];

  // Combine all static items
  const allStaticItems = [...publicNavItems, ...visibleManagementItems];

  // Get dynamic generator types plus static admin pages
  const navItems = [
    // Dynamic generator types - only show if loaded and not loading
    ...(!loading ? generatorTypes.map(type => ({
      path: `/${type.route_key}`,
      label: type.display_name,
      icon: getGeneratorTypeIcon(type.name) // We'll need to create this helper
    })) : []),
    // Static admin pages
    ...allStaticItems,
  ];

  // Helper function to get icon for generator type
  function getGeneratorTypeIcon(typeName: string): string {
    const iconMap: Record<string, string> = {
      'kemonomimi': '🐱',
      'monster-girl': '👾', 
      'monster': '👹',
      'adventurer': '⚔️',
      'alien': '👽',
      'anime': '✨'
    };
    return iconMap[typeName] || '🎭';
  }

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
                onClick={(e) => handleNavClick(path, e)}
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

          {/* Auth buttons */}
          <div className="flex justify-center mt-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl font-medium text-sm md:text-base
                  transition-all duration-300 transform hover:scale-105
                  backdrop-blur-sm border border-white/30
                  bg-white/10 text-white/90 hover:bg-white/20 hover:text-white hover:border-white/40
                  flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            ) : (
              <div className="text-white/80 text-sm">
                Login required for management features
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-sakura-400 via-violet-400 to-ocean-400"></div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default RouterHeader;
