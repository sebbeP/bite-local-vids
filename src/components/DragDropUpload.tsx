
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Video, Upload, X, FileImage, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFilesSelected,
  accept = 'image/*,video/*',
  maxFiles = 5,
  maxSizeMB = 50,
  className = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
  }, [maxFiles, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles,
    multiple: maxFiles > 1
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    onFilesSelected(selectedFiles);
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <Upload className="h-8 w-8 text-gray-600" />
          </div>
          {isDragActive ? (
            <p className="text-orange-600 font-medium">Drop your files here!</p>
          ) : (
            <div>
              <p className="text-gray-700 font-medium mb-1">
                Drag & drop your media here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Up to {maxFiles} files, max {maxSizeMB}MB each
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Camera className="h-4 w-4" />
              Photos
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Video className="h-4 w-4" />
              Videos
            </div>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <FileImage className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FileVideo className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleUpload}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
