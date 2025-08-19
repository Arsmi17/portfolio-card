"use client";

import type React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Blog } from "@/lib/supabase/types";

interface BlogModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogModal({ blog, isOpen, onClose }: BlogModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content max-w-4xl">
        <div className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
              <Badge variant="outline" className="w-fit">
                {blog.category}
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

          <CardContent className="flex-1 space-y-6 overflow-y-auto">
            {blog.image_url && (
                 <div className="w-full h-64 mb-4 relative group">
                 <img
                   src={blog.image_url}
                   alt={blog.title}
                   className="w-full h-full object-cover rounded"
                 />
               </div>
            )}
            <div>
              <h3 className="font-semibold text-lg mb-2">Content</h3>
              <div
                className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
              />
            </div>
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Published:</span>
                  <p className="font-medium">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium">
                    {blog.is_published ? "Published" : "Draft"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}