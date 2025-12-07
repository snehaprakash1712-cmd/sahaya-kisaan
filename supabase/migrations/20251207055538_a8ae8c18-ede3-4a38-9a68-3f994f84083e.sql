-- Create storage bucket for crop/pest/soil images
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-images', 'crop-images', true);

-- Allow anyone to view images
CREATE POLICY "Public read access for crop images"
ON storage.objects FOR SELECT
USING (bucket_id = 'crop-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload crop images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'crop-images');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update crop images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'crop-images');

-- Allow authenticated users to delete their images
CREATE POLICY "Authenticated users can delete crop images"
ON storage.objects FOR DELETE
USING (bucket_id = 'crop-images');