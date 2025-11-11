"use client";

import Link from "next/link";
import { FileText, Calendar, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-6">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Legal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Terms of Service
              </h1>

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
                    "Agreement to Terms",
                    "User Accounts",
                    "Session Hosting",
                    "Session Attendance",
                    "Payments and Fees",
                    "Intellectual Property",
                    "User Content",
                    "Prohibited Activities",
                    "Termination",
                    "Disclaimers",
                    "Limitation of Liability",
                    "Governing Law",
                    "Changes to Terms",
                    "Contact Information",
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
                      <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                        Important Information
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-0">
                        Please read these Terms of Service carefully before using Talklify. By accessing or using our
                        platform, you agree to be bound by these terms. If you disagree with any part of these terms,
                        you may not access the service.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 1 */}
                <section id="section-1" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    1. Agreement to Terms
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      These Terms of Service ("Terms") constitute a legally binding agreement between you and
                      Talklify ("Company," "we," "us," or "our") concerning your access to and use of the Talklify
                      platform, including our website, mobile applications, and related services (collectively, the
                      "Service").
                    </p>
                    <p>
                      By registering for an account, accessing, or using the Service, you acknowledge that you have
                      read, understood, and agree to be bound by these Terms and our Privacy Policy. If you are using
                      the Service on behalf of an organization, you represent and warrant that you have the authority
                      to bind that organization to these Terms.
                    </p>
                    <p>
                      You must be at least 18 years old to use the Service. By using the Service, you represent and
                      warrant that you meet this age requirement.
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="section-2" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. User Accounts</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      To access certain features of the Service, you must create an account. When creating an
                      account, you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and promptly update your account information</li>
                      <li>Maintain the security of your password and account</li>
                      <li>Accept all responsibility for activities under your account</li>
                      <li>Immediately notify us of any unauthorized use of your account</li>
                    </ul>
                    <p>
                      You are responsible for all activities that occur under your account. We reserve the right to
                      suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or
                      illegal activity.
                    </p>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="section-3" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Session Hosting</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>If you choose to host sessions on Talklify ("Host"), you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide accurate session descriptions, including topics, duration, and requirements</li>
                      <li>Honor all scheduled sessions or provide reasonable notice of cancellation</li>
                      <li>Deliver content that matches your session description</li>
                      <li>Conduct sessions in a professional and respectful manner</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Not share content that infringes on intellectual property rights</li>
                      <li>Maintain appropriate certifications if offering professional advice</li>
                    </ul>
                    <p>
                      Hosts are independent contractors, not employees of Talklify. You are solely responsible for
                      the content and quality of your sessions, compliance with tax obligations, and any professional
                      licensing requirements.
                    </p>
                    <p>
                      We reserve the right to remove sessions or suspend Host accounts that violate these Terms,
                      receive consistent negative feedback, or engage in fraudulent activity.
                    </p>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="section-4" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    4. Session Attendance
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>If you attend sessions on Talklify ("Attendee"), you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Register for sessions you genuinely intend to attend</li>
                      <li>Respect the Host's intellectual property and session materials</li>
                      <li>Participate respectfully and professionally</li>
                      <li>Not record, share, or redistribute session content without permission</li>
                      <li>Provide honest feedback about sessions</li>
                      <li>Honor cancellation policies for paid sessions</li>
                    </ul>
                    <p>
                      We reserve the right to remove Attendees from sessions or suspend accounts for disruptive
                      behavior, violation of session rules, or abuse of the platform.
                    </p>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="section-5" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    5. Payments and Fees
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>For Attendees:</strong> When you register for a paid session, you authorize us to
                      charge your payment method. All fees are non-refundable unless otherwise stated in the Host's
                      cancellation policy or required by law.
                    </p>
                    <p>
                      <strong>For Hosts:</strong> Talklify charges a platform fee on paid sessions. The current fee
                      structure is available in your dashboard. We use Stripe or other payment processors to handle
                      transactions. Payouts are processed according to our standard schedule.
                    </p>
                    <p>You are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All applicable taxes related to your use of the Service</li>
                      <li>Providing accurate payment information</li>
                      <li>Maintaining sufficient funds or credit for transactions</li>
                      <li>Any fees charged by your payment provider or financial institution</li>
                    </ul>
                    <p>
                      We reserve the right to modify our fee structure with 30 days' notice. Continued use of the
                      Service after fee changes constitutes acceptance of the new fees.
                    </p>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="section-6" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    6. Intellectual Property
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      The Service, including its original content, features, and functionality, is owned by Talklify
                      and is protected by international copyright, trademark, patent, trade secret, and other
                      intellectual property laws.
                    </p>
                    <p>
                      Hosts retain ownership of their session content and materials. By hosting sessions on Talklify,
                      you grant us a limited license to display, distribute, and promote your content on the
                      platform.
                    </p>
                    <p>You may not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Copy, modify, or distribute our intellectual property without permission</li>
                      <li>Reverse engineer or attempt to extract source code from the Service</li>
                      <li>Use our trademarks, logos, or branding without authorization</li>
                      <li>Remove or alter any copyright or proprietary notices</li>
                    </ul>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="section-7" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. User Content</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      You retain ownership of content you submit to the Service ("User Content"). By submitting User
                      Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce,
                      modify, and distribute it in connection with operating the Service.
                    </p>
                    <p>You represent and warrant that your User Content:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Does not violate any third-party rights, including intellectual property rights</li>
                      <li>Complies with all applicable laws and regulations</li>
                      <li>Does not contain viruses, malware, or harmful code</li>
                      <li>Is not fraudulent, deceptive, or misleading</li>
                      <li>Does not harass, threaten, or harm others</li>
                    </ul>
                    <p>
                      We reserve the right to remove User Content that violates these Terms or is otherwise
                      objectionable, at our sole discretion.
                    </p>
                  </div>
                </section>

                {/* Section 8 */}
                <section id="section-8" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    8. Prohibited Activities
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Use the Service for any illegal purpose or in violation of any laws</li>
                      <li>Impersonate any person or entity or misrepresent your affiliation</li>
                      <li>Engage in fraudulent activities or scams</li>
                      <li>Harass, abuse, or harm other users</li>
                      <li>Spam, phish, or distribute unsolicited communications</li>
                      <li>Interfere with or disrupt the Service or servers</li>
                      <li>Attempt to gain unauthorized access to the Service</li>
                      <li>Use automated systems (bots, scrapers) without permission</li>
                      <li>Collect user data without consent</li>
                      <li>Circumvent security measures or access restrictions</li>
                      <li>Use the Service to compete with or undermine Talklify</li>
                    </ul>
                  </div>
                </section>

                {/* Section 9 */}
                <section id="section-9" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Termination</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      We reserve the right to suspend or terminate your account and access to the Service at any
                      time, with or without cause, with or without notice. Grounds for termination include, but are
                      not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Violation of these Terms</li>
                      <li>Fraudulent or illegal activity</li>
                      <li>Abuse of the platform or other users</li>
                      <li>Non-payment of fees</li>
                      <li>Extended inactivity</li>
                    </ul>
                    <p>
                      Upon termination, your right to use the Service will immediately cease. You may terminate your
                      account at any time through your account settings or by contacting support.
                    </p>
                    <p>
                      Sections of these Terms that by their nature should survive termination will survive,
                      including intellectual property provisions, disclaimers, and limitations of liability.
                    </p>
                  </div>
                </section>

                {/* Section 10 */}
                <section id="section-10" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Disclaimers</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="uppercase font-semibold">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
                      EXPRESS OR IMPLIED.
                    </p>
                    <p>
                      We do not warrant that the Service will be uninterrupted, secure, or error-free. We make no
                      warranties about the accuracy, reliability, or quality of content provided by Hosts.
                    </p>
                    <p>
                      Hosts are independent contractors, not employees or agents of Talklify. We do not verify Host
                      credentials, expertise, or qualifications. We are not responsible for the quality, accuracy, or
                      legality of sessions or Host content.
                    </p>
                    <p>
                      You use the Service at your own risk. We disclaim all warranties, including implied warranties
                      of merchantability, fitness for a particular purpose, and non-infringement.
                    </p>
                  </div>
                </section>

                {/* Section 11 */}
                <section id="section-11" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    11. Limitation of Liability
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="uppercase font-semibold">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, TALKLIFY SHALL NOT BE LIABLE FOR ANY INDIRECT,
                      INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
                    </p>
                    <p>
                      Our total liability to you for all claims arising from or relating to the Service shall not
                      exceed the amount you paid us in the twelve (12) months preceding the claim, or $100,
                      whichever is greater.
                    </p>
                    <p>This limitation applies to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Errors, mistakes, or inaccuracies of content</li>
                      <li>Personal injury or property damage resulting from your use of the Service</li>
                      <li>Unauthorized access to or use of our servers or user data</li>
                      <li>Interruption or cessation of service</li>
                      <li>Bugs, viruses, or harmful code transmitted through the Service</li>
                      <li>Loss of content, data, or information</li>
                    </ul>
                  </div>
                </section>

                {/* Section 12 */}
                <section id="section-12" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Governing Law</h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of [Your
                      Jurisdiction], without regard to its conflict of law provisions.
                    </p>
                    <p>
                      Any disputes arising from these Terms or your use of the Service shall be resolved through
                      binding arbitration in accordance with the rules of [Arbitration Organization], except that you
                      may assert claims in small claims court if they qualify.
                    </p>
                    <p>
                      You waive any right to a jury trial or to participate in a class action lawsuit or
                      class-wide arbitration.
                    </p>
                  </div>
                </section>

                {/* Section 13 */}
                <section id="section-13" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    13. Changes to Terms
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      We reserve the right to modify these Terms at any time. When we make material changes, we will
                      notify you by email or through a notice on the Service at least 30 days before the changes
                      take effect.
                    </p>
                    <p>
                      Your continued use of the Service after changes become effective constitutes acceptance of the
                      modified Terms. If you do not agree to the changes, you must stop using the Service and close
                      your account.
                    </p>
                    <p>
                      We will update the "Last updated" date at the top of this page when we make changes. We
                      encourage you to review these Terms periodically.
                    </p>
                  </div>
                </section>

                {/* Section 14 */}
                <section id="section-14" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    14. Contact Information
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>If you have questions about these Terms, please contact us:</p>
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-2">
                      <p className="mb-0">
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:legal@talklify.com"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          legal@talklify.com
                        </a>
                      </p>
                      <p className="mb-0">
                        <strong>Support:</strong>{" "}
                        <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Contact Support
                        </Link>
                      </p>
                    </div>
                  </div>
                </section>

                {/* Additional Information */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Additional Legal Documents
                  </h3>
                  <div className="space-y-2">
                    <p className="mb-0">
                      <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      - How we collect, use, and protect your data
                    </p>
                    <p className="mb-0">
                      <Link href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Cookie Policy
                      </Link>{" "}
                      - How we use cookies and similar technologies
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
