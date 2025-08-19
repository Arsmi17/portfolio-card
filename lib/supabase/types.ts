export interface Profile {
  id: number
  name: string
  bio?: string
  avatar_url?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    youtube?: string
  }
  cv_url?: string
  contact?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  youtube_link?: string
  project_url?: string
  category: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  description: string
  content?: string
  image_url?: string
  category: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ContactResponse {
  id: string
  username: string
  email: string
  message: string
  is_archived: boolean
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
      }
      blogs: {
        Row: Blog
        Insert: Omit<Blog, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Blog, "id" | "created_at" | "updated_at">>
      }
      contact_responses: {
        Row: ContactResponse
        Insert: Omit<ContactResponse, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<ContactResponse, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
