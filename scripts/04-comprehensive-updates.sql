-- Add contact and email fields to profile table with defaults
ALTER TABLE profiles 
ADD COLUMN contact TEXT DEFAULT '7802091131',
ADD COLUMN email TEXT DEFAULT 'hpmistry99@gmail.com';

-- Add incremental ID fields to all tables for better admin management
ALTER TABLE projects ADD COLUMN display_id SERIAL;
ALTER TABLE blogs ADD COLUMN display_id SERIAL;
ALTER TABLE contact_responses ADD COLUMN display_id SERIAL;

-- Create archived contact responses table
CREATE TABLE archived_contact_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_id SERIAL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable RLS on archived table
ALTER TABLE archived_contact_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for archived responses
CREATE POLICY "Enable all operations for authenticated users" ON archived_contact_responses
FOR ALL USING (auth.role() = 'authenticated');

-- Insert default profile data for Harsh Mistry
INSERT INTO profiles (
  user_id, 
  name, 
  bio, 
  social, 
  cv_url, 
  contact, 
  email
) VALUES (
  (SELECT auth.uid()),
  'Harsh Mistry',
  'A passionate game developer',
  '{"github": "https://github.com", "twitter": "https://twitter.com", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}',
  'https://www.cv.com',
  '7802091131',
  'hpmistry99@gmail.com'
) ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  social = EXCLUDED.social,
  cv_url = EXCLUDED.cv_url,
  contact = EXCLUDED.contact,
  email = EXCLUDED.email;

-- Add notification tracking for contact responses
ALTER TABLE contact_responses 
ADD COLUMN is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
