"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning" | "loading"
  message: string
  details?: string
}

export default function DiagnosticPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    const diagnostics: DiagnosticResult[] = []

    // Check environment variables
    console.log("[v0] Checking environment variables...")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    diagnostics.push({
      name: "Variables d'environnement",
      status: supabaseUrl && supabaseAnonKey ? "success" : "error",
      message:
        supabaseUrl && supabaseAnonKey
          ? "Les variables d'environnement sont configurées"
          : "Variables d'environnement manquantes",
      details: `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✓" : "✗"}\nNEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✓" : "✗"}`,
    })

    setResults([...diagnostics])

    // Test Supabase connection
    console.log("[v0] Testing Supabase connection...")
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("letters").select("count", { count: "exact", head: true })

      if (error) {
        console.error("[v0] Supabase connection error:", error)
        diagnostics.push({
          name: "Connexion Supabase",
          status: "error",
          message: "Erreur de connexion à Supabase",
          details: `Code: ${error.code}\nMessage: ${error.message}\nHint: ${error.hint || "N/A"}`,
        })
      } else {
        diagnostics.push({
          name: "Connexion Supabase",
          status: "success",
          message: "Connexion à Supabase réussie",
          details: `Nombre de lettres: ${data || 0}`,
        })
      }
    } catch (error) {
      console.error("[v0] Supabase connection exception:", error)
      diagnostics.push({
        name: "Connexion Supabase",
        status: "error",
        message: "Exception lors de la connexion",
        details: error instanceof Error ? error.message : String(error),
      })
    }

    setResults([...diagnostics])

    // Check if tables exist
    console.log("[v0] Checking database tables...")
    try {
      const supabase = createClient()
      const tables = ["letters", "admin_users", "admin_sessions", "page_contents", "mailbox_locations"]
      const tableResults: string[] = []

      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select("id", { count: "exact", head: true }).limit(1)

          if (error) {
            tableResults.push(`${table}: ✗ (${error.message})`)
          } else {
            tableResults.push(`${table}: ✓`)
          }
        } catch (err) {
          tableResults.push(`${table}: ✗ (exception)`)
        }
      }

      const allTablesExist = tableResults.every((r) => r.includes("✓"))

      diagnostics.push({
        name: "Tables de la base de données",
        status: allTablesExist ? "success" : "error",
        message: allTablesExist ? "Toutes les tables existent" : "Certaines tables sont manquantes",
        details: tableResults.join("\n"),
      })
    } catch (error) {
      diagnostics.push({
        name: "Tables de la base de données",
        status: "error",
        message: "Impossible de vérifier les tables",
        details: error instanceof Error ? error.message : String(error),
      })
    }

    setResults([...diagnostics])

    // Check RLS policies
    console.log("[v0] Testing RLS policies...")
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("letters").select("*").limit(1)

      if (error) {
        diagnostics.push({
          name: "Politiques RLS",
          status: "error",
          message: "Les politiques RLS bloquent l'accès",
          details: `Code: ${error.code}\nMessage: ${error.message}`,
        })
      } else {
        diagnostics.push({
          name: "Politiques RLS",
          status: "success",
          message: "Les politiques RLS permettent l'accès en lecture",
          details: `Nombre de lettres accessibles: ${data?.length || 0}`,
        })
      }
    } catch (error) {
      diagnostics.push({
        name: "Politiques RLS",
        status: "error",
        message: "Erreur lors du test des politiques RLS",
        details: error instanceof Error ? error.message : String(error),
      })
    }

    setResults([...diagnostics])
    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl text-primary">Diagnostic du système</h1>
          <p className="font-body text-muted-foreground">
            Vérification de la configuration et de la connexion à la base de données
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={runDiagnostics} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Diagnostic en cours...
              </>
            ) : (
              "Relancer le diagnostic"
            )}
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Retour au site</a>
          </Button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading text-lg">
                  {getStatusIcon(result.status)}
                  {result.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-body text-sm">{result.message}</p>
                {result.details && (
                  <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                    {result.details}
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length > 0 && results.some((r) => r.status === "error") && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-red-500">Actions recommandées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-body text-sm">
              <div>
                <h3 className="font-semibold mb-2">1. Exécuter le script SQL de configuration</h3>
                <p className="text-muted-foreground">
                  Assurez-vous d'avoir exécuté le script{" "}
                  <code className="bg-muted px-1 rounded">00-complete-setup.sql</code> depuis l'interface v0.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Vérifier les variables d'environnement</h3>
                <p className="text-muted-foreground">
                  Allez dans les paramètres du projet (icône engrenage en haut à droite) et vérifiez que l'intégration
                  Supabase est bien configurée.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Vérifier les politiques RLS</h3>
                <p className="text-muted-foreground">
                  Les politiques de sécurité au niveau des lignes (RLS) doivent permettre l'accès public en lecture aux
                  tables <code className="bg-muted px-1 rounded">letters</code> et{" "}
                  <code className="bg-muted px-1 rounded">page_contents</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
