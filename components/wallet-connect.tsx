"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

// Define wallet types
type WalletName = "Phantom" | "Solflare" | null

// Define wallet window interface
interface WalletWindow extends Window {
  solana?: any
  solflare?: any
}

declare const window: WalletWindow

export default function WalletConnect() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<WalletName>(null)
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<WalletName | null>(null)
  const [hoveredWallet, setHoveredWallet] = useState<WalletName | null>(null)

  // Animation states
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false)
  const [showDisconnectionSuccess, setShowDisconnectionSuccess] = useState(false)

  // Check if wallets are available
  const [walletsAvailable, setWalletsAvailable] = useState({
    phantom: false,
    solflare: false,
  })

  useEffect(() => {
    const checkWalletAvailability = () => {
      setWalletsAvailable({
        phantom: window.solana && window.solana.isPhantom,
        solflare: window.solflare,
      })
    }

    // Check immediately
    checkWalletAvailability()

    // Also check after a short delay to ensure extensions have loaded
    const timer = setTimeout(checkWalletAvailability, 500)
    return () => clearTimeout(timer)
  }, [])

  // Update the connectWallet function to show success animation
  const connectWallet = async (walletName: WalletName) => {
    try {
      setConnecting(true)
      setConnectingWallet(walletName)
      setSelectedWallet(walletName)

      let wallet

      if (walletName === "Phantom") {
        wallet = window.solana
      } else if (walletName === "Solflare") {
        wallet = window.solflare
      }

      if (!wallet) {
        throw new Error(`${walletName} wallet not found`)
      }

      // Connect to the wallet
      const response = await wallet.connect()

      // Get the public key
      const publicKey = response.publicKey.toString()

      setPublicKey(publicKey)
      setWalletConnected(true)
      setShowWalletOptions(false)

      // Show success animation
      setShowConnectionSuccess(true)

      // Hide success animation after 2 seconds
      setTimeout(() => {
        setShowConnectionSuccess(false)
        // Redirect to the analyst page after successful connection
        window.location.href = `/analyst?wallet=${publicKey}`
      }, 2000)
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      setConnecting(false)
      setConnectingWallet(null)
    }
  }

  const disconnectWallet = async () => {
    try {
      if (selectedWallet === "Phantom" && window.solana) {
        await window.solana.disconnect()
      } else if (selectedWallet === "Solflare" && window.solflare) {
        await window.solflare.disconnect()
      }

      // Show disconnection animation
      setShowDisconnectionSuccess(true)

      // After animation completes, update state and redirect
      setTimeout(() => {
        setPublicKey(null)
        setWalletConnected(false)
        setSelectedWallet(null)
        setShowDisconnectionSuccess(false)

        // Redirect to home page
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const toggleWalletOptions = () => {
    setShowWalletOptions(!showWalletOptions)
  }

  const formatPublicKey = (key: string) => {
    if (!key) return ""
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
  }

  return (
    <div className="relative">
      {!walletConnected ? (
        <div>
          <Button
            onClick={toggleWalletOptions}
            className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-6 text-lg font-light tracking-wide"
          >
            Connect Wallet
          </Button>

          <AnimatePresence>
            {showWalletOptions && (
              <motion.div
                className="absolute mt-2 w-full bg-white shadow-lg border border-gray-100 rounded-sm z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2">
                  <button
                    onClick={() => connectWallet("Phantom")}
                    onMouseEnter={() => setHoveredWallet("Phantom")}
                    onMouseLeave={() => setHoveredWallet(null)}
                    disabled={!walletsAvailable.phantom || connecting}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed relative"
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/images/wallets/phantom-wallet-modified.png"
                        alt="Phantom Wallet"
                        width={24}
                        height={24}
                        className={`transition-transform duration-200 ${hoveredWallet === "Phantom" ? "scale-110" : "scale-100"}`}
                      />
                    </div>
                    <span>Phantom</span>
                    {!walletsAvailable.phantom && <span className="text-xs text-gray-500 ml-auto">Not installed</span>}

                    {/* Connection status indicator */}
                    {connectingWallet === "Phantom" && (
                      <motion.span
                        className="ml-auto text-xs text-purple-600 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="inline-block mr-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        >
                          Connecting
                        </motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                        >
                          ...
                        </motion.span>
                      </motion.span>
                    )}
                  </button>

                  <button
                    onClick={() => connectWallet("Solflare")}
                    onMouseEnter={() => setHoveredWallet("Solflare")}
                    onMouseLeave={() => setHoveredWallet(null)}
                    disabled={!walletsAvailable.solflare || connecting}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed relative"
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/images/wallets/solflare-wallet-modified.jpeg"
                        alt="Solflare Wallet"
                        width={24}
                        height={24}
                        className={`transition-transform duration-200 ${hoveredWallet === "Solflare" ? "scale-110" : "scale-100"}`}
                      />
                    </div>
                    <span>Solflare</span>
                    {!walletsAvailable.solflare && <span className="text-xs text-gray-500 ml-auto">Not installed</span>}

                    {/* Connection status indicator */}
                    {connectingWallet === "Solflare" && (
                      <motion.span
                        className="ml-auto text-xs text-yellow-600 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="inline-block mr-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        >
                          Connecting
                        </motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                        >
                          ...
                        </motion.span>
                      </motion.span>
                    )}
                  </button>
                </div>

                {/* Overall connecting state */}
                {connecting && (
                  <motion.div
                    className="p-2 border-t border-gray-100 text-center text-sm text-gray-500"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    Please check your browser extension to complete the connection
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-gray-50 px-4 py-2 rounded-sm text-sm font-mono">{formatPublicKey(publicKey || "")}</div>
          <Button onClick={disconnectWallet} variant="outline" className="text-sm rounded-none">
            Disconnect
          </Button>
        </div>
      )}

      {/* Connection Success Animation */}
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

      {/* Disconnection Success Animation */}
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
    </div>
  )
}
