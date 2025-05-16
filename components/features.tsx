"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"

const features = [
  {
    id: "find",
    title: "Find",
    description: "Discover and explore verified information with precision and ease.",
    icon: (
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
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
    details: [
      "Advanced search algorithms for precise results",
      "Real-time data indexing across the Solana ecosystem",
      "Customizable filters for targeted exploration",
      "Bookmark and save important discoveries",
    ],
  },
  {
    id: "verify",
    title: "Verify",
    description: "Authenticate and validate with blockchain-powered verification systems.",
    icon: (
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    details: [
      "Cryptographic verification of on-chain data",
      "Multi-signature validation protocols",
      "Transparent audit trails for all verifications",
      "Zero-knowledge proof integration for privacy",
    ],
  },
  {
    id: "secure",
    title: "Secure",
    description: "End-to-end encryption and decentralized storage for maximum security.",
    icon: (
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
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    details: [
      "Military-grade encryption for all data",
      "Decentralized storage across multiple nodes",
      "Regular security audits by leading firms",
      "Self-custody principles for user control",
    ],
  },
  {
    id: "connect",
    title: "Connect",
    description: "Seamlessly connect with multiple blockchain networks and services.",
    icon: (
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
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
    details: [
      "Multi-wallet integration (Phantom, Solflare, and more)",
      "Cross-chain compatibility with major networks",
      "API connections to leading DeFi protocols",
      "Real-time data synchronization",
    ],
  },
]

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section id="features" ref={ref} className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Key Features</h2>
          <div className="h-px w-16 bg-black mx-auto my-6"></div>
          <p className="text-lg text-gray-600">
            Serttch provides powerful tools for finding and verifying information on the blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 max-w-6xl mx-auto">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white"
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div
                className={`p-8 h-full transition-all duration-300 ${
                  activeFeature === feature.id ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={`mb-4 ${activeFeature === feature.id ? "text-gray-300" : "text-gray-600"}`}>
                  {feature.description}
                </p>

                <AnimatePresence>
                  {activeFeature === feature.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 space-y-2 text-sm">
                        {feature.details.map((detail, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className="flex items-start"
                          >
                            <span className="mr-2">•</span>
                            <span>{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
