"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  name: string
  title: string
  email: string
  quote: string
  background: string
  expertise: string[]
  image: string
}

// Update the teamMembers array with the provided image URLs
const teamMembers: TeamMember[] = [
  {
    name: "Falko Erdhart",
    title: "Chief Security Officer",
    email: "f.endhart@sertt.ch",
    quote:
      "Pioneering the intersection of cryptography and user experience. Building secure systems shouldn't mean sacrificing simplicity.",
    background: "Cryptography expert with 8+ years in blockchain security systems",
    expertise: [
      "Zero-knowledge proofs",
      "Secure multi-party computation",
      "Homomorphic encryption",
      "Blockchain security auditing",
    ],
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/falko-face-modified-removebg-preview-N06kqPYKrxaXSSaEFkXUnaRHYXDaS1.png",
  },
  {
    name: "Kostas Buostek",
    title: "Lead Developer",
    email: "k.buostek@sertt.ch",
    quote:
      "The future of finance is programmable, transparent, and accessible to all. Solana is just the beginning of what's possible.",
    background: "Full-stack developer specializing in DeFi protocols and cross-chain solutions",
    expertise: [
      "Solana program development",
      "Cross-chain bridges",
      "DeFi protocol design",
      "Smart contract optimization",
    ],
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kostas-face-modified-removebg-preview-kZ30k1ZWPhzXf6UdUaNWm9cMnidn6H.png",
  },
  {
    name: "Leon Marques",
    title: "Privacy Architect",
    email: "l.marques@sertt.ch",
    quote:
      "Privacy isn't just a feature, it's a fundamental right. Our work with Monero integration ensures your financial sovereignty.",
    background: "Privacy advocate and blockchain architect focused on zero-knowledge implementations",
    expertise: [
      "Monero implementation",
      "Privacy-preserving analytics",
      "Secure wallet design",
      "Regulatory compliance",
    ],
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leon-face-modified-removebg-preview-Inno3y6hn5TlTyECSm59npKtp5uYck.png",
  },
]

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [expandedMember, setExpandedMember] = useState<string | null>(null)
  const memberRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const emailRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({})

  const toggleMember = (name: string) => {
    if (expandedMember === name) {
      setExpandedMember(null)
    } else {
      setExpandedMember(name)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, name: string, index: number) => {
    switch (e.key) {
      case "Enter":
      case " ": // Space
        e.preventDefault()
        toggleMember(name)
        break
      case "Escape":
        if (expandedMember === name) {
          e.preventDefault()
          setExpandedMember(null)
        }
        break
      case "ArrowDown":
        e.preventDefault()
        if (index < teamMembers.length - 1) {
          const nextName = teamMembers[index + 1].name
          memberRefs.current[nextName]?.focus()
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (index > 0) {
          const prevName = teamMembers[index - 1].name
          memberRefs.current[prevName]?.focus()
        }
        break
      case "Tab":
        // If expanded and not holding shift, we want to trap focus within this member card
        if (expandedMember === name && !e.shiftKey) {
          const emailElement = emailRefs.current[name]
          if (document.activeElement === emailElement) {
            e.preventDefault()
            memberRefs.current[name]?.focus()
          }
        }
        break
    }
  }

  const handleEmailKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, name: string) => {
    // Prevent propagation to avoid triggering the parent's keydown handler
    e.stopPropagation()
  }

  return (
    <section id="contact" ref={ref} className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Our Team</h2>
          <div className="h-px w-16 bg-black mx-auto my-6"></div>
          <p className="text-lg text-gray-600">Meet the founders behind Serttch's vision and innovation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-100 hover:border-black transition-colors duration-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
            >
              <div
                className="p-8 cursor-pointer outline-none"
                onClick={() => toggleMember(member.name)}
                onKeyDown={(e) => handleKeyDown(e, member.name, index)}
                tabIndex={0}
                role="button"
                aria-expanded={expandedMember === member.name}
                aria-controls={`${member.name.replace(/\s+/g, "-").toLowerCase()}-details`}
                ref={(el) => (memberRefs.current[member.name] = el)}
              >
                {/* Profile Image - Using the provided image URLs */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={`${member.name}`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      style={{ imageRendering: "pixelated" }}
                      onError={(e) => {
                        // Fallback to a colored background with initials if image fails to load
                        const target = e.target as HTMLImageElement
                        const initials = member.name
                          .split(" ")
                          .map((part) => part.charAt(0))
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)
                        const colors = ["#6E56CF", "#0EA5E9", "#10B981"]
                        const svg = `
                          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
                            <rect width="96" height="96" fill="${colors[index % colors.length]}" />
                            <text x="48" y="48" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="central">${initials}</text>
                          </svg>
                        `
                        target.src = `data:image/svg+xml;base64,${btoa(svg)}`
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{member.title}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedMember === member.name ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>

                <a
                  href={`mailto:${member.email}`}
                  className="text-sm font-mono text-gray-600 hover:text-black transition-colors mb-4 inline-block focus:outline-none focus:ring-2 focus:ring-black"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => handleEmailKeyDown(e, member.name)}
                  ref={(el) => (emailRefs.current[member.name] = el)}
                  aria-label={`Email ${member.name} at ${member.email}`}
                >
                  {member.email}
                </a>

                <div className="h-px w-12 bg-gray-200 my-4"></div>

                <p className="italic text-gray-600 mb-4">"{member.quote}"</p>

                <motion.div
                  animate={{
                    height: expandedMember === member.name ? "auto" : 0,
                    opacity: expandedMember === member.name ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                  id={`${member.name.replace(/\s+/g, "-").toLowerCase()}-details`}
                >
                  <div className="pt-4">
                    <p className="text-sm text-gray-800 mb-4">{member.background}</p>

                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Areas of Expertise</p>
                    <ul className="space-y-1" role="list">
                      {member.expertise.map((skill, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <span className="mr-2 text-black" aria-hidden="true">
                            •
                          </span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
