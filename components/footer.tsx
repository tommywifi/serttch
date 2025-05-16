"use client"

import { ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Serttch</h3>
            <p className="text-sm text-gray-600 mb-4">Modern blockchain verification platform with Swiss precision.</p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/pricing" className="text-gray-600 hover:text-black transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="https://serttch.gitbook.io/serttch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors inline-flex items-center"
                >
                  Documentation
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-gray-600 hover:text-black transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-black transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-600 hover:text-black transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-black transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-black transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-black transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="/security" className="text-gray-600 hover:text-black transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-gray-100 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Serttch. All rights reserved.</p>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://x.com/serttch"
              className="text-gray-600 hover:text-black transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">X (Twitter)</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://serttch.gitbook.io/serttch"
              className="text-gray-600 hover:text-black transition-colors inline-flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">Documentation</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
              <ExternalLink size={12} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
