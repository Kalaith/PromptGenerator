import React, { useState } from 'react';
import { ImageGallery, ImageQueue } from '../components/gallery';
import type { GalleryType } from '../api/types';

export const GalleryPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<GalleryType | undefined>(undefined);
  const [showQueue, setShowQueue] = useState(false);

  const galleryTypes: { value: GalleryType; label: string; description: string }[] = [
    { value: 'anime', label: 'Anime Characters', description: 'Classic anime-style character artwork' },
    { value: 'alien', label: 'Alien Beings', description: 'Extraterrestrial character designs' },
    { value: 'race', label: 'Fantasy Races', description: 'Elves, dwarves, and other fantasy races' },
    { value: 'monster', label: 'Monsters', description: 'Creatures and monster designs' },
    { value: 'monsterGirl', label: 'Monster Girls', description: 'Anthropomorphic monster characters' },
    { value: 'animalGirl', label: 'Animal Girls', description: 'Kemonomimi and animal-inspired characters' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
                <p className="mt-2 text-gray-600">
                  Browse and download AI-generated character artwork
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showQueue
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showQueue ? 'Hide Queue' : 'Show Queue'}
                </button>
              </div>
            </div>

            {/* Gallery Type Selector */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType(undefined)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === undefined
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All Types
                </button>
                
                {galleryTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedType === type.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    title={type.description}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Queue Sidebar */}
          {showQueue && (
            <div className="lg:col-span-1">
              <ImageQueue
                className="sticky top-8"
                autoRefresh={true}
                refreshInterval={5000}
              />
            </div>
          )}

          {/* Gallery */}
          <div className={showQueue ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <ImageGallery galleryType={selectedType} />
          </div>
        </div>
      </div>
    </div>
  );
};