import React, { useEffect, useState } from 'react';
import { Search, Filter, Grid, List, Download, Star } from 'lucide-react';
import { ImageCard } from './ImageCard';
import { ImageModal } from './ImageModal';
import { useImageStore } from '../../stores/imageStore';
import { useSession } from '../../hooks/useSession';
import type { GeneratedImage, GalleryType } from '../../api/types';

interface ImageGalleryProps {
  galleryType?: GalleryType;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  galleryType,
  className = '',
}) => {
  const {
    images,
    loading,
    error,
    pagination,
    filters,
    fetchImages,
    downloadImage,
    updateFilters,
    loadMore,
  } = useImageStore();

  const { addToFavorites, removeFromFavorites } = useSession();
  
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Load images on component mount and when galleryType changes
  useEffect(() => {
    const initialFilters = {
      ...filters,
      type: galleryType || filters.type,
      page: 1, // Reset to first page when type changes
    };
    
    updateFilters(initialFilters);
    fetchImages();
  }, [galleryType]);

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      await downloadImage(image.id);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleToggleFavorite = async (image: GeneratedImage) => {
    try {
      // This would require session/favorites implementation
      console.log('Toggle favorite for image:', image.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    };
    
    updateFilters(updatedFilters);
    fetchImages();
  };

  const handleLoadMore = () => {
    if (pagination.has_more && !loading) {
      loadMore();
    }
  };

  const handleSortChange = (sortBy: string) => {
    handleFilterChange({ sort_by: sortBy });
  };

  const gridCols = viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {galleryType ? `${galleryType.charAt(0).toUpperCase() + galleryType.slice(1)} Gallery` : 'Image Gallery'}
          </h2>
          
          {pagination.total_items > 0 && (
            <span className="text-sm text-gray-500">
              {pagination.total_items} images
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Toggle filters"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Viewed</option>
                <option value="downloads">Most Downloaded</option>
              </select>
            </div>

            {/* Gallery Type (if not specified in props) */}
            {!galleryType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange({ type: e.target.value as GalleryType || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="anime">Anime</option>
                  <option value="alien">Alien</option>
                  <option value="race">Race</option>
                  <option value="monster">Monster</option>
                  <option value="monsterGirl">Monster Girl</option>
                  <option value="animalGirl">Animal Girl</option>
                </select>
              </div>
            )}

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={filters.featured || false}
                onChange={(e) => handleFilterChange({ featured: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Star size={16} />
                Featured only
              </label>
            </div>

            {/* Per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images per page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <p className="font-medium">Error loading images</p>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && images.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading images...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600">
            {filters.type || galleryType 
              ? `No ${filters.type || galleryType} images available yet.`
              : 'No images have been generated yet.'
            }
          </p>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <>
          <div className={`grid ${gridCols} gap-4`}>
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onImageClick={handleImageClick}
                onDownload={handleDownload}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={false} // TODO: Implement favorites checking
              />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.has_more && (
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </div>
                ) : (
                  `Load More (${pagination.total_items - images.length} remaining)`
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        images={images}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={handleDownload}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={false} // TODO: Implement favorites checking
      />
    </div>
  );
};