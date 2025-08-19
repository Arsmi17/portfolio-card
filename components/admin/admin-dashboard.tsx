"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/actions"
import {
  BarChart3,
  FileText,
  FolderOpen,
  User,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  Archive,
  LogOut,
  Loader2,
  Search,
  Filter,
} from "lucide-react"
import type { Project, Blog, ContactResponse, Profile } from "@/lib/supabase/types"
import { RichTextEditor } from "@/components/ui/rich-text-editor"; // Import the new editor
import { Textarea } from "@/components/ui/textarea"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
  { id: "contact-response", label: "Contact Response", icon: MessageSquare },
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [contactResponses, setContactResponses] = useState<ContactResponse[]>([])
  const [archivedResponses, setArchivedResponses] = useState<ContactResponse[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  const [projectSearch, setProjectSearch] = useState("")
  const [blogSearch, setBlogSearch] = useState("")
  const [contactSearch, setContactSearch] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")
  const [blogFilter, setBlogFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")

  const [projectDescription, setProjectDescription] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const { toast } = useToast()

  const unreadCount = contactResponses.filter((r) => !r.is_read && !r.is_archived).length

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    }
  }

  const fetchContactResponses = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setContactResponses(data.filter((r: ContactResponse) => !r.is_archived))
        setArchivedResponses(data.filter((r: ContactResponse) => r.is_archived))
      }
    } catch (error) {
      console.error("Error fetching contact responses:", error)
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchBlogs()
    fetchContactResponses()
    fetchProfile()
  }, [])

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

      const formData = new FormData(e.currentTarget);

      const projectData = {
        title: formData.get("title") as string,
        description: projectDescription,
        youtube_link: formData.get("youtube_link") as string,
        project_url: formData.get("project_url") as string,
        category: formData.get("category") as string,
        is_featured: formData.get("is_featured") === "on",
      };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        toast({ title: "Success", description: "Project added successfully!" });
        fetchProjects();
        e.currentTarget.reset();
        setProjectDescription("");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const blogData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: blogContent,
      category: formData.get("category") as string,
      is_published: formData.get("is_published") === "on",
    };

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blog post added successfully!",
        });
        fetchBlogs();
        e.currentTarget.reset();
        setBlogContent("");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formData = new FormData(e.currentTarget);
  //   const socialJsonString = formData.get("social") as string;
  //   let socialData;

  //   try {
  //     socialData = JSON.parse(socialJsonString);
  //   } catch (error) {
  //     toast({
  //       title: "Invalid JSON",
  //       description: "The social links JSON is not correctly formatted.",
  //       variant: "destructive",
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   const profileData = {
  //     name: formData.get("name") as string,
  //     bio: formData.get("bio") as string,
  //     contact: formData.get("contact") as string,
  //     email: formData.get("email") as string,
  //     cv_url: formData.get("cv_url") as string,
  //     social: socialData,
  //     avatar_url: formData.get("avatar") as string,
  //   };

  //   try {
  //     const response = await fetch("/api/profile", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(profileData),
  //     });

  //     if (response.ok) {
  //       toast({
  //         title: "Success",
  //         description: "Profile updated successfully!",
  //       });
  //       fetchProfile();
  //     } else {
  //       const error = await response.json();
  //       toast({
  //         title: "Error",
  //         description: error.error,
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update profile",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.currentTarget);

  // Validate social JSON
  const socialJsonString = formData.get("social") as string;
  try {
    JSON.parse(socialJsonString || "{}"); // just validate
  } catch (error) {
    toast({
      title: "Invalid JSON",
      description: "The social links JSON is not correctly formatted.",
      variant: "destructive",
    });
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      body: formData, // send as multipart/form-data
    });

    if (response.ok) {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      fetchProfile();
    } else {
      const error = await response.json();
      toast({
        title: "Error",
        description: error.error,
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update profile",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
=======
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const socialJsonString = formData.get("social") as string;
    let socialData;

    try {
      socialData = JSON.parse(socialJsonString);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The social links JSON is not correctly formatted.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const profileData = {
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      contact: formData.get("contact") as string,
      email: formData.get("email") as string,
      cv_url: formData.get("cv_url") as string,
      social: socialData,
      avatar_url: formData.get("avatar") as string,
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        fetchProfile();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
>>>>>>> 3174677b7ffad27ccf9205b6b73a479e1da09565

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Project deleted successfully!" })
        fetchProjects()
      } else {
        toast({ title: "Error", description: "Failed to delete project", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" })
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Blog post deleted successfully!" })
        fetchBlogs()
      } else {
        toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" })
    }
  }

  const handleArchiveContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: true }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Contact response archived!" })
        fetchContactResponses()
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to archive contact", variant: "destructive" })
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this contact response?")) return

    try {
      const response = await fetch(`/api/contact/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Contact response deleted!" })
        fetchContactResponses()
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete contact", variant: "destructive" })
    }
  }

  const filteredProjects = projects
    .filter(
      (project) =>
        project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.description.toLowerCase().includes(projectSearch.toLowerCase()),
    )
    .filter(
      (project) =>
        projectFilter === "all" ||
        (projectFilter === "featured" && project.is_featured) ||
        (projectFilter === "category" && project.category === projectFilter),
    )
    .sort((a, b) => {
      const aVal = a[sortBy as keyof Project]
      const bVal = b[sortBy as keyof Project]
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })

  const filteredBlogs = blogs
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
        blog.description.toLowerCase().includes(blogSearch.toLowerCase()),
    )
    .filter(
      (blog) =>
        blogFilter === "all" ||
        (blogFilter === "published" && blog.is_published) ||
        (blogFilter === "draft" && !blog.is_published),
    )

  const filteredContacts = contactResponses.filter(
    (contact) =>
      contact.username.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.message.toLowerCase().includes(contactSearch.toLowerCase()),
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">Active projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogs.length}</div>
                  <p className="text-xs text-muted-foreground">Published posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile ? "✓" : "✗"}</div>
                  <p className="text-xs text-muted-foreground">{profile ? "Complete" : "Incomplete"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Contact Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contactResponses.length}</div>
                  <p className="text-xs text-muted-foreground">Total responses</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project, index) => (
                    <div key={project.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Project: {project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {blogs.slice(0, 2).map((blog, index) => (
                    <div key={blog.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Blog: {blog.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "projects":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Project title" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <RichTextEditor
                      id="description"
                      name="description"
                      onContentChange={setProjectDescription}
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube_link">YouTube Link</Label>
                    <Input id="youtube_link" name="youtube_link" placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  <div>
                    <Label htmlFor="project_url">URL Link</Label>
                    <Input id="project_url" name="project_url" placeholder="https://example.com" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Mobile App">Mobile App</SelectItem>
                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="is_featured" name="is_featured" className="rounded" />
                    <Label htmlFor="is_featured">Featured Project</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Add Project
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
                <div className="flex gap-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project, index) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-mono text-sm">#{index + 1}</TableCell>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{project.category}</Badge>
                            </TableCell>
                            <TableCell>{project.is_featured ? "✓" : "✗"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "blog":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Blog Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="blog-title">Title</Label>
                    <Input id="blog-title" name="title" placeholder="Blog post title" required />
                  </div>
                  <div>
                    <Label htmlFor="blog-description">Description</Label>
                    <Textarea
                      id="blog-description"
                      name="description"
                      placeholder="Blog post description"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-content">Content</Label>
                    <RichTextEditor
                      id="blog-content"
                      name="content"
                      onContentChange={setBlogContent}
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Optimization">Optimization</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="is_published" name="is_published" className="rounded" />
                    <Label htmlFor="is_published">Publish immediately</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Add Blog Post
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Blog Posts ({filteredBlogs.length})</CardTitle>
                <div className="flex gap-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search blogs..."
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={blogFilter} onValueChange={setBlogFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBlogs.map((blog, index) => (
                          <TableRow key={blog.id}>
                            <TableCell className="font-mono text-sm">#{index + 1}</TableCell>
                            <TableCell className="font-medium">{blog.title}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="line-clamp-2 text-sm text-muted-foreground">{blog.description}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{blog.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={blog.is_published ? "default" : "secondary"}>
                                {blog.is_published ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteBlog(blog.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "profile":
        return (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile?.name || ""}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      defaultValue={profile?.bio || ""}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        name="contact"
                        defaultValue={profile?.contact || ""}
                        placeholder="Your contact number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={profile?.email || ""}
                        placeholder="Your email address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cv_url">CV URL</Label>
                    <Input
                      id="cv_url"
                      name="cv_url"
                      defaultValue={profile?.cv_url || ""}
                      placeholder="Link to your CV"
                    />
                  </div>

                  <div>
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Upload a profile picture (JPG, PNG, GIF)</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Links (JSON)</h3>
                     <Textarea
                      id="social"
                      name="social"
                      placeholder='{ "github": "https://...", "twitter": "https://..." }'
                      rows={5}
                      defaultValue={JSON.stringify(profile?.social || {}, null, 2)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )
      case "contact-response":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Contact Responses ({filteredContacts.length})
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search responses..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContacts.map((response, index) => (
                          <TableRow key={response.id}>
                            <TableCell className="font-mono text-sm">#{index + 1}</TableCell>
                            <TableCell className="font-medium">{response.username}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className="rounded-sm px-2 py-1 font-mono text-xs"
                              >
                                {response.email}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(response.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{response.message}</TableCell>
                            <TableCell>
                              <Badge variant={response.is_read ? "secondary" : "default"}>
                                {response.is_read ? "Read" : "New"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleArchiveContact(response.id)}>
                                  <Archive className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteContact(response.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Archived Responses ({archivedResponses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Original Date</TableHead>
                          <TableHead>Archived Date</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archivedResponses.map((response, index) => (
                          <TableRow key={response.id}>
                            <TableCell className="font-mono text-sm">#{index + 1}</TableCell>
                            <TableCell className="font-medium">{response.username}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className="rounded-sm px-2 py-1 font-mono text-xs"
                              >
                                {response.email}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(response.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(response.updated_at).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{response.message}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteContact(response.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className={cn(
                      "flex items-center space-x-2 h-16 rounded-none border-b-2 border-transparent relative",
                      activeSection === item.id && "border-primary",
                    )}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.id === "contact-response" && unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{navItems.find((item) => item.id === activeSection)?.label}</h1>
        </div>
        {renderContent()}
      </main>
    </div>
  )
}
