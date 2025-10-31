"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Users,
  Home,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Loader2,
  Tag,
  Settings,
  Key,
  Search,
  FileText,
  Globe,
  Briefcase,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import MarkdownRenderer from "@/components/markdown"

interface Letter {
  id: string
  content: string
  city: string
  relationshipType: "amoureuse" | "amicale" | "familiale"
  createdAt: string
  updatedAt: string
}

interface PageContent {
  id: string
  pageKey: string
  title: string | null
  content: string
  metaDescription: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

interface AdminUser {
  id: string
  login: string
  email: string
  role: string
}

const PAGE_KEYS = {
  HOME_INTRO: "home_intro",
  ABOUT_INTRO: "about_intro",
  ABOUT_CONCEPT: "about_concept",
  ABOUT_MISSION: "about_mission",
  ABOUT_VALUES: "about_values",
  INSTALL_MAILBOX: "install_mailbox",
}

const PAGE_DISPLAY_NAMES: Record<string, string> = {
  [PAGE_KEYS.HOME_INTRO]: "Accueil - Introduction",
  [PAGE_KEYS.ABOUT_INTRO]: "À propos - Introduction",
  [PAGE_KEYS.ABOUT_CONCEPT]: "À propos - Concept",
  [PAGE_KEYS.ABOUT_MISSION]: "À propos - Mission",
  [PAGE_KEYS.ABOUT_VALUES]: "À propos - Valeurs",
  [PAGE_KEYS.INSTALL_MAILBOX]: "Installation boîte aux lettres",
}

const DEFAULT_RELATION_TYPES = [
  { value: "amoureuse", label: "Amoureuse", icon: Heart },
  { value: "amicale", label: "Amicale", icon: Users },
  { value: "familiale", label: "Familiale", icon: Home },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)

  // Letter state
  const [letters, setLetters] = useState<Letter[]>([])
  const [newLetter, setNewLetter] = useState({ content: "", city: "", relationshipType: "" })
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null)
  const [cities, setCities] = useState<string[]>([])
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [citySearch, setCitySearch] = useState("")

  // CMS state
  const [pageContents, setPageContents] = useState<PageContent[]>([])
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null)
  const [editingContent, setEditingContent] = useState({ title: "", content: "", metaDescription: "" })

  // Settings state
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Loading states
  const [letterLoading, setLetterLoading] = useState(false)
  const [cmsLoading, setCmsLoading] = useState(false)
  const [citiesLoading, setCitiesLoading] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token")
      const userId = localStorage.getItem("admin_userId")
      const userLogin = localStorage.getItem("admin_login")
      const userRole = localStorage.getItem("admin_role")

      if (!token || !userId) {
        router.push("/login")
        return
      }

      setCurrentUser({
        id: userId,
        login: userLogin || "",
        email: "",
        role: userRole || "admin",
      })

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Fetch initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchLetters()
      fetchPageContents()
      fetchCities()
    }
  }, [isAuthenticated])

  const fetchLetters = useCallback(async () => {
    setLetterLoading(true)
    try {
      const res = await fetch("/api/letters")
      if (res.ok) {
        const data = await res.json()
        setLetters(data)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les lettres",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching letters:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des lettres",
        variant: "destructive",
      })
    } finally {
      setLetterLoading(false)
    }
  }, [])

  const fetchPageContents = useCallback(async () => {
    setCmsLoading(true)
    try {
      const res = await fetch("/api/cms/pages")
      if (res.ok) {
        const data = await res.json()
        setPageContents(data)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les contenus des pages",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching page contents:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des contenus",
        variant: "destructive",
      })
    } finally {
      setCmsLoading(false)
    }
  }, [])

  const fetchCities = useCallback(async () => {
    setCitiesLoading(true)
    try {
      const res = await fetch("https://geo.api.gouv.fr/communes?fields=nom&format=json&geometry=centre")
      const data = await res.json()
      const cityNames = (data as any[]).map((city: any) => city.nom).sort()
      setCities(cityNames)
      setFilteredCities(cityNames.slice(0, 100))
    } catch (error) {
      console.error("Error fetching cities:", error)
      // Fallback to default cities
      const defaultCities = [
        "Paris",
        "Lyon",
        "Marseille",
        "Toulouse",
        "Nice",
        "Bordeaux",
        "Lille",
        "Nantes",
        "Strasbourg",
        "Montpellier",
      ]
      setCities(defaultCities)
      setFilteredCities(defaultCities)
    } finally {
      setCitiesLoading(false)
    }
  }, [])

  const handleCitySearch = (search: string) => {
    setCitySearch(search)
    const filtered = cities
      .filter((city) => city.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 100)
    setFilteredCities(filtered)
  }

  // Letter handlers
  const handleAddLetter = async () => {
    if (!newLetter.content.trim() || !newLetter.city.trim() || !newLetter.relationshipType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    setLetterLoading(true)
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newLetter.content,
          city: newLetter.city,
          relationshipType: newLetter.relationshipType,
        }),
      })

      if (res.ok) {
        toast({
          title: "Succès",
          description: "La lettre a été ajoutée avec succès",
        })
        setNewLetter({ content: "", city: "", relationshipType: "" })
        fetchLetters()
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la lettre",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding letter:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setLetterLoading(false)
    }
  }

  const handleEditLetter = (letter: Letter) => {
    setEditingLetter(letter)
    setNewLetter({
      content: letter.content,
      city: letter.city,
      relationshipType: letter.relationshipType,
    })
  }

  const handleUpdateLetter = async () => {
    if (!editingLetter || !newLetter.content.trim() || !newLetter.city.trim() || !newLetter.relationshipType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    setLetterLoading(true)
    try {
      const res = await fetch(`/api/letters/${editingLetter.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newLetter.content,
          city: newLetter.city,
          relationshipType: newLetter.relationshipType,
        }),
      })

      if (res.ok) {
        toast({
          title: "Succès",
          description: "La lettre a été modifiée avec succès",
        })
        setEditingLetter(null)
        setNewLetter({ content: "", city: "", relationshipType: "" })
        fetchLetters()
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de modifier la lettre",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating letter:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setLetterLoading(false)
    }
  }

  const handleDeleteLetter = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette lettre ?")) {
      return
    }

    setLetterLoading(true)
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "Succès",
          description: "La lettre a été supprimée",
        })
        fetchLetters()
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la lettre",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting letter:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setLetterLoading(false)
    }
  }

  // CMS handlers
  const handleSelectPage = (page: PageContent) => {
    setSelectedPage(page)
    setEditingContent({
      title: page.title || "",
      content: page.content,
      metaDescription: page.metaDescription || "",
    })
  }

  const handleUpdatePageContent = async () => {
    if (!selectedPage) return

    setCmsLoading(true)
    try {
      const res = await fetch(`/api/cms/pages/${selectedPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingContent.title,
          content: editingContent.content,
          metaDescription: editingContent.metaDescription,
        }),
      })

      if (res.ok) {
        toast({
          title: "Succès",
          description: "Le contenu de la page a été mis à jour",
        })
        fetchPageContents()
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la page",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating page content:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setCmsLoading(false)
    }
  }

  // Settings handlers
  const handlePasswordChange = async () => {
    if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordChange.currentPassword,
          newPassword: passwordChange.newPassword,
        }),
      })

      if (res.ok) {
        toast({
          title: "Succès",
          description: "Mot de passe modifié. Redirection...",
        })
        setPasswordChange({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => handleLogout(), 2000)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de changer le mot de passe",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_userId")
    localStorage.removeItem("admin_login")
    localStorage.removeItem("admin_role")
    localStorage.removeItem("admin_authenticated")

    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès",
    })

    router.push("/login")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "amoureuse":
        return "bg-pink-600 text-white"
      case "amicale":
        return "bg-blue-600 text-white"
      case "familiale":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    const relType = DEFAULT_RELATION_TYPES.find((rt) => rt.value === type)
    if (relType) {
      const Icon = relType.icon
      return <Icon className="w-4 h-4" />
    }
    return <Tag className="w-4 h-4" />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
          <p className="text-slate-300">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-pink-400">Dashboard Admin</h1>
              <p className="text-slate-400 text-sm mt-1">Rôle: {currentUser.role}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                asChild
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <a href="/" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Voir le site
                </a>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-300 hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="letters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="letters" className="data-[state=active]:bg-pink-600">
              <FileText className="w-4 h-4 mr-2" />
              Lettres
            </TabsTrigger>
            <TabsTrigger value="cms" className="data-[state=active]:bg-pink-600">
              <Globe className="w-4 h-4 mr-2" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="cities" className="data-[state=active]:bg-pink-600">
              <MapPin className="w-4 h-4 mr-2" />
              Villes
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-pink-600">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Letters Tab */}
          <TabsContent value="letters" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-pink-400">
                  {editingLetter ? "Modifier une lettre" : "Ajouter une nouvelle lettre"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Contenu</Label>
                  <Textarea
                    placeholder="Contenu de la lettre..."
                    value={newLetter.content}
                    onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 min-h-32"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Ville</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Rechercher une ville..."
                        value={citySearch}
                        onChange={(e) => handleCitySearch(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                      />
                      <Select
                        value={newLetter.city}
                        onValueChange={(value) => setNewLetter({ ...newLetter, city: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                          <SelectValue placeholder="Sélectionner une ville" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {citiesLoading ? (
                            <div className="p-2 text-slate-300">Chargement...</div>
                          ) : (
                            filteredCities.map((city) => (
                              <SelectItem key={city} value={city} className="text-slate-100">
                                {city}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Type de relation</Label>
                    <Select
                      value={newLetter.relationshipType}
                      onValueChange={(value) =>
                        setNewLetter({ ...newLetter, relationshipType: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {DEFAULT_RELATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-slate-100">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={editingLetter ? handleUpdateLetter : handleAddLetter}
                    disabled={letterLoading}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {letterLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingLetter ? "Modifier" : "Ajouter"}
                  </Button>
                  {editingLetter && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingLetter(null)
                        setNewLetter({ content: "", city: "", relationshipType: "" })
                      }}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Letters List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-pink-400">Lettres existantes ({letters.length})</h2>
              {letterLoading && letters.length === 0 ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-pink-400" />
                </div>
              ) : letters.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-8 text-center text-slate-400">
                    Aucune lettre pour le moment. Commencez par ajouter votre première lettre.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {letters.map((letter) => (
                    <Card key={letter.id} className="bg-slate-800 border-slate-700 hover:border-pink-600/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex gap-2 mb-3">
                              <Badge className={`${getTypeColor(letter.relationshipType)} text-xs`}>
                                {getTypeIcon(letter.relationshipType)}
                                <span className="ml-1">{letter.relationshipType}</span>
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                <MapPin className="w-3 h-3 mr-1" />
                                {letter.city}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {new Date(letter.createdAt).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{letter.content}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditLetter(letter)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteLetter(letter.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* CMS Tab */}
          <TabsContent value="cms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Page Selection */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-pink-400">Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  {cmsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-pink-400" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pageContents.map((page) => (
                        <Button
                          key={page.id}
                          variant={selectedPage?.id === page.id ? "default" : "ghost"}
                          className={`w-full justify-start text-left ${
                            selectedPage?.id === page.id
                              ? "bg-pink-600 hover:bg-pink-700"
                              : "text-slate-300 hover:bg-slate-700"
                          }`}
                          onClick={() => handleSelectPage(page)}
                        >
                          {PAGE_DISPLAY_NAMES[page.pageKey] || page.pageKey}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Content Editor */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-pink-400">
                      {selectedPage
                        ? PAGE_DISPLAY_NAMES[selectedPage.pageKey]
                        : "Sélectionnez une page"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedPage ? (
                      <>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Titre</Label>
                          <Input
                            value={editingContent.title}
                            onChange={(e) =>
                              setEditingContent({ ...editingContent, title: e.target.value })
                            }
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Contenu (Markdown)</Label>
                          <Textarea
                            value={editingContent.content}
                            onChange={(e) =>
                              setEditingContent({
                                ...editingContent,
                                content: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-slate-100 min-h-64"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Meta Description</Label>
                          <Input
                            value={editingContent.metaDescription}
                            onChange={(e) =>
                              setEditingContent({
                                ...editingContent,
                                metaDescription: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleUpdatePageContent}
                            disabled={cmsLoading}
                            className="bg-pink-600 hover:bg-pink-700"
                          >
                            {cmsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Mettre à jour
                          </Button>
                        </div>

                        <div className="mt-4 p-3 bg-slate-700 rounded text-sm text-slate-300">
                          <p className="font-semibold mb-2">Aide Markdown:</p>
                          <ul className="text-xs space-y-1 text-slate-400">
                            <li>
                              <code className="bg-slate-600 px-1">**texte**</code> = <strong>texte en gras</strong>
                            </li>
                            <li>
                              <code className="bg-slate-600 px-1">*texte*</code> = <em>texte en italique</em>
                            </li>
                            <li>
                              <code className="bg-slate-600 px-1">## Titre</code> = Titre de section
                            </li>
                            <li>
                              <code className="bg-slate-600 px-1">- item</code> = Liste à puces
                            </li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-slate-400 py-8">
                        Sélectionnez une page à modifier
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Cities Tab */}
          <TabsContent value="cities">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-pink-400">Villes disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                {citiesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-pink-400" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {cities.map((city) => (
                      <Badge key={city} variant="outline" className="mr-2 mb-2 border-slate-600">
                        {city}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-pink-400">Changer le mot de passe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label className="text-slate-300">Mot de passe actuel</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwordChange.currentPassword}
                    onChange={(e) =>
                      setPasswordChange({
                        ...passwordChange,
                        currentPassword: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Nouveau mot de passe</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwordChange.newPassword}
                    onChange={(e) =>
                      setPasswordChange({
                        ...passwordChange,
                        newPassword: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Confirmer le nouveau mot de passe</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwordChange.confirmPassword}
                    onChange={(e) =>
                      setPasswordChange({
                        ...passwordChange,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <Button
                  onClick={handlePasswordChange}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Mettre à jour
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
