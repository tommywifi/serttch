"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function CareersPage() {
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
            <a href="/careers" className="text-black font-medium">
              Careers
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Join Our Team</h1>
            <div className="h-px w-16 bg-black mx-auto my-6"></div>
            <p className="text-lg text-gray-600">
              We're building the future of blockchain analytics and privacy-focused tools. Join us on this journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-gray-50 p-12 border-l-2 border-black"
          >
            <h2 className="text-2xl font-bold mb-4">We are currently hiring</h2>
            <p className="text-lg mb-6">
              If you have experience in blockchain development, AI, or privacy-focused technologies, we'd love to hear
              from you.
            </p>
            <p className="mb-8">
              Please send your resume and a brief introduction to{" "}
              <a href="mailto:k.buostek@sertt.ch" className="text-black underline">
                k.buostek@sertt.ch
              </a>
            </p>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-6 text-lg font-light tracking-wide">
              <a href="mailto:k.buostek@sertt.ch">Apply Now</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl mx-auto mt-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Why Join Serttch?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white border border-gray-100">
                <h3 className="font-bold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  Work on cutting-edge technologies at the intersection of blockchain, AI, and privacy.
                </p>
              </div>
              <div className="p-6 bg-white border border-gray-100">
                <h3 className="font-bold mb-2">Flexibility</h3>
                <p className="text-gray-600">
                  Remote-first culture with flexible hours and a focus on results rather than hours worked.
                </p>
              </div>
              <div className="p-6 bg-white border border-gray-100">
                <h3 className="font-bold mb-2">Growth</h3>
                <p className="text-gray-600">
                  Join a rapidly growing startup with opportunities for advancement and skill development.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
