import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft, RefreshCw, CreditCard, Shield } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function PaymentFailedPage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorReason, setErrorReason] = useState('');

  const isCandidatePayment = window.location.pathname.includes('/candidate/payment/');

  const { applicationId } = useParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      setErrorReason(getErrorMessage(error));
    } else if (errorDescription) {
      setErrorReason(errorDescription);
    }
  }, []);

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'card_declined': 'Your card was declined. Please try a different payment method.',
      'expired_card': 'Your card has expired. Please use a different card.',
      'insufficient_funds': 'Insufficient funds. Please check your account balance.',
      'incorrect_cvc': 'The security code is incorrect. Please check and try again.',
      'processing_error': 'An error occurred while processing your payment.',
      'authentication_required': 'Additional authentication is required for this payment.'
    };

    return errorMessages[errorCode] || 'Your payment could not be processed. Please try again.';
  };

  const handleGoBack = () => {
    if (isCandidatePayment) {
      window.location.href = '/dashboard/service';
    } else {
      window.location.href = '/sponsorship-license-application';
    }
  };

  // const handleRetryPayment = () => {
  //   setIsRetrying(true);
  //   // Simulate retry delay
  //   setTimeout(() => {
  //     setIsRetrying(false);
  //     // In a real app, redirect to checkout or restart payment flow
  //     handleGoBack();
  //   }, 2000);
  // };

  const handleContactSupport = () => {
    window.location.href = 'mailto:Divyank@softhire.co.uk?subject=Payment Issue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          {/* Header with animated gradient */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-1">
            <div className="bg-white m-1 rounded-xl p-8 text-center">
              {/* Error Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Payment Failed
              </h1>

              {/* Error Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {errorReason || 'We encountered an issue processing your payment. Don\'t worry, no charges were made to your account.'}
              </p>

              {/* Payment Security Badge */}
              <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700 font-medium">
                  Secured by Stripe
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-3">
            {/* Retry Payment Button */}
            {/* <button
              // onClick={handleRetryPayment}
              // disabled={isRetrying}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Try Payment Again
                </>
              )}
            </button> */}

            {/* Go Back Button */}
            <button
              onClick={handleGoBack}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl border-2 border-red-200 hover:border-pink-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              Go Back to Checkout
            </button>

            {/* Contact Support */}
            <button
              onClick={handleContactSupport}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-6 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Common solutions:
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Check your card details and try again</p>
            <p>• Ensure you have sufficient funds</p>
            <p>• Try a different payment method</p>
            <p>• Contact your bank if the issue persists</p>
          </div>
        </div>

        {/* Stripe Branding */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Payments processed securely by{' '}
            <span className="font-semibold text-indigo-600">Stripe</span>
          </p>
        </div>
      </div>
    </div>
  );
}