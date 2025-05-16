"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Tweet {
  id: string
  html: string
}

export default function TwitterFeed() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement("script")
    script.src = "https://platform.twitter.com/widgets.js"
    script.async = true
    script.charset = "utf-8"
    document.body.appendChild(script)

    script.onload = () => {
      // @ts-ignore - Twitter widget global
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore - Twitter widget global
        window.twttr.widgets.load()
        setIsLoading(false)
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border border-gray-100 hover:border-black transition-colors duration-300">
          <CardContent className="p-6">
            <div
              dangerouslySetInnerHTML={{
                __html: `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sneak peak... <a href="https://t.co/uSIvkAg5oD">pic.twitter.com/uSIvkAg5oD</a></p>&mdash; Serttch (@serttch) <a href="https://twitter.com/serttch/status/1923113158098420068?ref_src=twsrc%5Etfw">May 15, 2025</a></blockquote>`,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-gray-100 hover:border-black transition-colors duration-300">
          <CardContent className="p-6">
            <div
              dangerouslySetInnerHTML={{
                __html: `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Views from last years Solana Breakpoint.<br><br>We&#39;re attending this year, if you&#39;re going let us know down below. <a href="https://t.co/M6tTqgHpTA">pic.twitter.com/M6tTqgHpTA</a></p>&mdash; Serttch (@serttch) <a href="https://twitter.com/serttch/status/1921635468464042159?ref_src=twsrc%5Etfw">May 11, 2025</a></blockquote>`,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border border-gray-100 hover:border-black transition-colors duration-300">
          <CardContent className="p-6">
            <div
              dangerouslySetInnerHTML={{
                __html: `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The Serrtch technical documentation is now available.<br><br>For more information, check out: <a href="https://t.co/T1hWyajkde">https://t.co/T1hWyajkde</a> <a href="https://t.co/uBhLTOnuJl">pic.twitter.com/uBhLTOnuJl</a></p>&mdash; Serttch (@serttch) <a href="https://twitter.com/serttch/status/1921167961995268138?ref_src=twsrc%5Etfw">May 10, 2025</a></blockquote>`,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
