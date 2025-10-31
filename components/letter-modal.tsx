"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, Users, Home } from "lucide-react"
import type { Letter } from "@/lib/supabase/client"

interface LetterModalProps {
  letter: Letter | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LetterModal({ letter, open, onOpenChange }: LetterModalProps) {
  if (!letter) return null

  const getTypeColor = (type: string) => {
    switch (type) {
      case "amoureuse":
        return "bg-primary text-primary-foreground"
      case "amicale":
        return "bg-accent text-accent-foreground"
      case "familiale":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "amoureuse":
        return <Heart className="w-4 h-4 mr-1" />
      case "amicale":
        return <Users className="w-4 h-4 mr-1" />
      case "familiale":
        return <Home className="w-4 h-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="outline" className="font-body">
              <MapPin className="w-4 h-4 mr-1" />
              {letter.city}
            </Badge>
            <Badge className={`font-body ${getTypeColor(letter.relationship_type)}`}>
              {getTypeIcon(letter.relationship_type)}
              <span className="ml-1 capitalize">{letter.relationship_type}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="font-body text-foreground leading-relaxed text-base whitespace-pre-wrap">{letter.content}</p>
          <p className="text-sm text-muted-foreground font-body border-t pt-4">
            Publié le{" "}
            {new Date(letter.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
