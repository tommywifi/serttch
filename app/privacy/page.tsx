export default function PrivacyPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <div className="h-px w-16 bg-black mx-auto my-6"></div>
            <p className="text-lg text-gray-600">Last updated: May 15, 2023</p>
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg">
            <p>
              At Serttch, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our service.
            </p>

            <h2>Information We Collect</h2>
            <p>We collect information that you voluntarily provide to us when you use our service, including:</p>
            <ul>
              <li>Wallet addresses when you connect your wallet</li>
              <li>Transaction data visible on the blockchain</li>
              <li>Information you provide in communications with us</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Analyze your portfolio and provide insights</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns and trends</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal
              information. However, please be aware that no method of transmission over the Internet or electronic
              storage is 100% secure.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services that collect, monitor, and analyze data to improve our service. These
              third parties have access to your personal information only to perform these tasks on our behalf.
            </p>

            <h2>Blockchain Data</h2>
            <p>
              Please note that blockchain data, including wallet addresses and transactions, are publicly visible on the
              blockchain. Our service analyzes this public data to provide insights.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@sertt.ch">privacy@sertt.ch</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
