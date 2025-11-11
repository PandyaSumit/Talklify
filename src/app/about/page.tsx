"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Target,
  Heart,
  Lightbulb,
  Globe,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";

// Core values data
const values = [
  {
    icon: Heart,
    title: "Human-First",
    description:
      "We believe in the power of human connection. Every feature we build prioritizes meaningful interactions between learners and experts.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Creating a safe, secure environment where both hosts and attendees can engage confidently is our top priority.",
  },
  {
    icon: Lightbulb,
    title: "Accessible Learning",
    description:
      "Knowledge should be accessible to everyone. We make it easy for anyone to learn from experts, regardless of background or budget.",
  },
  {
    icon: Rocket,
    title: "Empower Experts",
    description:
      "We provide tools and support for experts to share their knowledge, build their audience, and monetize their expertise.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "We're building a worldwide community of learners and teachers, breaking down geographical barriers to education.",
  },
  {
    icon: Zap,
    title: "Continuous Innovation",
    description:
      "We constantly evolve our platform based on user feedback, staying ahead of the curve in online learning technology.",
  },
];

// Impact metrics
const impactMetrics = [
  {
    number: "1,000+",
    label: "Sessions Hosted",
    description: "Across 50+ topics and industries",
  },
  {
    number: "500+",
    label: "Expert Hosts",
    description: "From leading companies worldwide",
  },
  {
    number: "50K+",
    label: "Learners",
    description: "Growing community of curious minds",
  },
  {
    number: "95%",
    label: "Satisfaction Rate",
    description: "Positive feedback from attendees",
  },
];

// Team roles (placeholder - can be replaced with actual team data)
const teamRoles = [
  {
    role: "Product & Engineering",
    description: "Building scalable, user-friendly technology that connects learners and experts seamlessly.",
    icon: Zap,
  },
  {
    role: "Community & Support",
    description: "Ensuring every user has an exceptional experience and fostering meaningful connections.",
    icon: Users,
  },
  {
    role: "Host Success",
    description: "Empowering experts with tools, resources, and guidance to create impactful sessions.",
    icon: Award,
  },
  {
    role: "Growth & Partnerships",
    description: "Expanding our reach to bring quality learning opportunities to more people worldwide.",
    icon: TrendingUp,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.015),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
            <div className="max-w-4xl mx-auto text-center">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-8">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">About Talklify</span>
              </div>

              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
                <span className="block text-gray-900 dark:text-white leading-tight mb-2">
                  Democratizing Access
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight">
                  to Expert Knowledge
                </span>
              </h1>

              {/* Mission statement */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                We're building a marketplace where anyone can learn from experts through live, interactive
                sessions—and where experts can share their knowledge while building meaningful connections.
              </p>

              {/* Key stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
                <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Countries</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sessions</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Remote</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">2024</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                How Talklify came to be
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="text-lg">
                  The idea for Talklify was born from a simple observation: incredible expertise exists everywhere,
                  but connecting learners with the right experts remained unnecessarily difficult.
                </p>

                <p>
                  Traditional education platforms were either too rigid, too expensive, or lacked the human
                  connection that makes learning truly transformative. We saw professionals with deep expertise
                  wanting to share their knowledge but struggling to find their audience. At the same time, curious
                  learners were eager to learn directly from practitioners but had limited options.
                </p>

                <p>
                  We built Talklify to solve both problems. A platform where experts can easily host live sessions,
                  set their own terms, and build genuine relationships with their audience. Where learners can
                  discover sessions on any topic, interact in real-time, and get their questions answered by people
                  who've actually done the work.
                </p>

                <p>
                  Today, Talklify powers thousands of sessions across dozens of categories—from technical skills to
                  creative pursuits, from career development to personal growth. Every session represents a
                  connection made, knowledge shared, and a step forward in someone's learning journey.
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 sm:p-8 my-8">
                  <p className="text-gray-900 dark:text-white font-medium text-lg mb-2">Our Mission</p>
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-0">
                    To make expert knowledge accessible to everyone by creating a trusted marketplace where learning
                    is interactive, personal, and transformative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Building a global community of learners and experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {impactMetrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
                  {metric.number}
                </div>
                <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {metric.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 mb-6">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Vision</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Where We're Headed
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Making Learning More Personal
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We're building features that make sessions more interactive and personalized—from AI-powered
                  session recommendations to enhanced collaboration tools that bring learners and experts closer
                  together.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Empowering More Experts
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We're investing in tools that help experts grow their audience, understand their impact, and
                  monetize their expertise more effectively—from advanced analytics to marketing support.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Expanding Global Access
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We're breaking down language and time zone barriers, making it easier for learners and experts
                  from different parts of the world to connect and learn from each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Passionate individuals working together to democratize learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {teamRoles.map((team, index) => {
              const Icon = team.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{team.role}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{team.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              We're always looking for talented people to join our mission.
            </p>
            <Link href="/careers">
              <Button size="lg" variant="outline" className="px-8">
                View Open Positions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Whether you're here to learn or share your expertise, Talklify is the place to connect, grow, and make
            an impact.
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
            <Link href="/host/sessions/new">
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
    </div>
  );
}
