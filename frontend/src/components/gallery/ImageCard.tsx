import React from 'react';
import { Download, Eye, Heart } from 'lucide-react';
import type { GeneratedImage } from '../../api/types';

interface ImageCardProps {
  image: GeneratedImage;
  onImageClick: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onToggleFavorite?: (image: GeneratedImage) => void;
  isFavorite?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onImageClick,
  onDownload,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(image);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(image);
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
      onClick={() => onImageClick(image)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image.thumbnail_url || image.gallery_url}
          alt={`Generated ${image.gallery_type} image`}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Overlay with actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200">
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteToggle}
              className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                isFavorite
                  ? 'bg-red-500/80 text-white hover:bg-red-600/80'
                  : 'bg-white/80 text-gray-700 hover:bg-white/90'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          
          <button
            onClick={handleDownload}
            className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white/90 transition-colors"
            title="Download image"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      
      {/* Info footer */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium capitalize">
            {image.gallery_type}
          </span>
          <span className="text-xs">
            {image.dimensions}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{image.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download size={12} />
              <span>{image.download_count}</span>
            </div>
          </div>
          <span>{image.file_size}</span>
        </div>
      </div>
      
      {image.is_featured && (
        <div className="absolute top-2 left-2">
          <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        </div>
      )}
    </div>
  );
};