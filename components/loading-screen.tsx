"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLoading } from "@/context/loading-context"

export default function LoadingScreen() {
  const { isLoading, isInitialLoad } = useLoading()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    // Reset progress when loading starts
    setProgress(0)

    // Increment counter from 0 to 100
    const duration = isInitialLoad ? 2800 : 900 // Slightly shorter than the loading time
    const interval = duration / 100

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += 1
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isLoading, isInitialLoad])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
        >
          <div className="w-full max-w-md px-4">
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-mono text-4xl tracking-tighter mb-2">Serttch</h1>
              <p className="text-sm uppercase tracking-widest">Find. Verify.</p>
            </motion.div>

            <div className="relative mb-4">
              <div className="h-px w-full bg-gray-200"></div>
              <motion.div
                className="absolute top-0 left-0 h-px bg-black"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              ></motion.div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-mono text-sm">Loading</span>
              <span className="font-mono text-2xl tabular-nums">{progress}%</span>
            </div>

            {isInitialLoad && (
              <motion.div
                className="mt-16 text-center text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Modern blockchain verification platform with Swiss precision.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
