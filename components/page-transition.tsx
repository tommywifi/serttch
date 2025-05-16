"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useLoading } from "@/context/loading-context"

export default function PageTransition() {
  const { isLoading, isInitialLoad, isTransitioning } = useLoading()

  // Only show this for non-initial loads
  if (isInitialLoad) return null

  return (
    <AnimatePresence>
      {(isLoading || isTransitioning) && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-40 h-1 bg-black"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          exit={{
            scaleX: 0,
            transformOrigin: "right",
            transition: { duration: 0.3 },
          }}
          transition={{ duration: 0.8 }}
        />
      )}
    </AnimatePresence>
  )
}
