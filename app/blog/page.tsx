import TwitterFeed from "@/components/twitter-feed"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="/" className="font-mono text-xl tracking-tighter">
            Serttch
          </a>
          <nav className="hidden md:flex space-x-8 font-light">
            <a href="/#features" className="hover:text-gray-600 transition-colors">
              Features
            </a>
            <a href="/#about" className="hover:text-gray-600 transition-colors">
              About
            </a>
            <a href="/#contact" className="hover:text-gray-600 transition-colors">
              Team
            </a>
            <a href="/blog" className="text-black font-medium">
              Blog
            </a>
          </nav>
        </div>
      </header>

      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Latest Updates</h1>
            <div className="h-px w-16 bg-black mx-auto my-6"></div>
            <p className="text-lg text-gray-600">
              Stay up to date with the latest news and announcements from the Serttch team.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <TwitterFeed />
          </div>

          <div className="text-center mt-12">
            <a
              href="https://x.com/serttch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-lg font-medium hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                  fill="currentColor"
                />
              </svg>
              Follow us on X for more updates
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
