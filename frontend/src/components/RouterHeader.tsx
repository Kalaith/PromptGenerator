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
  const { isAuthenticated, user, logout, getLinkAccountUrl } = useAuth();
  const [generatorTypes, setGeneratorTypes] = useState<GeneratorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

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
        setGeneratorTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratorTypes();
  }, []);

  const publicNavItems = [
    { path: '/gallery', label: 'Gallery', icon: 'Gallery' },
  ];

  const managementNavItems = [
    { path: '/templates', label: 'Templates', icon: 'Templates' },
    { path: '/description-templates', label: 'Description Templates', icon: 'Descriptions' },
    { path: '/attribute-manager', label: 'Attributes', icon: 'Attributes' },
    { path: '/attribute-options', label: 'Attribute Options', icon: 'Options' },
    { path: '/generator-types', label: 'Generator Types', icon: 'Types' },
  ];

  const visibleManagementItems = isAuthenticated ? managementNavItems : [];
  const allStaticItems = [...publicNavItems, ...visibleManagementItems];

  const navItems = [
    ...(!loading ? generatorTypes.map(type => ({
      path: `/${type.route_key}`,
      label: type.display_name,
      icon: getGeneratorTypeIcon(type.name)
    })) : []),
    ...allStaticItems,
  ];

  function getGeneratorTypeIcon(typeName: string): string {
    const iconMap: Record<string, string> = {
      'kemonomimi': 'Cat',
      'monster-girl': 'Monster Girl',
      'monster': 'Monster',
      'adventurer': 'Adventurer',
      'alien': 'Alien',
      'anime': 'Anime'
    };
    return iconMap[typeName] || 'Generator';
  }

  return (
    <header className="relative">
      <div className="bg-gradient-sunset backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-heading font-bold text-white mb-2 drop-shadow-lg">
              Anime Prompt Generator
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Create magical characters and worlds with AI
            </p>
          </div>

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
                <span className="text-sm font-semibold">{icon}</span>
                <span className="font-medium">{label}</span>
                {isActive(path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-glow-pulse"></div>
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sakura-400/20 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>

          <div className="flex justify-center mt-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.is_guest && (
                  <a
                    href={getLinkAccountUrl()}
                    className="px-4 py-2 rounded-xl font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-amber-200/60 bg-amber-50/20 text-white flex items-center gap-2"
                  >
                    <span>Link Account</span>
                  </a>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 bg-white/10 text-white/90 hover:bg-white/20 hover:text-white hover:border-white/40 flex items-center gap-2"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="text-white/80 text-sm">
                Login required for management features
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-sakura-400 via-violet-400 to-ocean-400"></div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default RouterHeader;
