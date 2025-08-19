import { createClient } from "./server"
import type { Profile, Project, Blog, ContactResponse } from "./types"

// Profile queries
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select("*").single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function getPublicProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select("*").limit(1).single()

  if (error) {
    console.error("Error fetching public profile:", error)
    return null
  }

  return data
}

// Project queries
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  let query = supabase.from("projects").select("*").order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data || []
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching featured projects:", error)
    return []
  }

  return data || []
}

// Blog queries
export async function getBlogs(publishedOnly = true): Promise<Blog[]> {
  const supabase = createClient()
  let query = supabase.from("blogs").select("*").order("created_at", { ascending: false })

  if (publishedOnly) {
    query = query.eq("is_published", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching blogs:", error)
    return []
  }

  return data || []
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching published blogs:", error)
    return []
  }

  return data || []
}

// Contact response queries
export async function getContactResponses(): Promise<ContactResponse[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("contact_responses").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contact responses:", error)
    return []
  }

  return data || []
}