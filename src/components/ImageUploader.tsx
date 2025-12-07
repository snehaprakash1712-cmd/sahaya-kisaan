import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  analysisType: 'pest' | 'soil' | 'disease';
  onAnalysisComplete: (analysis: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  analysisType,
  onAnalysisComplete,
}) => {
  const { language, t } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image must be less than 5MB', variant: 'destructive' });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    try {
      // Upload to Supabase Storage
      setIsUploading(true);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      
      // Convert base64 to blob
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(fileName, blob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;
      setIsUploading(false);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('crop-images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Call analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-crop', {
        body: { imageUrl, analysisType, language },
      });

      if (error) throw error;

      onAnalysisComplete(data.analysis);
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!imagePreview ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-24 flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-6 h-6 text-primary" />
            <span className="text-sm">Take Photo</span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-24 flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-primary" />
            <span className="text-sm">Upload Image</span>
          </Button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full w-8 h-8"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {imagePreview && (
        <Button
          variant="hero"
          className="w-full"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isUploading ? 'Uploading...' : 'Analyzing...'}
            </>
          ) : (
            'Analyze Image'
          )}
        </Button>
      )}
    </div>
  );
};
