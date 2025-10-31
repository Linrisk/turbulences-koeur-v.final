"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  // Vérifier si l'utilisateur a une session localStorage existante au chargement
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const userId = localStorage.getItem("admin_userId");

        if (token && userId) {
          // Utilisateur déjà connecté, rediriger vers dashboard
          console.log("[Login] Session trouvée, redirection vers dashboard");
          router.push("/admin/dashboard-page");
          return;
        }

        setIsCheckingSession(false);
      } catch (error) {
        console.error("[Login] Erreur lors de la vérification de session:", error);
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("[Login] Tentative de connexion avec login:", login);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      console.log("[Login] Réponse API:", { success: data.success, error: data.error });

      if (res.ok && data.success) {
        // Stocker les données dans localStorage
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_userId", data.user.id);
        localStorage.setItem("admin_login", data.user.login);
        localStorage.setItem("admin_email", data.user.email);
        localStorage.setItem("admin_role", data.user.role);
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_login_time", Date.now().toString());

        console.log("[Login] Session stockée dans localStorage");

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user.login}! Vous êtes connecté en tant que ${data.user.role}`,
        });

        // Rediriger vers le dashboard
        console.log("[Login] Redirection vers /admin/dashboard-page");
        router.push("/admin/dashboard-page");
      } else {
        console.log("[Login] Identifiants incorrects:", data.error);
        toast({
          title: "Erreur de connexion",
          description: data.error || "Identifiants incorrects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[Login] Erreur lors de la connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <p className="text-slate-300">Vérification de la session...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader className="space-y-2 text-center border-b border-slate-700 pb-6">
          <CardTitle className="text-3xl font-bold text-pink-400">
            Connexion Admin
          </CardTitle>
          <p className="text-sm text-slate-400">
            Connectez-vous pour accéder à l'interface d'administration
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="login"
                className="flex items-center gap-2 text-slate-300 font-semibold"
              >
                <User className="w-4 h-4 text-pink-400" />
                Identifiant
              </Label>
              <Input
                id="login"
                type="text"
                placeholder="admin ou facteur"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-slate-300 font-semibold"
              >
                <Lock className="w-4 h-4 text-pink-400" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-pink-400 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚙️</span>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-300">
            <p className="font-semibold mb-3 text-slate-200">Comptes de test :</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between items-center">
                <span>
                  <strong>admin</strong>
                </span>
                <span className="text-slate-500">/</span>
                <span>turbulences2024</span>
              </li>
              <li className="flex justify-between items-center">
                <span>
                  <strong>facteur</strong>
                </span>
                <span className="text-slate-500">/</span>
                <span>turbulences2024</span>
              </li>
            </ul>
            <p className="text-xs text-slate-500 mt-3 italic">
              💡 Vous resterez connecté tant que vous ne vous déconnecterez pas.
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded text-xs text-blue-300">
            <p>
              <strong>ℹ️ Note :</strong> Votre session est stockée localement sur votre navigateur.
              Elle ne sera jamais supprimée automatiquement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
