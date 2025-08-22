import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Project } from '@/lib/supabase/types'
import ProjectModal from '@/components/project-modal'

export function EditProjectModal({
  project,
  isOpen,
  onClose,
  onUpdate,
}: {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedProject: Project) => void
}) {
  if (!project) return null

  // This function is crucial. It intercepts the form submission event,
  // creates a plain data object, and then calls onUpdate.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedProject = {
      ...project,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      youtube_link: formData.get('youtube_link') as string,
      project_url: formData.get('project_url') as string,
      category: formData.get('category') as string,
    }
    onUpdate(updatedProject)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        {/* The form's onSubmit should call our new handleSubmit function */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={project.title}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                defaultValue={project.description}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="youtube_link" className="text-right">
                YouTube Link
              </Label>
              <Input
                id="youtube_link"
                name="youtube_link"
                defaultValue={project.youtube_link || ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project_url" className="text-right">
                Project URL
              </Label>
              <Input
                id="project_url"
                name="project_url"
                defaultValue={project.project_url || ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                defaultValue={project.category}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Discard
            </Button>
            {/* This button just submits the form. No onClick is needed. */}
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ViewProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <ProjectModal
          title={project.title}
          description={project.description}
          youtubeLink={project.youtube_link}
          projectUrl={project.project_url}
          category={project.category}
        />
      </DialogContent>
    </Dialog>
  )
}

export function DeleteProjectModal({
  project,
  isOpen,
  onClose,
  onDelete,
}: {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
}) {
  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            project.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button variant="destructive" onClick={() => onDelete(project.id)}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}