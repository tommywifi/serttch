"use client"

import { Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import components that use client-side hooks
const Hero = dynamic(() => import("@/components/hero"), { ssr: false })
const Features = dynamic(() => import("@/components/features"), { ssr: false })
const About = dynamic(() => import("@/components/about"), { ssr: false })
const ContractAddress = dynamic(() => import("@/components/contract-address"), { ssr: false })
const Contact = dynamic(() => import("@/components/contact"), { ssr: false })
const Footer = dynamic(() => import("@/components/footer"), { ssr: false })

export default function HomeContent() {
  // Add a state to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything on the server
  if (!isMounted) {
    return null
  }

  return (
    <>
      <Suspense fallback={<div className="h-screen bg-white"></div>}>
        <Hero />
      </Suspense>
      <Suspense fallback={<div className="py-24 bg-gray-50"></div>}>
        <Features />
      </Suspense>
      <Suspense fallback={<div className="py-24 bg-white"></div>}>
        <About />
      </Suspense>
      <Suspense fallback={<div className="py-24 bg-gray-100"></div>}>
        <ContractAddress />
      </Suspense>
      <Suspense fallback={<div className="py-24 bg-gray-50"></div>}>
        <Contact />
      </Suspense>
      <Suspense fallback={<div className="py-12 border-t border-gray-100"></div>}>
        <Footer />
      </Suspense>
    </>
  )
}
