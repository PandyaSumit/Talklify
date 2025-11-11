"use client";

import Link from "next/link";
import { Shield, Calendar, AlertCircle, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-6">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Privacy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Privacy Policy
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal
                information.
              </p>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Last updated: January 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Table of Contents - Sticky */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Table of Contents
                </h2>
                <nav className="space-y-2">
                  {[
                    "Information We Collect",
                    "How We Use Your Information",
                    "How We Share Your Information",
                    "Data Security",
                    "Data Retention",
                    "Your Privacy Rights",
                    "Cookies and Tracking",
                    "Third-Party Services",
                    "Children's Privacy",
                    "International Data Transfers",
                    "Changes to This Policy",
                    "Contact Us",
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={`#section-${index + 1}`}
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {index + 1}. {item}
                    </a>
                  ))}
                </nav>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    We use industry-standard encryption to protect your data.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {/* Introduction */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">Your Privacy Matters</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-0">
                        At Talklify, we are committed to protecting your privacy and handling your data transparently.
                        This Privacy Policy explains what information we collect, how we use it, and your rights
                        regarding your personal data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 1 */}
                <section id="section-1" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    1. Information We Collect
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Information You Provide
                    </h3>
                    <p>When you use Talklify, you may provide us with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Account Information:</strong> Name, email address, password, profile picture, and
                        bio
                      </li>
                      <li>
                        <strong>Profile Information:</strong> Professional background, expertise, interests, and
                        social media links
                      </li>
                      <li>
                        <strong>Payment Information:</strong> Billing address and payment method details (processed
                        securely through Stripe)
                      </li>
                      <li>
                        <strong>Session Information:</strong> Session descriptions, topics, pricing, schedules, and
                        materials
                      </li>
                      <li>
                        <strong>Communications:</strong> Messages, reviews, ratings, and feedback you provide
                      </li>
                      <li>
                        <strong>Support Requests:</strong> Information you provide when contacting customer support
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Information We Collect Automatically
                    </h3>
                    <p>When you use our Service, we automatically collect:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Usage Data:</strong> Pages viewed, features used, session attendance, search queries,
                        and interaction patterns
                      </li>
                      <li>
                        <strong>Device Information:</strong> IP address, browser type, operating system, device
                        identifiers, and mobile network information
                      </li>
                      <li>
                        <strong>Location Data:</strong> General geographic location based on IP address
                      </li>
                      <li>
                        <strong>Cookies and Similar Technologies:</strong> Information collected through cookies, web
                        beacons, and similar technologies (see Section 7)
                      </li>
                      <li>
                        <strong>Performance Data:</strong> Error reports, diagnostic data, and performance metrics
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Information from Third Parties
                    </h3>
                    <p>We may receive information about you from:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Social media platforms if you choose to connect your accounts</li>
                      <li>Payment processors regarding transaction status</li>
                      <li>Analytics providers and advertising partners</li>
                      <li>Other users who invite you or mention you</li>
                    </ul>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="section-2" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    2. How We Use Your Information
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>We use your information to:</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Provide and Improve the Service
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Create and manage your account</li>
                      <li>Process session registrations and payments</li>
                      <li>Facilitate communication between Hosts and Attendees</li>
                      <li>Send session reminders and updates</li>
                      <li>Provide customer support</li>
                      <li>Improve and optimize the platform</li>
                      <li>Develop new features and services</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Personalization and Recommendations
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Recommend sessions based on your interests</li>
                      <li>Customize your experience on the platform</li>
                      <li>Show relevant content and advertisements</li>
                      <li>Analyze usage patterns to improve recommendations</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Communication
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Send transactional emails (confirmations, receipts, updates)</li>
                      <li>Send marketing communications (with your consent)</li>
                      <li>Notify you about platform updates and new features</li>
                      <li>Respond to your inquiries and support requests</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Safety and Security
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Detect and prevent fraud, abuse, and security threats</li>
                      <li>Verify identities and authenticate users</li>
                      <li>Enforce our Terms of Service</li>
                      <li>Protect the rights and safety of users</li>
                      <li>Comply with legal obligations</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Analytics and Research
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Analyze usage trends and patterns</li>
                      <li>Conduct market research</li>
                      <li>Measure the effectiveness of marketing campaigns</li>
                      <li>Generate aggregated, anonymized statistics</li>
                    </ul>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="section-3" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    3. How We Share Your Information
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>We may share your information with:</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Other Users</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Your public profile is visible to other users</li>
                      <li>Hosts can see Attendee names for their sessions</li>
                      <li>Attendees can see Host profiles and session information</li>
                      <li>Reviews and ratings you leave are publicly visible</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Service Providers
                    </h3>
                    <p>We work with third-party companies to provide essential services:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Payment Processing:</strong> Stripe for secure payment processing
                      </li>
                      <li>
                        <strong>Cloud Hosting:</strong> AWS, Google Cloud, or similar providers
                      </li>
                      <li>
                        <strong>Email Services:</strong> For transactional and marketing emails
                      </li>
                      <li>
                        <strong>Analytics:</strong> Google Analytics, Mixpanel, or similar tools
                      </li>
                      <li>
                        <strong>Customer Support:</strong> Help desk and ticketing systems
                      </li>
                      <li>
                        <strong>Video Conferencing:</strong> Zoom, Google Meet, or similar platforms
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Legal Requirements
                    </h3>
                    <p>We may disclose your information when required by law or to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Comply with legal obligations, court orders, or legal processes</li>
                      <li>Enforce our Terms of Service</li>
                      <li>Protect the rights, property, and safety of Talklify and our users</li>
                      <li>Investigate fraud, security issues, or technical problems</li>
                      <li>Respond to government or regulatory requests</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Business Transfers
                    </h3>
                    <p>
                      If Talklify is involved in a merger, acquisition, or sale of assets, your information may be
                      transferred. We will notify you before your information becomes subject to a different privacy
                      policy.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      With Your Consent
                    </h3>
                    <p>We may share your information for other purposes with your explicit consent.</p>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="section-4" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Security</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>We implement industry-standard security measures to protect your information:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Encryption:</strong> Data is encrypted in transit (TLS/SSL) and at rest
                      </li>
                      <li>
                        <strong>Access Controls:</strong> Strict access controls limit who can view your data
                      </li>
                      <li>
                        <strong>Secure Infrastructure:</strong> Servers hosted in secure data centers
                      </li>
                      <li>
                        <strong>Regular Audits:</strong> Security assessments and vulnerability testing
                      </li>
                      <li>
                        <strong>Employee Training:</strong> Staff trained on data protection best practices
                      </li>
                      <li>
                        <strong>Incident Response:</strong> Procedures to detect and respond to security incidents
                      </li>
                    </ul>
                    <p>
                      However, no method of transmission over the internet is 100% secure. While we strive to protect
                      your information, we cannot guarantee absolute security.
                    </p>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="section-5" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Retention</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>We retain your information for as long as necessary to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide the Service to you</li>
                      <li>Comply with legal obligations</li>
                      <li>Resolve disputes</li>
                      <li>Enforce our agreements</li>
                    </ul>
                    <p>Specific retention periods:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Account Data:</strong> Retained while your account is active and for a reasonable
                        period after closure
                      </li>
                      <li>
                        <strong>Transaction Records:</strong> Retained for 7 years for tax and legal compliance
                      </li>
                      <li>
                        <strong>Usage Data:</strong> Aggregated data may be retained indefinitely for analytics
                      </li>
                      <li>
                        <strong>Communications:</strong> Support tickets retained for 3 years
                      </li>
                    </ul>
                    <p>
                      You can request deletion of your account and data at any time. Some information may be retained
                      as required by law or for legitimate business purposes.
                    </p>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="section-6" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Privacy Rights</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>Depending on your location, you may have the following rights:</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Access and Portability</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Request a copy of your personal data</li>
                      <li>Download your data in a structured, machine-readable format</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Correction</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Update inaccurate or incomplete information</li>
                      <li>Modify your profile and account settings</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Deletion</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Request deletion of your account and personal data</li>
                      <li>Delete specific content you've created</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Objection and Restriction
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Object to processing of your data for certain purposes</li>
                      <li>Request restriction of processing in certain circumstances</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Marketing</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Opt out of marketing emails at any time</li>
                      <li>Manage communication preferences in your account settings</li>
                    </ul>

                    <p>To exercise these rights, contact us at privacy@talklify.com or through your account settings.</p>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="section-7" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    7. Cookies and Tracking Technologies
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>We use cookies and similar technologies to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Keep you logged in</li>
                      <li>Remember your preferences</li>
                      <li>Understand how you use the Service</li>
                      <li>Improve platform performance</li>
                      <li>Deliver personalized content and ads</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Types of Cookies</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Essential Cookies:</strong> Required for the Service to function
                      </li>
                      <li>
                        <strong>Performance Cookies:</strong> Help us understand usage and improve the platform
                      </li>
                      <li>
                        <strong>Functionality Cookies:</strong> Remember your preferences and settings
                      </li>
                      <li>
                        <strong>Advertising Cookies:</strong> Deliver relevant ads and measure campaign effectiveness
                      </li>
                    </ul>

                    <p>
                      You can control cookies through your browser settings. Note that disabling cookies may affect
                      platform functionality.
                    </p>

                    <p>
                      For more details, see our{" "}
                      <Link href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Cookie Policy
                      </Link>
                      .
                    </p>
                  </div>
                </section>

                {/* Section 8 */}
                <section id="section-8" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    8. Third-Party Services
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      Our Service may contain links to third-party websites and integrate with third-party services.
                      We are not responsible for the privacy practices of these third parties.
                    </p>
                    <p>Third-party services we integrate with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Payment processors (Stripe)</li>
                      <li>Social media platforms</li>
                      <li>Video conferencing tools</li>
                      <li>Analytics providers</li>
                      <li>Email service providers</li>
                    </ul>
                    <p>
                      We encourage you to review the privacy policies of any third-party services you interact with
                      through Talklify.
                    </p>
                  </div>
                </section>

                {/* Section 9 */}
                <section id="section-9" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Children's Privacy</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      Talklify is not intended for users under 18 years of age. We do not knowingly collect personal
                      information from children under 18.
                    </p>
                    <p>
                      If we learn that we have collected information from a child under 18, we will delete that
                      information immediately. If you believe we have collected information from a child, please
                      contact us at privacy@talklify.com.
                    </p>
                  </div>
                </section>

                {/* Section 10 */}
                <section id="section-10" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    10. International Data Transfers
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      Talklify operates globally. Your information may be transferred to and processed in countries
                      other than your own, including the United States.
                    </p>
                    <p>
                      We ensure appropriate safeguards are in place when transferring data internationally, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Standard contractual clauses approved by regulatory authorities</li>
                      <li>Data processing agreements with service providers</li>
                      <li>Compliance with applicable data protection laws</li>
                    </ul>
                    <p>
                      By using Talklify, you consent to the transfer of your information to countries that may have
                      different data protection laws than your country of residence.
                    </p>
                  </div>
                </section>

                {/* Section 11 */}
                <section id="section-11" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    11. Changes to This Policy
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      We may update this Privacy Policy from time to time to reflect changes in our practices,
                      technology, legal requirements, or other factors.
                    </p>
                    <p>
                      When we make material changes, we will notify you by email or through a prominent notice on the
                      Service at least 30 days before the changes take effect.
                    </p>
                    <p>
                      We will update the "Last updated" date at the top of this page. We encourage you to review this
                      Privacy Policy periodically to stay informed about how we protect your information.
                    </p>
                    <p>
                      Your continued use of the Service after changes become effective constitutes acceptance of the
                      updated Privacy Policy.
                    </p>
                  </div>
                </section>

                {/* Section 12 */}
                <section id="section-12" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Contact Us</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      If you have questions, concerns, or requests regarding this Privacy Policy or our data
                      practices, please contact us:
                    </p>
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-3">
                      <p className="mb-0">
                        <strong>Data Protection Officer:</strong>{" "}
                        <a
                          href="mailto:privacy@talklify.com"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          privacy@talklify.com
                        </a>
                      </p>
                      <p className="mb-0">
                        <strong>General Inquiries:</strong>{" "}
                        <a
                          href="mailto:support@talklify.com"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          support@talklify.com
                        </a>
                      </p>
                      <p className="mb-0">
                        <strong>Support Center:</strong>{" "}
                        <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Contact Support
                        </Link>
                      </p>
                    </div>
                    <p>
                      We will respond to your request within 30 days. If you are not satisfied with our response, you
                      may have the right to lodge a complaint with your local data protection authority.
                    </p>
                  </div>
                </section>

                {/* Additional Information */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Related Legal Documents
                  </h3>
                  <div className="space-y-2">
                    <p className="mb-0">
                      <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      - Rules and guidelines for using Talklify
                    </p>
                    <p className="mb-0">
                      <Link href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Cookie Policy
                      </Link>{" "}
                      - Detailed information about cookies and tracking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
