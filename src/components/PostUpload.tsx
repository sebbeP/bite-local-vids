import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Video, X, Plus } from 'lucide-react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useToast } from '@/hooks/use-toast';

interface PostUploadProps {
  children: React.ReactNode;
}

const PostUpload = ({ children }: PostUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [feedType, setFeedType] = useState<'foodporn' | 'hungry'>('foodporn');
  const { uploadFile, isUploading } = useMediaUpload();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Only images and videos are allowed",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const file of selectedFiles) {
        const fileType = file.type.startsWith('image/') ? 'photo' : 'video';
        await uploadFile(file, fileType, { 
          caption,
          feedType 
        });
      }
      
      toast({
        title: "Success!",
        description: "Your post has been uploaded successfully"
      });
      
      setIsOpen(false);
      setSelectedFiles([]);
      setCaption('');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your post",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Feed Type Selection */}
          <div>
            <Label>Feed</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={feedType === 'foodporn' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedType('foodporn')}
              >
                Food Porn
              </Button>
              <Button
                variant={feedType === 'hungry' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedType('hungry')}
              >
                Hungry Mode
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label>Upload Media</Label>
            <div className="mt-2">
              <input
                type="file"
                id="media-upload"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Label
                htmlFor="media-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors"
              >
                <div className="text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to add photos or videos</p>
                </div>
              </Label>
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Caption */}
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || selectedFiles.length === 0}
              className="flex-1"
            >
              {isUploading ? 'Uploading...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostUpload;