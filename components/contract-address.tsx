"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, CheckCircle } from "lucide-react"

export default function ContractAddress() {
  const [copied, setCopied] = useState(false)
  const contractAddress = "Coming Soon!"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contract" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight" variants={itemVariants}>
            Contract Address
          </motion.h2>

          <motion.div className="h-px w-16 bg-black mx-auto my-8" variants={itemVariants} />

          <motion.div className="bg-gray-50 rounded-lg p-8 mb-8 shadow-sm" variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4"></h3>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code className="text-sm sm:text-base font-mono break-all">{contractAddress}</code>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center px-6 py-3 border border-black rounded-md hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <CheckCircle size={18} className="mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} className="mr-2" />
                    Copy Address
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.p className="text-sm text-gray-500" variants={itemVariants}>
            View detailed contract information and transactions on Solscan.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
