"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "@/hooks/use-profile"
import { useLinks } from "@/hooks/use-links"
import { CardFlip } from "@/components/ui/card-flip"
import { PortfolioView } from "@/components/link-tree/portfolio-view"
import { EditView } from "@/components/link-tree/edit-view"
import { useThemeSettings } from "@/hooks/use-theme-settings"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const defaultProfile = {
  name: "Harsh Mistry",
  bio: "Full-stack developer passionate about creating innovative web solutions and beautiful user experiences. Always learning, always building.",
  avatarUrl: "/professional-developer-avatar.png",
  secondaryBg: "bg-secondary",
  verified: true,
}

const defaultLinks = [
  {
    id: "2",
    title: "X / Twitter",
    url: "https://x.com/harshmistry",
  },
  {
    id: "3",
    title: "GitHub",
    url: "https://github.com/harshmistry",
  },
  {
    id: "4",
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/harshmistry",
  },
]

export default function LinkTree() {
  const { toast } = useToast()
  const [isEditMode, setIsEditMode] = useState(false)
  const { theme } = useTheme()

  // Use custom hooks for profile and links management
  const { profile, handleProfileChange, toggleVerified, updateSecondaryBg, saveProfileChanges } =
    useProfile(defaultProfile)

  const { links, newLink, addLink, deleteLink, updateLink, handleNewLinkChange } = useLinks(defaultLinks)

  const { themeSettings } = useThemeSettings()

  const toggleEditMode = () => {
    if (isEditMode) {
      saveProfileChanges()
      toast({
        title: "Changes saved",
        description: "Your profile has been updated",
      })
    }
    setIsEditMode(!isEditMode)
  }

  // Apply font family to the entire application when it changes
  useEffect(() => {
    // Apply the selected font to the root element
    document.documentElement.classList.remove("font-sans", "font-serif", "font-mono")
    document.documentElement.classList.add(themeSettings.font)
  }, [themeSettings.font, theme])

  return (
    <div className={cn("w-full max-w-6xl mx-auto", themeSettings.font)}>
      <div className="w-full">
        <CardFlip
          isFlipped={isEditMode}
          onFlip={toggleEditMode}
          frontContent={<PortfolioView profile={profile} links={links} />}
          backContent={
            <EditView
              profile={profile}
              links={links}
              newLink={newLink}
              onProfileChange={handleProfileChange}
              onToggleVerified={toggleVerified}
              onUpdateSecondaryBg={updateSecondaryBg}
              onNewLinkChange={handleNewLinkChange}
              onAddLink={addLink}
              onDeleteLink={deleteLink}
              onUpdateLink={updateLink}
            />
          }
        />
      </div>
    </div>
  )
}
