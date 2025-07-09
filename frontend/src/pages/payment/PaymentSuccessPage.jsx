import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Mail, ArrowRight, Gift, Star, Home } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  // if path has /candidate/payment/:applicationId/success

  const isCandidatePayment = window.location.pathname.includes('/candidate/payment/');

  const { applicationId } = useParams();

  useEffect(() => {
    if (!isCandidatePayment) {
      setOrderDetails({
        applicationId: applicationId || 'pi_' + Math.random().toString(36).substr(2, 9),
        amount: '1399',
        currency: 'gbp',
        product: 'Sponcer License Application',
        date: new Date().toLocaleDateString()
      });
    } else {
      setOrderDetails({
        applicationId: applicationId || 'pi_' + Math.random().toString(36).substr(2, 9),
        amount: '350',
        currency: 'gbp',
        date: new Date().toLocaleDateString()
      });
    }
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const formatAmount = (amount, currency) => {
    const value = parseInt(amount || 0);
    const currencyCode = (currency || 'usd').toUpperCase();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(value);
  };

  const handleGoHome = () => {
    if (isCandidatePayment) {
      window.location.href = '/dashboard/service';
    } else {
      window.location.href = '/sponsorship-license-application';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div
                className={`w-2 h-2 ${['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
                  } rounded-full`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-md w-full mt-10">
        {/* Main Success Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          {/* Header with animated gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1">
            <div className="bg-white m-1 rounded-xl p-8 text-center">
              {/* Success Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Payment Successful!
              </h1>

              {/* Success Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Thank you for your purchase! Your payment has been processed successfully and you'll receive a confirmation email shortly.
              </p>

              {/* Celebration Badge */}
              <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <Gift className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800 font-medium">
                  Application Submitted Successfully!
                </span>
                <Star className="w-4 h-4 text-yellow-600 animate-spin" />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              {/* <div className="flex justify-between">
                    <span className="text-gray-600">Application ID:</span>
                    <span className="font-mono text-gray-900">#{orderDetails.applicationId?.substring(3, 12)}</span>
              </div> */}
              {orderDetails.product && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="text-gray-900">{orderDetails.product}</span>
                </div>)}
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatAmount(orderDetails.amount, orderDetails.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900">{orderDetails.date}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-3 mt-[-2rem]">
            {/* Back to Home - Primary Action */}
            <button
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go Back
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              {/* <button
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="text-sm">Receipt</span>
              </button> */}

              {/* <button
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h4 className="font-semibold text-gray-900 mb-2">What's Next?</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Check your email for the confirmation receipt</p>
            <p>• Access your premium features immediately</p>
            <p>• Contact support if you have any questions</p>
          </div>
        </div>

        {/* Stripe Branding */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Payment processed securely by{' '}
            <span className="font-semibold text-indigo-600">Stripe</span>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-4 flex justify-center gap-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}