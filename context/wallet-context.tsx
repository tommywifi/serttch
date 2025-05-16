"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

interface WalletContextType {
  walletConnected: boolean
  publicKey: string | null
  selectedWallet: "Phantom" | "Solflare" | null
  disconnectWallet: () => Promise<void>
  showConnectionSuccess: boolean
  showDisconnectionSuccess: boolean
  setShowConnectionSuccess: (show: boolean) => void
  setShowDisconnectionSuccess: (show: boolean) => void
}

const WalletContext = createContext<WalletContextType>({
  walletConnected: false,
  publicKey: null,
  selectedWallet: null,
  disconnectWallet: async () => {},
  showConnectionSuccess: false,
  showDisconnectionSuccess: false,
  setShowConnectionSuccess: () => {},
  setShowDisconnectionSuccess: () => {},
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletConnected, setWalletConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<"Phantom" | "Solflare" | null>(null)
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false)
  const [showDisconnectionSuccess, setShowDisconnectionSuccess] = useState(false)

  // Check if wallet is connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search)
      const walletParam = urlParams.get("wallet")

      if (walletParam) {
        setPublicKey(walletParam)
        setWalletConnected(true)

        // Try to determine which wallet is connected
        if (window.solana?.isConnected) {
          setSelectedWallet("Phantom")
        } else if (window.solflare?.isConnected) {
          setSelectedWallet("Solflare")
        }
        return
      }

      // Otherwise check local storage
      const storedWalletData = localStorage.getItem("serttchWalletData")
      if (storedWalletData) {
        const { publicKey, wallet } = JSON.parse(storedWalletData)
        setPublicKey(publicKey)
        setSelectedWallet(wallet)
        setWalletConnected(true)
      }
    }

    checkWalletConnection()
  }, [])

  // Save wallet data when it changes
  useEffect(() => {
    if (publicKey && selectedWallet) {
      localStorage.setItem("serttchWalletData", JSON.stringify({ publicKey, wallet: selectedWallet }))
    }
  }, [publicKey, selectedWallet])

  const disconnectWallet = async () => {
    try {
      if (selectedWallet === "Phantom" && window.solana) {
        await window.solana.disconnect()
      } else if (selectedWallet === "Solflare" && window.solflare) {
        await window.solflare.disconnect()
      }

      // Show disconnection animation
      setShowDisconnectionSuccess(true)

      // After animation completes, update state
      setTimeout(() => {
        setPublicKey(null)
        setWalletConnected(false)
        setSelectedWallet(null)
        localStorage.removeItem("serttchWalletData")
        setShowDisconnectionSuccess(false)

        // Redirect to home page
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        publicKey,
        selectedWallet,
        disconnectWallet,
        showConnectionSuccess,
        showDisconnectionSuccess,
        setShowConnectionSuccess,
        setShowDisconnectionSuccess,
      }}
    >
      {children}

      {/* Global Connection Success Animation */}
      <AnimatePresence>
        {showConnectionSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }}>
                <CheckCircle size={64} className="text-green-500 mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Wallet Connected!</h3>
              <p className="text-gray-600 text-center mb-4">Successfully connected to {selectedWallet}</p>
              <motion.div
                className="h-1 bg-green-500 w-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Disconnection Success Animation */}
      <AnimatePresence>
        {showDisconnectionSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, -5, 5, -5, 0] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                rotate: { duration: 0.5 },
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 0.7 }}
              >
                <XCircle size={64} className="text-red-500 mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Wallet Disconnected</h3>
              <p className="text-gray-600 text-center mb-4">Your wallet has been safely disconnected</p>
              <motion.div
                className="h-1 bg-red-500 w-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WalletContext.Provider>
  )
}
