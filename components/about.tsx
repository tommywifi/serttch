"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface AboutItem {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
}

const aboutItems: AboutItem[] = [
  {
    id: "vision",
    title: "Our Vision",
    shortDescription: "Serttch is a tech-savvy team crafting an AI-powered Solana blockchain guide.",
    fullDescription:
      "Serttch is a tech-savvy team crafting Serttch, an AI-powered Solana blockchain guide, passionately integrating cutting-edge X API features and planning Monero transaction anonymization. We're committed to building tools that provide clarity and precision in the blockchain space.",
  },
  {
    id: "mission",
    title: "Our Mission",
    shortDescription: "Serttch's cooking up AI-powered Solana insights, teasing UI revamps.",
    fullDescription:
      "Serttch's cooking up AI-powered Solana insights, teasing UI revamps, and eyeing Monero anonymity features. Our mission is to make blockchain data accessible and understandable while maintaining the highest standards of privacy and security for our users.",
  },
  {
    id: "values",
    title: "Our Values",
    shortDescription: "Smart Insights for a Smarter Portfolio. Built for precision and clarity.",
    fullDescription:
      "Serttch — Smart Insights for a Smarter Portfolio. Serttch is your ultimate AI-powered Solana guide, built for precision and clarity. We value transparency, privacy, and user empowerment, ensuring that our tools provide actionable insights while respecting user autonomy.",
  },
]

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Handle keyboard navigation between items
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, currentId: string, index: number) => {
    switch (e.key) {
      case "Enter":
      case " ": // Space
        e.preventDefault()
        setActiveItem(activeItem === currentId ? null : currentId)
        break
      case "Escape":
        e.preventDefault()
        setActiveItem(null)
        break
      case "ArrowRight":
        e.preventDefault()
        if (index < aboutItems.length - 1) {
          const nextId = aboutItems[index + 1].id
          itemRefs.current[nextId]?.focus()
        }
        break
      case "ArrowLeft":
        e.preventDefault()
        if (index > 0) {
          const prevId = aboutItems[index - 1].id
          itemRefs.current[prevId]?.focus()
        }
        break
    }
  }

  // Reset active item when focus is lost
  useEffect(() => {
    if (!focusedItem) {
      setActiveItem(null)
    }
  }, [focusedItem])

  return (
    <section id="about" ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">About Serttch</h2>
          <div className="h-px w-16 bg-black mx-auto my-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 max-w-6xl mx-auto" role="tablist">
          {aboutItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white relative outline-none ${
                focusedItem === item.id ? "ring-2 ring-black ring-offset-2" : ""
              }`}
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
              onFocus={() => {
                setFocusedItem(item.id)
                setActiveItem(item.id)
              }}
              onBlur={() => {
                setFocusedItem(null)
              }}
              tabIndex={0}
              role="tab"
              aria-selected={activeItem === item.id}
              aria-controls={`${item.id}-content`}
              id={`${item.id}-tab`}
              ref={(el) => (itemRefs.current[item.id] = el)}
              onKeyDown={(e) => handleKeyDown(e, item.id, index)}
            >
              <div className="p-8 h-full">
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>

                <div
                  className="relative overflow-hidden"
                  style={{ minHeight: "120px" }}
                  id={`${item.id}-content`}
                  role="tabpanel"
                  aria-labelledby={`${item.id}-tab`}
                >
                  {/* Short description (always visible) */}
                  <motion.div
                    animate={{
                      opacity: activeItem === item.id ? 0 : 1,
                      y: activeItem === item.id ? -20 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <p className="text-gray-600">{item.shortDescription}</p>
                  </motion.div>

                  {/* Full description (visible on hover/focus) */}
                  <motion.div
                    animate={{
                      opacity: activeItem === item.id ? 1 : 0,
                      y: activeItem === item.id ? 0 : 20,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <p className="text-gray-800">{item.fullDescription}</p>
                  </motion.div>
                </div>
              </div>

              {/* Animated underline */}
              <motion.div
                className="h-px bg-black absolute bottom-0 left-0 right-0"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: activeItem === item.id || focusedItem === item.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="https://x.com/serttch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-lg font-medium hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
              aria-hidden="true"
            >
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                fill="currentColor"
              />
            </svg>
            <span>@serttch</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
