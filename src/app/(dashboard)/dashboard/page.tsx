"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Star,
  ArrowRight,
  Plus,
  Settings,
  BarChart3,
  Video,
  CheckCircle2,
  XCircle,
  Loader2,
  Target,
  Award,
  Zap,
} from "lucide-react";

interface Stats {
  totalBookings?: number;
  upcomingBookings?: number;
  completedSessions?: number;
  hoursLearned?: number;
  totalSessions?: number;
  totalAttendees?: number;
  upcomingSessions?: number;
  averageRating?: number;
}

interface UpcomingSession {
  _id: string;
  title: string;
  sessionDate: string;
  duration: number;
  host?: { name: string };
  category: string;
  status: string;
}

interface RecentActivity {
  id: string;
  type: "booking" | "cancellation" | "completion" | "review";
  title: string;
  description: string;
  timestamp: string;
  icon: "check" | "x" | "star";
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats>({});
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user's bookings
      const bookingsRes = await fetch("/api/bookings/my-bookings");
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const bookings = bookingsData.bookings || [];

        // Calculate stats for attendees
        const upcoming = bookings.filter((b: any) => b.category === "upcoming");
        const completed = bookings.filter((b: any) => b.category === "past" && b.attended);

        const totalHours = completed.reduce(
          (sum: number, b: any) => sum + (b.session?.duration || 0),
          0
        );

        setStats({
          totalBookings: bookings.length,
          upcomingBookings: upcoming.length,
          completedSessions: completed.length,
          hoursLearned: Math.round(totalHours / 60),
        });

        // Set upcoming sessions
        setUpcomingSessions(
          upcoming.slice(0, 4).map((b: any) => ({
            _id: b._id,
            title: b.session.title,
            sessionDate: b.session.sessionDate,
            duration: b.session.duration,
            host: b.session.host,
            category: b.session.category,
            status: b.status,
          }))
        );

        // Generate recent activity from bookings
        const activities: RecentActivity[] = bookings
          .slice(0, 5)
          .map((b: any) => {
            if (b.status === "CANCELLED") {
              return {
                id: b._id,
                type: "cancellation" as const,
                title: `Cancelled: ${b.session.title}`,
                description: b.cancelledAt
                  ? `Cancelled on ${new Date(b.cancelledAt).toLocaleDateString()}`
                  : "Recently cancelled",
                timestamp: b.cancelledAt || b.bookingDate,
                icon: "x" as const,
              };
            }
            if (b.attended) {
              return {
                id: b._id,
                type: "completion" as const,
                title: `Completed: ${b.session.title}`,
                description: `Attended on ${new Date(b.session.sessionDate).toLocaleDateString()}`,
                timestamp: b.session.sessionDate,
                icon: "check" as const,
              };
            }
            return {
              id: b._id,
              type: "booking" as const,
              title: `Booked: ${b.session.title}`,
              description: `Session on ${new Date(b.session.sessionDate).toLocaleDateString()}`,
              timestamp: b.bookingDate,
              icon: "check" as const,
            };
          });

        setRecentActivity(activities);
      }

      // For hosts, fetch session stats
      if (session?.user?.userType === "HOST" || session?.user?.userType === "BOTH") {
        // TODO: Fetch host sessions and stats
        // This would come from /api/host/sessions endpoint
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;
  const isHost = user.userType === "HOST" || user.userType === "BOTH";
  const isAttendee = user.userType === "ATTENDEE" || user.userType === "BOTH";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 0 ? "Just now" : `${hours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.name?.split(" ")[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Link href="/profile">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {isAttendee && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Upcoming
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.upcomingBookings || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Sessions booked
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completed
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.completedSessions || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Sessions attended
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Hours Learned
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.hoursLearned || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Time invested
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBookings || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  All bookings
                </p>
              </div>
            </>
          )}

          {isHost && !isAttendee && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Sessions
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSessions || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Sessions hosted
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Attendees
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalAttendees || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  People reached
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Rating
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.averageRating?.toFixed(1) || "—"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Out of 5.0
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Upcoming
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.upcomingSessions || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Scheduled
                </p>
              </div>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {isHost && (
                  <Link href="/host/sessions/new">
                    <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                          <Plus className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Create Session</h3>
                      <p className="text-sm text-blue-50">
                        Share your expertise with others
                      </p>
                    </div>
                  </Link>
                )}

                <Link href="/sessions">
                  <div className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 transition-colors">
                        <BookOpen className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Browse Sessions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Discover upcoming learning opportunities
                    </p>
                  </div>
                </Link>

                <Link href="/bookings">
                  <div className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 transition-colors">
                        <Calendar className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      My Bookings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      View your registered sessions
                    </p>
                  </div>
                </Link>

                {isHost && (
                  <Link href="/host/analytics">
                    <div className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 transition-colors">
                          <BarChart3 className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Analytics
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Track your session performance
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Sessions
                  </h2>
                  <Link
                    href="/bookings"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <Link key={session._id} href={`/bookings/${session._id}`}>
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded">
                                {session.category}
                              </span>
                              <span className="px-2 py-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs font-medium rounded">
                                Confirmed
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {session.title}
                            </h3>
                            {session.host && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                with {session.host.name}
                              </p>
                            )}
                          </div>
                          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(session.sessionDate)} at{" "}
                              {formatTime(session.sessionDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {upcomingSessions.length === 0 && (
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No upcoming sessions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Browse our catalog to find sessions that interest you
                </p>
                <Link href="/sessions">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Explore Sessions
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Account Type
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.userType === "HOST"
                      ? "Host"
                      : user.userType === "ATTENDEE"
                      ? "Attendee"
                      : "Host & Attendee"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Subscription
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {user.subscriptionTier || "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Verification
                  </span>
                  {user.isVerified ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0"
                    >
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          activity.icon === "check"
                            ? "bg-green-50 dark:bg-green-950/30"
                            : activity.icon === "star"
                            ? "bg-yellow-50 dark:bg-yellow-950/30"
                            : "bg-red-50 dark:bg-red-950/30"
                        }`}
                      >
                        {activity.icon === "check" && (
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              activity.icon === "check"
                                ? "text-green-600 dark:text-green-400"
                                : ""
                            }`}
                          />
                        )}
                        {activity.icon === "x" && (
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        {activity.icon === "star" && (
                          <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {getRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full mb-3">
                    <Award className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No recent activity yet
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Start exploring sessions!
                  </p>
                </div>
              )}
            </div>

            {/* Achievement Badge */}
            {stats.completedSessions && stats.completedSessions >= 5 && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                      Learning Streak
                    </h3>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      You're on fire! 🔥
                    </p>
                  </div>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You've completed {stats.completedSessions} sessions. Keep up the great
                  work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
