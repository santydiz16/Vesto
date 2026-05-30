-- ============================================================
-- VESTO — Storage bucket for product images
-- Run this AFTER 001_initial.sql in your Supabase SQL editor
-- ============================================================

-- Create bucket (public = URLs are publicly readable without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public can read any image
CREATE POLICY "public_read_product_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Anon can upload (UI-gated by VESTO_ADMIN_PASS)
CREATE POLICY "anon_upload_product_images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Anon can delete (for image replacement)
CREATE POLICY "anon_delete_product_images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
