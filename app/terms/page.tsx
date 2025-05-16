export default function TermsPage() {
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
          </nav>
        </div>
      </header>

      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <div className="h-px w-16 bg-black mx-auto my-6"></div>
            <p className="text-lg text-gray-600">Last updated: May 15, 2023</p>
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg">
            <p>
              These Terms of Service ("Terms") govern your access to and use of the Serttch service. Please read these
              Terms carefully before using our service.
            </p>

            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using our service, you agree to be bound by these Terms. If you do not agree to these
              Terms, you may not access or use the service.
            </p>

            <h2>Description of Service</h2>
            <p>
              Serttch provides an AI-powered Solana blockchain guide focused on clarity, precision, and privacy. Our
              service analyzes blockchain data to provide insights and recommendations.
            </p>

            <h2>User Accounts</h2>
            <p>
              To use certain features of our service, you may need to connect your wallet. You are responsible for
              safeguarding your wallet and for all activities that occur through your wallet.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by Serttch and are protected
              by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Serttch, its directors, employees, partners, agents, suppliers, or affiliates be liable
              for any indirect, incidental, special, consequential, or punitive damages, including without limitation,
              loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>Disclaimer</h2>
            <p>
              Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE"
              basis. The service is provided without warranties of any kind, whether express or implied.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the jurisdiction in which Serttch is established, without
              regard to its conflict of law provisions.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking effect.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@sertt.ch">legal@sertt.ch</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
