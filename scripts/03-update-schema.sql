-- Update projects table: remove image_url, add youtube_link
ALTER TABLE projects DROP COLUMN IF EXISTS image_url;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS youtube_link TEXT;

-- Update profiles table: replace individual social URLs with JSON social field
ALTER TABLE profiles DROP COLUMN IF EXISTS twitter_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS github_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS linkedin_url;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social JSONB DEFAULT '{}';

-- Change avatar_url to support file uploads (keeping as TEXT for now, will handle upload in frontend)
-- The avatar_url will store the uploaded file path/URL
