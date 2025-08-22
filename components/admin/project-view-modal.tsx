'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface ProjectModalProps {
  title: string
  description: string
  youtubeLink?: string
  projectUrl?: string
  category: string
}
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";

const ProjectModal: React.FC<ProjectModalProps> = ({
  title,
  description,
  youtubeLink,
  projectUrl,
  category,
}) => {
  return (
    <>
      <div className="modal-content">
        <div className="grid grid-cols-1 lg:grid-cols-1 h-full">
          {/* Right side - Project Details */}
          <div className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  {title}
                </CardTitle>
                  {category.split(',').map(cat => (
                    <Badge key={cat} variant="outline" className="w-fit">
                      {cat.trim()}
                    </Badge>
                  ))}
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 overflow-y-auto description-area">
              {/* Description */}
              <div className="">
                <h3 className="font-semibold text-lg mb-2">Overview</h3>
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectModal