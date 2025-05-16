"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="/" className="font-mono text-xl tracking-tighter">
            Serttch
          </a>
          <nav className="hidden md:flex space-x-8 font-light">
            <a href="/#features" className="hover:text-gray-600 transition-colors">
              Features
            </a>
            <a href="/#about" className="hover:text-gray-600 transition-colors">
              About
            </a>
            <a href="/#contact" className="hover:text-gray-600 transition-colors">
              Team
            </a>
            <a href="/pricing" className="text-black font-medium">
              Pricing
            </a>
          </nav>
        </div>
      </header>

      <main className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
            <div className="h-px w-16 bg-black mx-auto my-6"></div>
            <p className="text-lg text-gray-600">
              Serttch is currently free to use during our beta phase. We're committed to providing value before
              introducing paid plans.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 border-black">
                <CardHeader className="text-center pb-8 pt-10">
                  <CardTitle className="text-3xl">Beta Access</CardTitle>
                  <div className="mt-4 mb-2">
                    <span className="text-5xl font-bold">Free</span>
                  </div>
                  <CardDescription className="text-base">
                    Full access to all features during our beta phase
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="space-y-4">
                    {[
                      "AI Portfolio Analysis",
                      "Wallet Connection (Phantom & Solflare)",
                      "Real-time Market Insights",
                      "Solana Ecosystem Integration",
                      "Privacy-focused Features",
                      "Early Access to New Features",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-black mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-center pb-10">
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-6 text-lg font-light tracking-wide">
                    <a href="/">Get Started</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-12 text-gray-600"
            >
              <p>
                We're constantly improving Serttch based on user feedback. Future paid plans will include advanced
                features while maintaining a free tier.
              </p>
              <p className="mt-4">
                Have questions about our pricing? Contact us at{" "}
                <a href="mailto:info@sertt.ch" className="text-black underline">
                  info@sertt.ch
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
