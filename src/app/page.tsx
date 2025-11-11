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

export default function HomePage() {
  const router = useRouter();
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section - Redesigned with light, airy aesthetic */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.06),transparent_50%)]" />

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
                  Connect with experts in live sessions, workshops, and
                  masterclasses.
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
                      1,000
                      <span className="text-blue-600 dark:text-blue-400">
                        +
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Live Sessions
                    </div>
                  </div>

                  <div className="text-center group cursor-default">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      500
                      <span className="text-blue-600 dark:text-blue-400">
                        +
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Expert Hosts
                    </div>
                  </div>

                  <div className="text-center group cursor-default">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      50
                      <span className="text-blue-600 dark:text-blue-400">
                        K+
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Attendees
                    </div>
                  </div>

                  <div className="text-center group cursor-default">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      200
                      <span className="text-blue-600 dark:text-blue-400">
                        +
                      </span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            {/* Upcoming Free Sessions */}
            {homepageData?.upcomingFree &&
              homepageData.upcomingFree.length > 0 && (
                <SessionCarousel
                  sessions={homepageData.upcomingFree}
                  title="Upcoming Free Sessions"
                  subtitle="Join these free sessions happening in the next 7 days"
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              )}

            {/* Featured Sessions */}
            {homepageData?.featured && homepageData.featured.length > 0 && (
              <div className="relative">
                <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  ⭐ FEATURED
                </div>
                <SessionCarousel
                  sessions={homepageData.featured}
                  title="Featured Sessions"
                  subtitle="Promoted sessions from top hosts"
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              </div>
            )}

            {/* Browse by Category */}
            {homepageData?.categoryCounts &&
              homepageData.categoryCounts.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Browse by Category
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Explore sessions across different topics
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {homepageData.categoryCounts.map(({ category, count }) => {
                      const Icon = categoryIcons[category] || Users;
                      return (
                        <Link
                          key={category}
                          href={`/sessions/search?categories=${category}`}
                        >
                          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 dark:hover:border-blue-400">
                            <CardContent className="p-6 text-center">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {category}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {count} sessions
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-8 text-center">
                    <Link href="/sessions/search">
                      <Button size="lg" variant="outline">
                        View All Sessions
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

            {/* Popular Paid Masterclasses */}
            {homepageData?.popularPaid &&
              homepageData.popularPaid.length > 0 && (
                <SessionCarousel
                  sessions={homepageData.popularPaid}
                  title="Popular Paid Masterclasses"
                  subtitle="Most attended premium sessions"
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              )}

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to share your expertise?
              </h2>
              <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
                Join hundreds of hosts who are building their audience and
                earning through Talklify
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/host/sessions/create">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                  >
                    Create Your First Session
                  </Button>
                </Link>
                <Link href="/sessions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Or Browse Sessions
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
