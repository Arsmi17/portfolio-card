"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { VerifiedBadge } from "@/components/verified-badge"
import { useThemeSettings } from "@/hooks/use-theme-settings"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  ExternalLink,
} from "lucide-react"
import type { Profile } from "@/hooks/use-profile"
import type { LinkItemProps } from "@/hooks/use-links"
import type { Project, Blog, Profile as DBProfile } from "@/lib/supabase/types"
import { ProjectModal } from "@/components/project-modal"

interface PortfolioViewProps {
  profile: Profile
  links: LinkItemProps[]
}

export function PortfolioView({ profile, links }: PortfolioViewProps) {
  const { themeSettings } = useThemeSettings()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [blogPosts, setBlogPosts] = useState<Blog[]>([])
  const [dbProfile, setDbProfile] = useState<DBProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentProject, setCurrentProject] = useState(0)
  const [currentBlog, setCurrentBlog] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    username: "",
    email: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[v0] Fetching portfolio data...")

        const profileResponse = await fetch("/api/profile")
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          console.log("[v0] Profile data:", profileData)
          setDbProfile(profileData)
        }

        // Fetch featured projects (public endpoint)
        const projectsResponse = await fetch("/api/projects")
        console.log("[v0] Projects response status:", projectsResponse.status)
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          console.log("[v0] Projects data:", projectsData)
          setProjects(projectsData.filter((p: Project) => p.is_featured))
        }

        // Fetch published blogs (public endpoint)
        const blogsResponse = await fetch("/api/blogs")
        console.log("[v0] Blogs response status:", blogsResponse.status)
        if (blogsResponse.ok) {
          const blogsData = await blogsResponse.json()
          console.log("[v0] Blogs data:", blogsData)
          setBlogPosts(blogsData.filter((b: Blog) => b.is_published))
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSocialButtons = () => {
    if (!dbProfile?.social) return []

    const socialIcons: Record<string, React.ComponentType<any>> = {
      github: Github,
      twitter: Twitter,
      linkedin: Linkedin,
      youtube: Youtube,
    }

    return Object.entries(dbProfile.social)
      .filter(([_, url]) => url && url.trim() !== "")
      .map(([platform, url]) => {
        const Icon = socialIcons[platform.toLowerCase()] || ExternalLink
        return {
          platform,
          url: url as string,
          icon: Icon,
        }
      })
  }

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const nextBlog = () => {
    setCurrentBlog((prev) => (prev + 1) % blogPosts.length)
  }

  const prevBlog = () => {
    setCurrentBlog((prev) => (prev - 1 + blogPosts.length) % blogPosts.length)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        })
        setContactForm({ username: "", email: "", message: "" })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleContactChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const displayProfile = {
    name: dbProfile?.name || profile.name,
    bio: dbProfile?.bio || profile.bio,
    avatarUrl: dbProfile?.avatar_url || profile.avatarUrl,
    verified: profile.verified,
  }

  const socialButtons = getSocialButtons()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section - Now takes equal space */}
        <Card
          className={cn(
            "shadow-lg border-2 bg-background",
            themeSettings.borderRadius,
            themeSettings.effects.shadow ? "shadow-lg" : "shadow-none",
            themeSettings.effects.glassmorphism && "glassmorphism",
          )}
          style={{ opacity: themeSettings.effects.cardOpacity }}
        >
          <CardContent className="p-6">
            <div className={cn("flex flex-col items-center space-y-4", themeSettings.font)}>
              <Avatar className="h-24 w-24">
                <AvatarImage src={displayProfile.avatarUrl || "/placeholder.svg"} alt={displayProfile.name} />
                <AvatarFallback>{displayProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-2xl font-bold">{displayProfile.name}</h2>
                  {displayProfile.verified && <VerifiedBadge />}
                </div>
                <p className="text-muted-foreground mt-2 text-base max-w-md">{displayProfile.bio}</p>
              </div>

              <div className="flex gap-3 mt-6 flex-wrap justify-center">
                {socialButtons.map(({ platform, url, icon: Icon }) => (
                  <Button key={platform} variant="outline" size="sm" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{platform}</span>
                    </a>
                  </Button>
                ))}
              </div>

              {/* Contact Form */}
              <Card className="w-full mt-8">
                <CardHeader>
                  <CardTitle className="text-lg">Get In Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your name"
                        value={contactForm.username}
                        onChange={(e) => handleContactChange("username", e.target.value)}
                        required
                        disabled={submitting}
                      />
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={contactForm.email}
                        onChange={(e) => handleContactChange("email", e.target.value)}
                        required
                        disabled={submitting}
                      />
                    </div>
                    <Textarea
                      placeholder="Your message"
                      value={contactForm.message}
                      onChange={(e) => handleContactChange("message", e.target.value)}
                      rows={4}
                      required
                      disabled={submitting}
                    />
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section - Now takes equal space */}
        <Card className={cn("shadow-lg border-2 bg-background", themeSettings.borderRadius)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Featured Projects</CardTitle>
            {projects.length > 1 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevProject}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextProject}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="pb-6">
            {projects.length > 0 ? (
              <div className="relative">
                {/* Project Stack Visualization */}
                <div className="relative h-80 mb-4">
                  {projects.map((project, index) => {
                    const offset = index * 8
                    const isActive = index === currentProject
                    return (
                      <div
                        key={project.id}
                        className={cn(
                          "absolute inset-0 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:scale-105",
                          isActive ? "z-20 scale-100 opacity-100" : "z-10 scale-95 opacity-60",
                        )}
                        style={{
                          transform: `translateY(${offset}px) translateX(${offset}px) ${isActive ? "scale(1)" : "scale(0.95)"}`,
                          backgroundColor: isActive ? "hsl(var(--card))" : "hsl(var(--muted))",
                        }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <div className="p-4 h-full flex flex-col">
                          {project.youtube_link ? (
                            <div className="w-full h-40 mb-3 relative group">
                              <iframe
                                src={`https://www.youtube.com/embed/${
                                  project.youtube_link.includes("watch?v=")
                                    ? project.youtube_link.split("watch?v=")[1].split("&")[0]
                                    : project.youtube_link.split("/").pop()
                                }`}
                                className="w-full h-full rounded pointer-events-none"
                                frameBorder="0"
                                title={project.title}
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                <span className="text-white text-sm font-medium">Click to view details</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-40 mb-3 relative group">
                              <img
                                src="/project-placeholder.png"
                                alt={project.title}
                                className="w-full h-full object-cover rounded"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                <span className="text-white text-sm font-medium">Click to view details</span>
                              </div>
                            </div>
                          )}
                          <h3 className="font-semibold text-base mb-2">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-2">
                            {project.quick_description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {project.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Navigation */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    {currentProject + 1} of {projects.length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No featured projects available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className={cn("shadow-lg border-2 bg-background", themeSettings.borderRadius)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Latest Blog Posts</CardTitle>
          {blogPosts.length > 1 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={prevBlog}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextBlog}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="pb-6">
          {blogPosts.length > 0 ? (
            <div className="relative">
              {/* Blog Card with improved layout */}
              <div className="min-h-[280px] mb-4">
                <div className="rounded-lg border-2 p-6 bg-card flex flex-col h-full">
                  <img
                    src={blogPosts[currentBlog]?.image_url || "/placeholder.svg"}
                    alt={blogPosts[currentBlog]?.title}
                    className="w-full h-32 object-cover rounded mb-4 flex-shrink-0"
                  />
                  <h3 className="font-semibold text-lg mb-3 flex-shrink-0">{blogPosts[currentBlog]?.title}</h3>

                  <div className="flex-1 mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {blogPosts[currentBlog]?.description}
                    </p>
                    {blogPosts[currentBlog]?.description && blogPosts[currentBlog].description.length > 150 && (
                      <button className="text-xs text-primary hover:underline mt-1">Read more...</button>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground flex-shrink-0">
                    <span>{new Date(blogPosts[currentBlog]?.created_at).toLocaleDateString()}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {blogPosts[currentBlog]?.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  {currentBlog + 1} of {blogPosts.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No blog posts available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ProjectModal component */}
      {selectedProject && <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  )
}
