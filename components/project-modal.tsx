"use client";

import type React from "react";
<<<<<<< HEAD
import { createPortal } from "react-dom";
=======
>>>>>>> 3174677b7ffad27ccf9205b6b73a479e1da09565
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/supabase/types";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen) return null;

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("watch?v=")) {
      return `https://www.youtube.com/embed/${
        url.split("watch?v=")[1].split("&")[0]
      }?autoplay=1`;
    }
    return `https://www.youtube.com/embed/${url.split("/").pop()}?autoplay=1`;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

<<<<<<< HEAD
  return createPortal(
=======
  return (
>>>>>>> 3174677b7ffad27ccf9205b6b73a479e1da09565
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left side - YouTube Video */}
          <div className="bg-black flex items-center justify-center p-4">
            {project.youtube_link ? (
              <iframe
                src={getYouTubeEmbedUrl(project.youtube_link)}
                className="w-full h-full min-h-[300px] lg:min-h-[400px]"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={project.title}
              />
            ) : (
              <div className="text-white text-center">
                <img
                  src="/project-placeholder.png"
                  alt={project.title}
                  className="w-full h-auto max-h-[400px] object-contain rounded"
                />
              </div>
            )}
          </div>

          {/* Right side - Project Details */}
          <div className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  {project.title}
                </CardTitle>
                <Badge variant="outline" className="w-fit">
                  {project.category}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

<<<<<<< HEAD
            <CardContent className="flex-1 space-y-6 overflow-y-auto description-area">
              {/* Description */}
              <div className="">
=======
            <CardContent className="flex-1 space-y-6">
              {/* Description */}
              <div>
>>>>>>> 3174677b7ffad27ccf9205b6b73a479e1da09565
                <h3 className="font-semibold text-lg mb-2">Overview</h3>
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
<<<<<<< HEAD
            </CardContent>

            <CardHeader className="flex flex-col justify-center space-y-0 pb-4">
=======

>>>>>>> 3174677b7ffad27ccf9205b6b73a479e1da09565
              {/* Project Links */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Links</h3>
                <div className="flex flex-col gap-2">
                  {project.project_url && (
                    <Button
                      variant="outline"
                      asChild
                      className="justify-start bg-transparent"
                    >
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live Project
                      </a>
                    </Button>
                  )}
                  {project.youtube_link && (
                    <Button
                      variant="outline"
                      asChild
                      className="justify-start bg-transparent"
                    >
                      <a
                        href={project.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Watch on YouTube
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Stats */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <p className="font-medium">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium">
<<<<<<< HEAD
                      {project.is_featured ? "Live" : "Archived"}
=======
                      {project.is_featured ? "Featured" : "Standard"}
>>>>>>> 3174677b7ffad27ccf9205b6b73a479e1da09565
                    </p>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
            </CardHeader>

          </div>
        </div>
      </div>
    </div>,
    document.body
=======
            </CardContent>
          </div>
        </div>
      </div>
    </div>
>>>>>>> 3174677b7ffad27ccf9205b6b73a479e1da09565
  );
}
