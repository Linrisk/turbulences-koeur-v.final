"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  login: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      const userId = localStorage.getItem("admin_userId");
      const userLogin = localStorage.getItem("admin_login");
      const userEmail = localStorage.getItem("admin_email");
      const userRole = localStorage.getItem("admin_role");

      if (!token || !userId) {
        // Pas d'authentification, rediriger vers login
        router.push("/admin/login");
        return;
      }

      // Utilisateur authentifié
      setUser({
        id: userId,
        login: userLogin || "",
        email: userEmail || "",
        role: userRole || "admin",
      });

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
  const userId = localStorage.getItem("admin_userId");

  try {
    // Appel optionnel à l'API pour logger la déconnexion
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion API:", error);
  }

  // Supprimer les données du localStorage
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_userId");
  localStorage.removeItem("admin_login");
  localStorage.removeItem("admin_email");
  localStorage.removeItem("admin_role");
  localStorage.removeItem("admin_authenticated");
  localStorage.removeItem("admin_login_time");

  console.log("[Logout] localStorage nettoyé");

  toast({
    title: "Déconnecté",
    description: "Vous avez été déconnecté avec succès",
  });

  // Rediriger vers login
  router.push("/admin/login");
};


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
          <p className="text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-pink-400">Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">
                Connecté en tant que: <span className="font-semibold">{user.login}</span> ({user.role})
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-pink-400">Bienvenue au Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Vous êtes connecté. Vous resterez connecté tant que vous ne cliquez pas sur "Déconnexion".
            </p>
            <p className="text-slate-400 text-sm mt-4">
              Les données de session sont stockées dans localStorage de votre navigateur.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
