"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { useLoading } from "@/context/loading-context"
import { useEffect, useState } from "react"

export default function ConnectedNav() {
  const { walletConnected, publicKey } = useWallet()
  const { isLoading } = useLoading()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isLoading) {
      setIsVisible(false)
    } else {
      // Add a small delay before showing the menu again
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // Don't show navigation if wallet is not connected
  if (!walletConnected && !pathname.includes("/analyst")) {
    return null
  }

  // Extract the wallet parameter from the URL if present
  const walletParam = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("wallet")

  // Use the wallet from context or from URL parameter
  const walletAddress = publicKey || walletParam || ""

  // Define navigation items
  const navItems = [
    {
      name: "Chat",
      href: `/analyst?wallet=${walletAddress}`,
      isActive: pathname === "/analyst" || pathname.startsWith("/analyst/chat"),
    },
    {
      name: "Graph",
      href: `/analyst/graph?wallet=${walletAddress}`,
      isActive: pathname.startsWith("/analyst/graph"),
    },
    {
      name: "Holdings",
      href: `/analyst/holdings?wallet=${walletAddress}`,
      isActive: pathname.startsWith("/analyst/holdings"),
    },
  ]

  if (!isVisible) return null

  return (
    <nav className="ml-auto mr-4">
      <ul className="flex">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`relative px-4 py-2 text-sm font-medium inline-block ${
                item.isActive ? "text-black" : "text-gray-500 hover:text-black"
              } transition-colors`}
            >
              {item.name}
              {item.isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-black"
                  layoutId="activeNavIndicator"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
