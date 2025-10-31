"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Navigation, Clock, Info } from "lucide-react"

// Mock data for mailbox locations
const mailboxLocations = [
  {
    id: 1,
    city: "Paris",
    address: "Place de la République",
    description: "Près du métro République, côté fontaine",
    coordinates: { lat: 48.8676, lng: 2.3631 },
    status: "active",
    lastCollection: "2024-01-15",
  },
  {
    id: 2,
    city: "Paris",
    address: "Jardin du Luxembourg",
    description: "Entrée principale, près des grilles",
    coordinates: { lat: 48.8462, lng: 2.3372 },
    status: "active",
    lastCollection: "2024-01-14",
  },
  {
    id: 3,
    city: "Lyon",
    address: "Place Bellecour",
    description: "Centre de la place, près de la statue",
    coordinates: { lat: 45.7578, lng: 4.832 },
    status: "active",
    lastCollection: "2024-01-13",
  },
  {
    id: 4,
    city: "Lyon",
    address: "Parc de la Tête d'Or",
    description: "Entrée principale, côté lac",
    coordinates: { lat: 45.7749, lng: 4.857 },
    status: "maintenance",
    lastCollection: "2024-01-10",
  },
  {
    id: 5,
    city: "Marseille",
    address: "Vieux-Port",
    description: "Quai des Belges, près des restaurants",
    coordinates: { lat: 43.2951, lng: 5.3751 },
    status: "active",
    lastCollection: "2024-01-12",
  },
  {
    id: 6,
    city: "Toulouse",
    address: "Place du Capitole",
    description: "Devant l'Hôtel de Ville",
    coordinates: { lat: 43.6043, lng: 1.4437 },
    status: "active",
    lastCollection: "2024-01-11",
  },
]

const cities = ["Toutes les villes", "Paris", "Lyon", "Marseille", "Toulouse"]

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState("Toutes les villes")
  const [selectedLocation, setSelectedLocation] = useState<any>(null)

  const filteredLocations = mailboxLocations.filter((location) => {
    return selectedCity === "Toutes les villes" || location.city === selectedCity
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "maintenance":
        return "Maintenance"
      case "inactive":
        return "Inactive"
      default:
        return "Inconnu"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost">
              <a href="/" className="font-body">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </a>
            </Button>
            <div className="text-center">
              <h1 className="font-heading text-3xl md:text-4xl text-primary">Carte des Boîtes</h1>
              <p className="font-body text-muted-foreground">Trouvez la boîte à lettres la plus proche</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter */}
        <div className="mb-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 font-body">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Filtrer par ville
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-center">
                  <p className="font-body text-sm text-muted-foreground">
                    {filteredLocations.length} boîte{filteredLocations.length > 1 ? "s" : ""} trouvée
                    {filteredLocations.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="bg-card/80 backdrop-blur-sm h-[500px]">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-primary flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Carte Interactive
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="relative w-full h-full bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-primary mb-2">Carte Interactive</h3>
                      <p className="font-body text-muted-foreground text-sm max-w-md">
                        La carte interactive sera bientôt disponible. En attendant, consultez la liste des emplacements
                        ci-contre.
                      </p>
                    </div>
                    {/* Mock map markers */}
                    <div className="absolute inset-4 pointer-events-none">
                      {filteredLocations.slice(0, 6).map((location, index) => (
                        <div
                          key={location.id}
                          className="absolute w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            left: `${20 + (index % 3) * 30}%`,
                            top: `${20 + Math.floor(index / 3) * 40}%`,
                          }}
                          onClick={() => setSelectedLocation(location)}
                        >
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Locations List */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl text-primary">Emplacements</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLocation?.id === location.id ? "ring-2 ring-primary bg-primary/5" : "bg-card/80"
                  } backdrop-blur-sm`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-heading text-lg text-primary">{location.address}</h3>
                          <p className="font-body text-sm text-muted-foreground">{location.city}</p>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(location.status)}`}>
                          {getStatusLabel(location.status)}
                        </Badge>
                      </div>

                      <p className="font-body text-sm text-foreground">{location.description}</p>

                      <div className="flex items-center text-xs text-muted-foreground font-body">
                        <Clock className="w-3 h-3 mr-1" />
                        Dernière collecte: {new Date(location.lastCollection).toLocaleDateString("fr-FR")}
                      </div>

                      {selectedLocation?.id === location.id && (
                        <div className="pt-2 border-t border-border">
                          <Button size="sm" className="w-full font-body">
                            <Navigation className="w-4 h-4 mr-2" />
                            Obtenir l'itinéraire
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLocations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-body">Aucune boîte à lettres trouvée pour cette ville.</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-primary flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Informations pratiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading text-lg text-accent mb-2">Comment utiliser les boîtes</h3>
                <ul className="space-y-1 font-body text-sm text-foreground">
                  <li>• Écrivez votre lettre anonyme sur papier</li>
                  <li>• Pliez-la et glissez-la dans la fente</li>
                  <li>• Aucune information personnelle requise</li>
                  <li>• Les lettres sont collectées régulièrement</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg text-accent mb-2">Horaires de collecte</h3>
                <ul className="space-y-1 font-body text-sm text-foreground">
                  <li>• Collecte hebdomadaire le mardi</li>
                  <li>• Traitement sous 48h</li>
                  <li>• Publication après modération</li>
                  <li>• Respect total de l'anonymat</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="font-body text-sm text-muted-foreground text-center">
                Une question sur les emplacements ? Contactez-nous à{" "}
                <a href="mailto:contact@turbulencesdukeur.fr" className="text-primary hover:underline">
                  contact@turbulencesdukeur.fr
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground font-body">
            Les Turbulences du Keur - Partager l'émotion, préserver l'anonymat
          </p>
        </div>
      </footer>
    </div>
  )
}
