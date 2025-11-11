"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SessionCarousel } from "@/components/sessions/SessionCarousel";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Search,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Briefcase,
  Heart,
  DollarSign,
  Palette,
  Check,
  ChevronDown,
  Star,
  Sparkles,
  Target,
  Calendar,
  Clock,
} from "lucide-react";

interface HomepageData {
  upcomingFree: any[];
  popularPaid: any[];
  featured: any[];
  categoryCounts: { category: string; count: number }[];
}

const categoryIcons: { [key: string]: any } = {
  Tech: BookOpen,
  Design: Palette,
  Business: Briefcase,
  Marketing: TrendingUp,
  Health: Heart,
  Career: Award,
  Finance: DollarSign,
  Other: Users,
};

// Category color associations (subtle, revealed on hover)
const categoryColors: { [key: string]: string } = {
  Tech: "group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20",
  Design: "group-hover:bg-purple-50 dark:group-hover:bg-purple-950/20",
  Business: "group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20",
  Marketing: "group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20",
  Health: "group-hover:bg-rose-50 dark:group-hover:bg-rose-950/20",
  Career: "group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20",
  Finance: "group-hover:bg-green-50 dark:group-hover:bg-green-950/20",
  Other: "group-hover:bg-gray-50 dark:group-hover:bg-gray-950/20",
};

// Testimonials data
const testimonials = [
  {
    quote:
      "The React masterclass helped me land my dream job at a top tech company. The hands-on approach and real-world examples were invaluable.",
    author: "Sarah Chen",
    role: "Frontend Developer",
    session: "Advanced React Patterns",
    rating: 5,
  },
  {
    quote:
      "As a host, Talklify has helped me build a consistent audience and monetize my expertise. The platform handles everything seamlessly.",
    author: "Michael Rodriguez",
    role: "Marketing Consultant",
    session: "Host - 47 sessions",
    rating: 5,
  },
  {
    quote:
      "I love the variety of free sessions. I've learned everything from design principles to business strategy without spending a dime.",
    author: "Emma Thompson",
    role: "Product Designer",
    session: "Multiple free sessions",
    rating: 5,
  },
];

// FAQ data
const faqs = [
  {
    question: "How do I register for a session?",
    answer:
      "Simply browse sessions, click on one that interests you, and click 'Register'. For free sessions, you'll get instant access. For paid sessions, complete the secure payment and receive immediate confirmation with joining instructions.",
  },
  {
    question: "Are free sessions really free? What's the catch?",
    answer:
      "Yes, absolutely free! Many experts offer free sessions to build their audience, showcase their expertise, or give back to the community. There's no catch - just high-quality learning opportunities.",
  },
  {
    question: "How do I become a host?",
    answer:
      "Click 'Become a Host' or 'Create Your First Session' to get started. You'll set up your profile, create your first session with details about topic, pricing, and schedule, and you're ready to go. We handle payments, reminders, and everything technical.",
  },
  {
    question: "What happens if I can't attend a session I registered for?",
    answer:
      "For free sessions, simply don't attend - no penalty. For paid sessions, cancellation policies vary by host. Check the session details for specific policies. Most hosts offer refunds if cancelled 24-48 hours in advance.",
  },
  {
    question: "How do hosts get paid?",
    answer:
      "For paid sessions, we process payments securely and transfer funds to your account after each session. You set your own prices and keep the majority of earnings. Payouts are automatic and reliable.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. We use industry-standard encryption and partner with Stripe for payment processing. We never store your full payment details on our servers. Your security is our top priority.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/sessions/homepage");
      if (response.ok) {
        const data = await response.json();
        setHomepageData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch homepage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/sessions/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBookmark = (sessionId: string) => {
    // TODO: Implement bookmark functionality
    console.log("Bookmark session:", sessionId);
  };

  const handleShare = (sessionId: string) => {
    // TODO: Implement share functionality
    console.log("Share session:", sessionId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section - Light, airy, transformation-focused */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900">
        {/* Very subtle background pattern - barely perceptible */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.015),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Generous top spacing for breathing room */}
          <div className="pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
            {/* Content container with F-pattern flow */}
            <div className="max-w-4xl mx-auto">
              {/* Headline - Transformation focused */}
              <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16 lg:mb-20">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                  <span className="block text-gray-900 dark:text-white leading-tight mb-2 sm:mb-3">
                    Learn Anything
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight">
                    from Anyone
                  </span>
                </h1>

                {/* Subtitle - Specificity after opening possibility */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                  Connect with experts in live sessions, workshops, and masterclasses.
                  <span className="block mt-2 text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                    Your growth journey starts with a simple search.
                  </span>
                </p>
              </div>

              {/* Premium Search Bar - Invitation design */}
              <form onSubmit={handleSearch} className="mb-12 sm:mb-16 lg:mb-20">
                <div className="group relative max-w-3xl mx-auto">
                  {/* Subtle glow effect on focus */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500" />

                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl focus-within:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-slate-700/50 focus-within:border-blue-500/50 dark:focus-within:border-blue-400/50">
                    <div className="flex items-center">
                      {/* Search icon as visual anchor */}
                      <div className="pl-6 sm:pl-8 pr-4 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300">
                        <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      {/* Input field */}
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="What would you like to learn today?"
                        className="flex-1 py-5 sm:py-6 pr-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base sm:text-lg"
                      />

                      {/* Search button - Premium treatment */}
                      <div className="pr-3 sm:pr-4">
                        <Button
                          type="submit"
                          size="lg"
                          className="rounded-xl px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold"
                        >
                          <span className="hidden sm:inline">Explore</span>
                          <span className="sm:hidden">Go</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Ambient Social Proof - Subtle, confident positioning */}
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                    Trusted by thousands
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center group cursor-default">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      1,000<span className="text-blue-600 dark:text-blue-400">+</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Live Sessions
                    </div>
                  </div>

                  <div className="text-center group cursor-default">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      500<span className="text-blue-600 dark:text-blue-400">+</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Expert Hosts
                    </div>
                  </div>

                  <div className="text-center group cursor-default">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      50<span className="text-blue-600 dark:text-blue-400">K+</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Attendees
                    </div>
                  </div>

                  <div className="text-center group cursor-default">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      200<span className="text-blue-600 dark:text-blue-400">+</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Free Sessions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section - NEW */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-slate-900/50 border-y border-gray-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-8">
            Join professionals from leading companies
          </p>
          <div className="flex items-center justify-center gap-8 sm:gap-12 lg:gap-16 flex-wrap">
            {["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"].map((company) => (
              <div
                key={company}
                className="text-xl sm:text-2xl font-semibold text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - NEW */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three simple steps to start your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Browse & Discover
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Search thousands of expert-led sessions on topics you care about. Filter by category,
                  price, and schedule.
                </p>
              </div>
              {/* Connecting line - hidden on mobile */}
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800 -z-10" />
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-2xl sm:text-3xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Reserve Your Spot
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  One-click registration. Secure payment for paid sessions. Instant confirmation with joining
                  instructions.
                </p>
              </div>
              {/* Connecting line - hidden on mobile */}
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800 -z-10" />
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-2xl sm:text-3xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Join & Learn
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Attend live, interact with experts, ask questions in real-time, and gain actionable insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-20 lg:space-y-24">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Upcoming Free Sessions */}
              {homepageData?.upcomingFree && homepageData.upcomingFree.length > 0 && (
                <div>
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      Upcoming Free Sessions
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Start learning today with these free sessions happening in the next 7 days
                    </p>
                  </div>
                  <SessionCarousel
                    sessions={homepageData.upcomingFree}
                    title=""
                    subtitle=""
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                  />
                </div>
              )}

              {/* Featured Sessions */}
              {homepageData?.featured && homepageData.featured.length > 0 && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    ⭐ FEATURED
                  </div>
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      Featured Sessions
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Promoted sessions from top hosts
                    </p>
                  </div>
                  <SessionCarousel
                    sessions={homepageData.featured}
                    title=""
                    subtitle=""
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                  />
                </div>
              )}

              {/* Browse by Category */}
              {homepageData?.categoryCounts && homepageData.categoryCounts.length > 0 && (
                <div className="py-8">
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      Browse by Category
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Explore sessions across different topics and find your passion
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {homepageData.categoryCounts.map(({ category, count }) => {
                      const Icon = categoryIcons[category] || Users;
                      const colorClass = categoryColors[category] || categoryColors.Other;
                      return (
                        <Link key={category} href={`/sessions/search?categories=${category}`}>
                          <div
                            className={`group cursor-pointer transition-all duration-300 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-600 ${colorClass}`}
                          >
                            <div className="p-6 text-center">
                              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{category}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{count} sessions</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-10 text-center">
                    <Link href="/sessions/search">
                      <Button size="lg" variant="outline" className="px-8">
                        View All Sessions
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Popular Paid Masterclasses */}
              {homepageData?.popularPaid && homepageData.popularPaid.length > 0 && (
                <div>
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      Premium Learning Experiences
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Deep-dive sessions with industry experts - invest in your growth
                    </p>
                  </div>
                  <SessionCarousel
                    sessions={homepageData.popularPaid}
                    title=""
                    subtitle=""
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Success Stories / Testimonials - NEW */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Learners Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real stories from our community of learners and hosts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Star rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base sm:text-lg">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Author info */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{testimonial.session}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Hosts Section - NEW */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Benefits */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Share Your Expertise,
                <br />
                Build Your Audience
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join hundreds of experts who are monetizing their knowledge through Talklify
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Reach thousands of eager learners worldwide",
                  "Set your own prices and schedule",
                  "Build lasting audience connections",
                  "Get paid automatically after each session",
                  "Access detailed analytics and insights",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">{benefit}</p>
                  </div>
                ))}
              </div>

              <Link href="/host/sessions/new">
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                >
                  Become a Host
                </Button>
              </Link>
            </div>

            {/* Right side - Visual stats */}
            <div className="lg:pl-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Host Success Metrics
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Average Earning per Session</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">$127</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-3/4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Average Attendees</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">23</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-2/3" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Host Satisfaction Rate</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">4.8★</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-[96%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Redesigned with light aesthetic */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Whether you&apos;re here to learn or teach, Talklify helps you connect with the right people at the
            right time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sessions">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
              >
                Explore Sessions
              </Button>
            </Link>
            <Link href="/host/sessions/create">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 border-2 border-gray-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - NEW */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about Talklify
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed animate-slide-down">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Professional Closure */}
      <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Product */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-3">
                {["Browse Sessions", "Host a Session", "Pricing", "Featured Sessions", "How It Works"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Our Story", "Careers", "Press Kit", "Blog"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Community Guidelines",
                  "Terms of Service",
                  "Privacy Policy",
                  "Cookie Policy",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Connect */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <ul className="space-y-3">
                {["Twitter", "LinkedIn", "Instagram", "Facebook", "Contact Us"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-200 dark:border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Talklify. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 dark:text-gray-500">Secured by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
