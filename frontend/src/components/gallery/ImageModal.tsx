import React, { useEffect, useState } from 'react';
import { X, Download, Eye, Heart, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GeneratedImage } from '../../api/types';

interface ImageModalProps {
  image: GeneratedImage | null;
  images: GeneratedImage[];
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => void;
  onToggleFavorite?: (image: GeneratedImage) => void;
  isFavorite?: boolean;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  image,
  images,
  isOpen,
  onClose,
  onDownload,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (image && images.length > 0) {
      const index = images.findIndex(img => img.id === image.id);
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, [image, images]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigatePrevious();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
        case 'i':
        case 'I':
          setShowDetails(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, images.length]);

  const navigatePrevious = () => {
    if (images.length > 0) {
      setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const navigateNext = () => {
    if (images.length > 0) {
      setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const currentImage = images[currentIndex] || image;

  if (!isOpen || !currentImage) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    onDownload(currentImage);
  };

  const handleFavoriteToggle = () => {
    onToggleFavorite?.(currentImage);
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={navigatePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            title="Previous image (←)"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={navigateNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            title="Next image (→)"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4 text-white">
          <h3 className="text-lg font-semibold capitalize">
            {currentImage.gallery_type} Image
          </h3>
          {images.length > 1 && (
            <span className="text-sm text-gray-300">
              {currentIndex + 1} of {images.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(prev => !prev)}
            className={`p-2 rounded-full transition-colors ${
              showDetails 
                ? 'bg-blue-500 text-white' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title="Toggle details (I)"
          >
            <Info size={18} />
          </button>
          
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          
          <button
            onClick={handleDownload}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            title="Download image"
          >
            <Download size={18} />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
        <img
          src={currentImage.gallery_url}
          alt={`Generated ${currentImage.gallery_type} image`}
          className="max-w-full max-h-full object-contain"
          style={{ minHeight: '200px', minWidth: '200px' }}
        />
      </div>

      {/* Details panel */}
      {showDetails && (
        <div className="absolute right-4 top-16 bottom-4 w-80 bg-white rounded-lg p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Image Details</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type:</dt>
                  <dd className="font-medium capitalize">{currentImage.gallery_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Dimensions:</dt>
                  <dd className="font-medium">{currentImage.dimensions}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">File Size:</dt>
                  <dd className="font-medium">{currentImage.file_size}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Format:</dt>
                  <dd className="font-medium uppercase">{currentImage.format}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Views:</dt>
                  <dd className="font-medium">{currentImage.view_count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Downloads:</dt>
                  <dd className="font-medium">{currentImage.download_count}</dd>
                </div>
              </dl>
            </div>

            {currentImage.generation_params && Object.keys(currentImage.generation_params).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Generation Parameters</h4>
                <dl className="space-y-2 text-sm">
                  {Object.entries(currentImage.generation_params).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</dt>
                      <dd className="font-medium text-right max-w-32 truncate" title={String(value)}>
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {currentImage.collections && currentImage.collections.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Collections</h4>
                <div className="flex flex-wrap gap-2">
                  {currentImage.collections.map((collection) => (
                    <span
                      key={collection.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {collection.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-400">
                Created: {new Date(currentImage.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};