"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LetterModal } from "@/components/letter-modal";
import { getAllLetters, subscribeToLetters } from "@/lib/letters";
import type { Letter } from "@/lib/client";
import {
  Heart,
  Users,
  Home,
  MapPin,
  Filter,
  Info,
  Map,
  Menu,
  X,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import Image from "next/image";

const cities = [
  "Toutes les villes",
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
];
const relationTypes = [
  { value: "all", label: "Tous types", icon: Filter },
  { value: "amoureuse", label: "Amoureuse", icon: Heart },
  { value: "amicale", label: "Amicale", icon: Users },
  { value: "familiale", label: "Familiale", icon: Home },
];

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");
  const [selectedType, setSelectedType] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc", "none"
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const loadLetters = async () => {
      setLoading(true);
      const fetchedLetters = await getAllLetters();
      setLetters(fetchedLetters);
      setLoading(false);
    };

    loadLetters();

    // Setup real-time subscription (polling)
    const unsubscribe = subscribeToLetters((updatedLetters) => {
      setLetters(updatedLetters);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter);
    setModalOpen(true);
  };

 const filteredAndSortedLetters = Array.isArray(letters)
  ? letters
      .filter((letter) => {
        const cityMatch =
          selectedCity === "Toutes les villes" || letter.city === selectedCity;
        const typeMatch =
          selectedType === "all" || letter.relationshipType === selectedType;
        return cityMatch && typeMatch;
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortOrder === "desc") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      })
  : [];


  const getTypeColor = (type: string) => {
    switch (type) {
      case "amoureuse":
        return "bg-primary text-primary-foreground";
      case "amicale":
        return "bg-accent text-accent-foreground";
      case "familiale":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "amoureuse":
        return <Heart className="w-3 h-3 mr-1" />;
      case "amicale":
        return <Users className="w-3 h-3 mr-1" />;
      case "familiale":
        return <Home className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <header
        className={`border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 py-4 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <div className="text-center mb-4">
            <div
              className={`transition-all duration-500 inline-block ${
                isScrolled
                  ? "w-40 sm:w-52 md:w-64"
                  : "w-60 sm:w-80 md:w-96 lg:w-[32rem] xl:w-[40rem]"
              }`}
            >
              <Image
                src="/images/logo.svg"
                alt="LES TURBULENCES DU KEUR"
                width={800}
                height={200}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center justify-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="font-body">
                <a href="/">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lettres
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="font-body">
                <a href="/about">
                  <Info className="w-4 h-4 mr-2" />À propos
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="font-body">
                <a href="/map">
                  <Map className="w-4 h-4 mr-2" />
                  Carte
                </a>
              </Button>
            </nav>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start font-body"
                >
                  <a href="/" onClick={() => setMobileMenuOpen(false)}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lettres
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start font-body"
                >
                  <a href="/about" onClick={() => setMobileMenuOpen(false)}>
                    <Info className="w-4 h-4 mr-2 "  className={lazyDog.variable} />À propos du projet
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start font-body"
                >
                  <a href="/map" onClick={() => setMobileMenuOpen(false)}>
                    <Map className="w-4 h-4 mr-2" />
                    Localiser les boîtes à lettres
                  </a>
                </Button>
                <div className="flex justify-center pt-2 border-t">
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          )}

          {!isScrolled && (
            <div className="text-center mt-4">
              <p className="font-body text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Découvrez les lettres anonymes de votre ville.
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 sm:p-6 bg-card rounded-xl shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-2 font-body">
              <MapPin className="w-4 h-4 inline mr-1" />
              Ville
            </label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full">
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

          <div>
            <label className="block text-sm font-medium mb-2 font-body">
              Type de relation
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {relationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <type.icon className="w-4 h-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 font-body">
              Trier par date
            </label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center">
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Plus récent
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center">
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Plus ancien
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCity("Toutes les villes");
                setSelectedType("all");
                setSortOrder("desc");
              }}
              className="w-full font-body"
            >
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="font-body text-muted-foreground">
                Chargement des lettres...
              </span>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedLetters.map((letter) => (
              <Card
                key={letter.id}
                onClick={() => handleLetterClick(letter)}
                className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm hover:scale-[1.02] cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="outline" className="font-body">
                      <MapPin className="w-3 h-3 mr-1" />
                      {letter.city}
                    </Badge>
                    <Badge
                      className={`font-body ${getTypeColor(
                        letter.relationshipType
                      )}`}
                    >
                      {getTypeIcon(letter.relationshipType)}
                      <span className="ml-1 capitalize">
                        {letter.relationshipType}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-foreground leading-relaxed mb-4 text-sm sm:text-base line-clamp-4">
                    {letter.content}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {new Date(letter.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredAndSortedLetters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body text-lg">
              Aucune lettre trouvée pour ces critères.
            </p>
            <p className="text-muted-foreground font-body text-sm mt-2">
              Essayez de modifier vos filtres pour découvrir d'autres lettres.
            </p>
          </div>
        )}
      </main>

      <LetterModal
        letter={selectedLetter}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Footer */}
      <footer className="border-t bg-card/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center">
          <p className="text-muted-foreground font-body text-sm sm:text-base">
            Les Turbulences du Keur - Partager l'émotion, préserver l'anonymat
          </p>
        </div>
      </footer>
    </div>
  );
}
