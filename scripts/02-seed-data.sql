-- Insert sample profile data
INSERT INTO profiles (id, name, bio, avatar_url, twitter_url, github_url, linkedin_url)
VALUES (
  gen_random_uuid(),
  'Harsh Mistry',
  'Full-stack developer passionate about creating innovative web solutions. Experienced in React, Next.js, and modern web technologies.',
  '/professional-developer-avatar.png',
  'https://twitter.com/harshmistry',
  'https://github.com/harshmistry',
  'https://linkedin.com/in/harshmistry'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (user_id, title, quick_description, full_description, image_url, project_url, category, is_featured)
VALUES 
  (
    (SELECT id FROM profiles LIMIT 1),
    'E-commerce Platform',
    'Modern e-commerce solution with React and Node.js',
    'A full-featured e-commerce platform built with React, Next.js, and Stripe integration. Features include user authentication, product catalog, shopping cart, and payment processing.',
    '/modern-ecommerce-website.png',
    'https://github.com/harshmistry/ecommerce-platform',
    'Web Development',
    true
  ),
  (
    (SELECT id FROM profiles LIMIT 1),
    'Task Management App',
    'Collaborative task management with real-time updates',
    'A comprehensive task management application with real-time collaboration features, built using React, Socket.io, and MongoDB.',
    '/task-management-dashboard.png',
    'https://github.com/harshmistry/task-manager',
    'Web Development',
    true
  ),
  (
    (SELECT id FROM profiles LIMIT 1),
    'Weather Dashboard',
    'Beautiful weather app with location-based forecasts',
    'An elegant weather dashboard that provides detailed weather information and forecasts based on user location, built with React and OpenWeather API.',
    '/weather-dashboard-interface.png',
    'https://github.com/harshmistry/weather-dashboard',
    'Mobile Development',
    false
  );

-- Insert sample blog posts
INSERT INTO blogs (user_id, title, description, content, image_url, category, is_published)
VALUES 
  (
    (SELECT id FROM profiles LIMIT 1),
    'Getting Started with React Server Components',
    'Learn how to leverage React Server Components for better performance and user experience in your Next.js applications.',
    'React Server Components represent a paradigm shift in how we build React applications...',
    '/react-code-on-screen.png',
    'React',
    true
  ),
  (
    (SELECT id FROM profiles LIMIT 1),
    'The Future of Web Development',
    'Exploring emerging trends and technologies that will shape the future of web development.',
    'The web development landscape is constantly evolving with new frameworks, tools, and methodologies...',
    '/futuristic-web-development.png',
    'Web Development',
    true
  ),
  (
    (SELECT id FROM profiles LIMIT 1),
    'TypeScript Best Practices',
    'Essential TypeScript patterns and practices for building maintainable applications.',
    'TypeScript has become an essential tool for modern JavaScript development...',
    '/typescript-code-editor.png',
    'TypeScript',
    false
  );
