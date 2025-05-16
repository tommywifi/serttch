"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import WalletConnect from "./wallet-connect"
import { usePageTransition } from "@/hooks/use-page-transition"
import { ExternalLink } from "lucide-react"

export default function Hero() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Initialize page transition
  usePageTransition()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm py-4" : "py-6"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-mono text-xl tracking-tighter">Serttch</div>
          <div className="hidden md:flex space-x-8 font-light">
            <a href="#features" className="hover:text-gray-600 transition-colors">
              Features
            </a>
            <a href="#about" className="hover:text-gray-600 transition-colors">
              About
            </a>
            <a href="#contract" className="hover:text-gray-600 transition-colors">
              Contract
            </a>
            <a href="#contact" className="hover:text-gray-600 transition-colors">
              Team
            </a>
            <a href="/pricing" className="hover:text-gray-600 transition-colors">
              Pricing
            </a>
            <a href="/blog" className="hover:text-gray-600 transition-colors">
              Blog
            </a>
            <a
              href="https://serttch.gitbook.io/serttch"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors inline-flex items-center"
            >
              Docs
              <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
          <div className="md:hidden">
            <button className="p-2" onClick={toggleMobileMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 py-4"
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <a href="#features" className="hover:text-gray-600 transition-colors py-2" onClick={toggleMobileMenu}>
                Features
              </a>
              <a href="#about" className="hover:text-gray-600 transition-colors py-2" onClick={toggleMobileMenu}>
                About
              </a>
              <a href="#contract" className="hover:text-gray-600 transition-colors py-2" onClick={toggleMobileMenu}>
                Contract
              </a>
              <a href="#contact" className="hover:text-gray-600 transition-colors py-2" onClick={toggleMobileMenu}>
                Team
              </a>
              <a href="/pricing" className="hover:text-gray-600 transition-colors py-2" onClick={toggleMobileMenu}>
                Pricing
              </a>
              <a href="/blog" className="hover:text-gray-600 transition-colors py-2" onClick={toggleMobileMenu}>
                Blog
              </a>
              <a
                href="https://serttch.gitbook.io/serttch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors py-2 inline-flex items-center"
                onClick={toggleMobileMenu}
              >
                Docs
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4">Serttch</h1>
        <div className="h-px w-16 bg-black mx-auto my-8"></div>
        <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-12">Find. Verify.</h2>

        <WalletConnect />
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <a
          href="#features"
          className="flex flex-col items-center text-sm text-gray-500 hover:text-black transition-colors"
        >
          <span className="mb-2">Discover More</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </motion.div>
    </section>
  )
}
