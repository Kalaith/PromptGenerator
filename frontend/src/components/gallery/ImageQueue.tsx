import React, { useEffect, useState } from 'react';
import { Clock, X, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useImageStore } from '../../stores/imageStore';
import type { ImageQueueItem } from '../../api/types';

interface ImageQueueProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const ImageQueue: React.FC<ImageQueueProps> = ({
  className = '',
  autoRefresh = true,
  refreshInterval = 5000, // 5 seconds
}) => {
  const {
    queue,
    queueLoading,
    queueError,
    fetchQueue,
    cancelQueueItem,
  } = useImageStore();

  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial load
    fetchQueue();

    // Set up auto-refresh if enabled
    if (autoRefresh && refreshInterval > 0) {
      const timer = setInterval(() => {
        fetchQueue();
      }, refreshInterval);
      
      setRefreshTimer(timer);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [autoRefresh, refreshInterval]);

  const handleManualRefresh = () => {
    fetchQueue();
  };

  const handleCancelItem = async (queueId: number) => {
    try {
      await cancelQueueItem(queueId);
      fetchQueue(); // Refresh after cancellation
    } catch (error) {
      console.error('Failed to cancel queue item:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <RefreshCw size={16} className="animate-spin" />;
      case 'completed':
        return <ImageIcon size={16} />;
      case 'failed':
        return <AlertCircle size={16} />;
      case 'cancelled':
        return <X size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const pendingCount = queue.filter(item => item.status === 'pending').length;
  const processingCount = queue.filter(item => item.status === 'processing').length;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Generation Queue</h3>
            
            {(pendingCount > 0 || processingCount > 0) && (
              <div className="flex items-center gap-2">
                {pendingCount > 0 && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {pendingCount} pending
                  </span>
                )}
                {processingCount > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {processingCount} processing
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={queueLoading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh queue"
          >
            <RefreshCw size={18} className={queueLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Error State */}
        {queueError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={16} />
              <p className="font-medium">Error loading queue</p>
            </div>
            <p className="text-sm text-red-600 mt-1">{queueError}</p>
          </div>
        )}

        {/* Loading State */}
        {queueLoading && queue.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading queue...</span>
          </div>
        )}

        {/* Empty State */}
        {!queueLoading && queue.length === 0 && !queueError && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-3">
              <ImageIcon size={32} className="mx-auto" />
            </div>
            <p className="text-gray-600">No images in generation queue</p>
            <p className="text-sm text-gray-500 mt-1">
              Generated images will appear here while processing
            </p>
          </div>
        )}

        {/* Queue Items */}
        {queue.length > 0 && (
          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-3 transition-all ${getStatusColor(item.status)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(item.status)}
                      <span className="font-medium capitalize">
                        {item.generator_type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="ml-1 font-medium">{item.width}×{item.height}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Requested:</span>
                        <span className="ml-1 font-medium">
                          {new Date(item.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {item.error_message && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Error:</strong> {item.error_message}
                      </div>
                    )}

                    {item.estimated_completion_time && item.status === 'processing' && (
                      <div className="mt-2 text-sm text-blue-600">
                        <strong>Estimated completion:</strong>{' '}
                        {new Date(item.estimated_completion_time).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {(item.status === 'pending' || item.status === 'processing') && (
                      <button
                        onClick={() => handleCancelItem(item.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Cancel generation"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar for processing items */}
                {item.status === 'processing' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: '45%' }} // Placeholder - could be dynamic if progress is available
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Auto-refresh indicator */}
        {autoRefresh && queue.some(item => ['pending', 'processing'].includes(item.status)) && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              <RefreshCw size={12} />
              Auto-refreshing every {refreshInterval / 1000} seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
};