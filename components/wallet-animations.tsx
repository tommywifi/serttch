"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

interface WalletConnectionSuccessProps {
  walletName: string | null
}

export function WalletConnectionSuccess({ walletName }: WalletConnectionSuccessProps) {
  return (
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
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.5,
          y: { repeat: 2, repeatType: "reverse", duration: 0.3, delay: 0.5 },
        }}
      >
        <CheckCircle size={64} className="text-green-500 mb-4" />
      </motion.div>
      <h3 className="text-xl font-bold mb-2">Wallet Connected!</h3>
      <p className="text-gray-600 text-center mb-4">Successfully connected to {walletName}</p>
      <motion.div
        className="h-1 bg-green-500 w-full rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="h-full w-full bg-green-300"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export function WalletDisconnectionSuccess() {
  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center"
      initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: [0, -3, 3, -3, 0] }}
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
        className="h-1 bg-red-500 w-full rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="h-full w-full bg-red-300"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
