"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Home, MapPin, Mail, ArrowLeft } from "lucide-react"

export default function AboutPage() {
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
              <h1 className="font-heading text-3xl md:text-4xl text-primary">LES TURBULENCES</h1>
              <h2 className="font-heading text-xl md:text-2xl text-accent">DU KEUR</h2>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 lazyDog">À propos du projet</h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Les Turbulences du Keur est un projet d'art participatif qui célèbre les émotions humaines à travers des
            lettres anonymes.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Concept */}
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-primary flex items-center">
                <Heart className="w-6 h-6 mr-3 text-accent" />
                Kezako
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-foreground leading-relaxed">
                Des boîtes à lettres spéciales sont installées dans différents quartiers de la ville. Les passants
                peuvent y déposer leurs lettres anonymes, qu'elles soient destinées à un proche, à un inconnu, ou
                simplement au monde entier.
              </p>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-primary flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-accent" />
                Comment ça fonctionne ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-foreground leading-relaxed">
                Des boîtes à lettres spéciales sont installées dans différents quartiers de la ville. Les passants
                peuvent y déposer leurs lettres anonymes, qu'elles soient destinées à un proche, à un inconnu, ou
                simplement au monde entier.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-heading text-lg text-primary mb-2">Lettres Amoureuses</h3>
                  <p className="font-body text-sm text-muted-foreground">Déclarations, regrets, espoirs romantiques</p>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <h3 className="font-heading text-lg text-accent mb-2">Lettres Amicales</h3>
                  <p className="font-body text-sm text-muted-foreground">Messages d'amitié, souvenirs partagés</p>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <Home className="w-8 h-8 mx-auto mb-2 text-secondary-foreground" />
                  <h3 className="font-heading text-lg text-secondary-foreground mb-2">Lettres Familiales</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Mots pour la famille, gratitude, réconciliation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-primary flex items-center">
                <Users className="w-6 h-6 mr-3 text-accent" />
                Notre Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-body text-foreground leading-relaxed">
                Notre mission est de créer un espace sûr et anonyme où chacun peut exprimer ses émotions sans jugement.
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-primary">Nos Valeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="font-body text-foreground space-y-2">
                <li>✨ Anonymat préservé</li>
                <li>💚 Bienveillance</li>
                <li>🎨 Expression libre</li>
                <li>🤝 Communauté</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-primary flex items-center">
                <Mail className="w-6 h-6 mr-3 text-accent" />
                Nous contacter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-foreground leading-relaxed mb-4">
                Vous souhaitez en savoir plus sur le projet, proposer un emplacement pour une boîte à lettres, ou
                simplement partager vos impressions ? N'hésitez pas à nous contacter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="font-body">
                  <a href="mailto:contact@turbulencesdukeur.fr">
                    <Mail className="w-4 h-4 mr-2" />
                    contact@turbulencesdukeur.fr
                  </a>
                </Button>
                <Button asChild variant="outline" className="font-body bg-transparent">
                  <a href="/map">
                    <MapPin className="w-4 h-4 mr-2" />
                    Voir les boîtes à lettres
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-xl">
          <h2 className="font-heading text-2xl text-primary mb-4">Participez à l'aventure</h2>
          <p className="font-body text-foreground mb-6 max-w-2xl mx-auto">
            Chaque lettre compte, chaque émotion a sa place. Trouvez la boîte à lettres la plus proche de chez vous et
            laissez parler votre cœur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-body">
              <a href="/map">
                <MapPin className="w-5 h-5 mr-2" />
                Trouver une boîte à lettres
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-body bg-transparent">
              <a href="/">
                <Heart className="w-5 h-5 mr-2" />
                Lire les lettres
              </a>
            </Button>
          </div>
        </div>
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
