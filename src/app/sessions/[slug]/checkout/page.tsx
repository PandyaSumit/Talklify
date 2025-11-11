"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, CreditCard, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Session {
  _id: string;
  title: string;
  slug: string;
  description: string;
  sessionDate: string;
  duration: number;
  price: number;
  currency: string;
  host: {
    name: string;
    profileImage?: string;
  };
  category: string;
}

interface CheckoutFormProps {
  sessionData: Session;
  clientSecret: string;
  paymentIntentId: string;
}

function CheckoutForm({ sessionData, clientSecret, paymentIntentId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Confirm payment with Stripe
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    // Payment succeeded, create booking on our server
    try {
      const response = await fetch("/api/bookings/complete-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          sessionId: sessionData._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete booking");
      }

      // Success! Redirect to booking confirmation
      router.push(`/bookings/${data.booking._id}?success=true`);
    } catch (err: any) {
      setError(err.message || "Failed to complete booking");
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Details
          </h3>
        </div>
        <PaymentElement />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
              Payment Failed
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        size="lg"
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            Pay {formatCurrency(sessionData.price, sessionData.currency)}
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <CheckCircle2 className="w-4 h-4" />
        <span>Secured by Stripe • Your payment information is encrypted</span>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/signin?callbackUrl=/sessions/${params.slug}/checkout`);
      return;
    }

    if (status === "authenticated") {
      initializeCheckout();
    }
  }, [status, params.slug]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch session details
      const sessionResponse = await fetch(`/api/sessions/slug/${params.slug}`);
      if (!sessionResponse.ok) {
        throw new Error("Session not found");
      }
      const sessionResult = await sessionResponse.json();
      const session = sessionResult.session;

      setSessionData(session);

      // Create payment intent
      const checkoutResponse = await fetch(
        `/api/sessions/${session._id}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || "Failed to initialize checkout");
      }

      const checkoutData = await checkoutResponse.json();
      setClientSecret(checkoutData.clientSecret);
      setPaymentIntentId(checkoutData.paymentIntentId);
    } catch (err: any) {
      console.error("Checkout initialization error:", err);
      setError(err.message || "Failed to initialize checkout");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData || !clientSecret) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Checkout
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Something went wrong. Please try again."}
          </p>
          <Button onClick={() => router.push(`/sessions/${params.slug}`)}>
            Return to Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You're one step away from joining this session
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Session Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Session Summary
              </h2>

              {/* Session Title */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {sessionData.title}
                </h3>
                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                  {sessionData.category}
                </span>
              </div>

              {/* Session Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(sessionData.sessionDate)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(sessionData.sessionDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm text-gray-900 dark:text-white">
                    {sessionData.duration} minutes
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm text-gray-900 dark:text-white">
                    Hosted by {sessionData.host.name}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Session Price</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(sessionData.price, sessionData.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    Included
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200 dark:border-slate-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(sessionData.price, sessionData.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Cancellation Policy
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Full refund if cancelled more than 48 hours before the session</li>
                <li>• 50% refund if cancelled 24-48 hours before the session</li>
                <li>• No refund if cancelled less than 24 hours before the session</li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#2563eb",
                  },
                },
              }}
            >
              <CheckoutForm
                sessionData={sessionData}
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId!}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
