import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              The Marketplace for
              <br />
              <span className="text-blue-200">Expert Sessions</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with coaches, consultants, and educators for free and paid workshops.
              Share your expertise or learn from the best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/sessions">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Browse Sessions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Talklify?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to host or attend expert sessions in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Session Creation</h3>
              <p className="text-gray-600">
                Create and manage both free and paid sessions with just a few clicks
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Your Audience</h3>
              <p className="text-gray-600">
                Grow your following and connect with learners worldwide
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Payments</h3>
              <p className="text-gray-600">
                Secure payment processing with automatic payouts to hosts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h3>
                <p className="text-gray-600">
                  Sign up in seconds and choose whether you want to host, attend, or both
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create or Browse</h3>
                <p className="text-gray-600">
                  Host your own sessions or discover expert-led workshops
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Learn</h3>
                <p className="text-gray-600">
                  Join sessions, learn from experts, and grow your skills
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of experts and learners on Talklify
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Talklify</h3>
              <p className="text-sm">
                The marketplace for expert sessions and live workshops
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sessions" className="hover:text-white">Browse Sessions</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2025 Talklify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
