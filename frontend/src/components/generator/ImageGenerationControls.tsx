import React from 'react';
import { Image, Settings } from 'lucide-react';

interface ImageGenerationControlsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  className?: string;
}

const IMAGE_PRESETS = [
  { name: 'Square', width: 1024, height: 1024 },
  { name: 'Portrait', width: 768, height: 1024 },
  { name: 'Landscape', width: 1024, height: 768 },
  { name: 'Wide', width: 1152, height: 896 },
  { name: 'Ultra Wide', width: 1344, height: 768 },
];

export const ImageGenerationControls: React.FC<ImageGenerationControlsProps> = ({
  enabled,
  onToggle,
  width,
  height,
  onWidthChange,
  onHeightChange,
  className = '',
}) => {
  const handlePresetSelect = (preset: { width: number; height: number }) => {
    onWidthChange(preset.width);
    onHeightChange(preset.height);
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 ${className}`}>
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Image Generation</h3>
        </div>
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-sm font-medium text-blue-700">Enable</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full border-2 transition-colors ${
              enabled 
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-gray-300 border-gray-300'
            }`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } mt-0.5`} />
            </div>
          </div>
        </label>
      </div>

      {enabled && (
        <div className="space-y-4">
          {/* Dimension Presets */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">
              <Settings size={16} className="inline mr-1" />
              Dimension Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all hover:scale-105 ${
                    width === preset.width && height === preset.height
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-blue-700 border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div>{preset.name}</div>
                  <div className="text-xs opacity-75">{preset.width}×{preset.height}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">
                Width
              </label>
              <input
                type="number"
                min="512"
                max="2048"
                step="64"
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white 
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all
                         text-blue-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">
                Height
              </label>
              <input
                type="number"
                min="512"
                max="2048"
                step="64"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white 
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all
                         text-blue-900 font-medium"
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>📸 Image generation enabled!</strong> Generated prompts will be automatically 
              queued for AI image generation and processed in the background.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};