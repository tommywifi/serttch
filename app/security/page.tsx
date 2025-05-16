export default function SecurityPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Security</h1>
            <div className="h-px w-16 bg-black mx-auto my-6"></div>
            <p className="text-lg text-gray-600">How we protect your data and ensure the security of our platform</p>
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Our Security Approach</h2>
            <p>
              At Serttch, security is a top priority. We implement industry-standard security measures to protect your
              data and ensure the integrity of our platform.
            </p>

            <h2>Wallet Connection Security</h2>
            <p>
              When you connect your wallet to Serttch, we use secure methods to interact with your wallet. We never
              store your private keys or seed phrases. All wallet connections are made through secure, encrypted
              channels.
            </p>

            <h2>Data Protection</h2>
            <p>Our security measures include:</p>
            <ul>
              <li>End-to-end encryption for all data transmissions</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure infrastructure with multiple layers of protection</li>
              <li>Strict access controls for our internal systems</li>
            </ul>

            <h2>Privacy-Focused Features</h2>
            <p>
              We're committed to enhancing privacy in the blockchain space. Our planned Monero-based anonymization
              features will provide additional privacy protections for our users.
            </p>

            <h2>Security Best Practices</h2>
            <p>We recommend the following security best practices for our users:</p>
            <ul>
              <li>Use hardware wallets when possible</li>
              <li>Enable two-factor authentication for all your crypto accounts</li>
              <li>Regularly update your devices and software</li>
              <li>Be cautious of phishing attempts and only use official links</li>
            </ul>

            <h2>Vulnerability Disclosure</h2>
            <p>
              If you discover a security vulnerability in our platform, please report it to us at{" "}
              <a href="mailto:security@sertt.ch">security@sertt.ch</a>. We have a responsible disclosure policy and will
              work with you to address any valid concerns.
            </p>

            <h2>Continuous Improvement</h2>
            <p>
              We continuously monitor and improve our security measures to adapt to evolving threats and protect our
              users' data and assets.
            </p>

            <h2>Contact Us</h2>
            <p>
              For any security-related questions or concerns, please contact our security team at{" "}
              <a href="mailto:security@sertt.ch">security@sertt.ch</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
