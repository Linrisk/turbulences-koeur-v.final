import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import localFont from "next/font/local";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Les Turbulences du Keur",
  description: "Lisez des lettres anonymes de votre ville",
  generator: "v0.app",
}

const lazyDog = localFont({
  src: [
    {
      path: "../public/fonts/Lazydog.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lazy-Dog",
});


const petitCochon = localFont({
  src: [
    {
      path: "../public/fonts/Petit-Cochon.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-petit-cochon",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Comfortaa:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
