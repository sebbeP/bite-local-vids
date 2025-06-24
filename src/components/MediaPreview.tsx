
import React, { useState } from 'react';
import { X, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
  onEdit?: (file: File) => void;
  className?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  onRemove,
  onEdit,
  className = ''
}) => {
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setIsLoading(false);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isVideo = file.type.startsWith('video/');

  return (
    <div className={`relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 ${className}`}>
      {/* Media Display */}
      <div className="relative aspect-square bg-gray-100">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : isVideo ? (
          <video
            src={preview}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          />
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay Controls */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-none"
          >
            <X className="h-4 w-4" />
          </Button>
          {onEdit && !isVideo && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(file)}
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-none"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* File Type Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 text-xs font-medium bg-black/50 text-white rounded">
            {isVideo ? 'Video' : 'Photo'}
          </span>
        </div>
      </div>

      {/* File Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate mb-1">
          {file.name}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(file.size)}</span>
          <span>{isVideo ? 'Video' : 'Image'}</span>
        </div>
      </div>
    </div>
  );
};

export default MediaPreview;
