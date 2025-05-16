import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/context/wallet-context"
import { LoadingProvider } from "@/context/loading-context"
import LoadingScreen from "@/components/loading-screen"
import PageTransition from "@/components/page-transition"
import ImagePreloader from "@/components/image-preloader"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Serttch - Find. Verify.",
  description:
    "Serttch is an AI-powered Solana guide delivering smart, real-time insights on crypto holdings with a focus on precision, privacy, and portfolio performance.",
  openGraph: {
    title: "Serttch - Find. Verify.",
    description:
      "Serttch is an AI-powered Solana guide delivering smart, real-time insights on crypto holdings with a focus on precision, privacy, and portfolio performance.",
    type: "website",
    locale: "en_US",
    url: "https://serttch.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Serttch - Find. Verify.",
    description:
      "Serttch is an AI-powered Solana guide delivering smart, real-time insights on crypto holdings with a focus on precision, privacy, and portfolio performance.",
    creator: "@serttch",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LoadingProvider>
            <WalletProvider>
              <ImagePreloader />
              <LoadingScreen />
              <PageTransition />
              <div className="relative z-20">{children}</div>
            </WalletProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
