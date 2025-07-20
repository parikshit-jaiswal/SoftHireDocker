import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Save,
  AlertCircle,
  Award,
  Calendar,
  Mail
} from 'lucide-react';
import { getCandidatePaymentStatus, redirectToCandidateCheckout } from '@/Api/StripeServices';
import { toast } from 'react-toastify';

const Service = () => {
  const [cosRefNumber, setCosRefNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [candidateData, setCandidateData] = useState(null);

  const SERVICE_CONFIG = {
    priceId: "price_1RlrLk2acj2EAQET4AKnrkWF",
    plan: "Standard Service Plan"
  };

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      const data = await getCandidatePaymentStatus();
      if (data.success) {
        setCandidateData(data);
        setPaymentStatus(data.paymentStatus?.toLowerCase() || 'unpaid');
        if (data.cosRefNumber) setCosRefNumber(data.cosRefNumber);
      } else {
        setPaymentStatus('unpaid');
      }
    } catch (error) {
      setPaymentStatus('unpaid');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cosRefNumber.trim()) {
      setError('CoS reference number is required');
      toast.error('Please enter your CoS reference number');
      return;
    }

    // ✅ Store loading toast ID for better management
    let loadingToast;
    
    try {
      setLoading(true);
      setError('');

      // ✅ Show loading toast
      loadingToast = toast.loading('Processing payment...');

      await redirectToCandidateCheckout(cosRefNumber.trim(), SERVICE_CONFIG.priceId);
      
      // ✅ This shouldn't be reached as redirect happens
      toast.dismiss(loadingToast);

    } catch (error) {
      console.error('Payment error:', error);
      
      // ✅ Dismiss loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      
      // ✅ FIXED: Handle specific error cases with proper toasts
      if (error.message.includes('Payment already completed')) {
        toast.success('Payment already completed!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Force refresh payment status
        setTimeout(() => {
          checkPaymentStatus();
        }, 1000);
        
      } else if (error.message.includes('Invalid price configuration')) {
        toast.error('⚠️ Payment configuration error. Please contact support.', {
          position: "top-right",
          autoClose: 5000,
        });
        setError('Payment configuration error. Please contact support.');
        
      } else if (error.message.includes('Candidate profile not found')) {
        toast.error('❌ Profile not found. Please complete your profile first.', {
          position: "top-right",
          autoClose: 5000,
        });
        setError('Profile not found. Please complete your profile first.');
        
      } else if (error.message.includes('Network error')) {
        toast.error('🌐 Network error. Please check your connection and try again.', {
          position: "top-right",
          autoClose: 5000,
        });
        setError('Network error. Please check your connection and try again.');
        
      } else {
        toast.error(`❌ ${error.message || 'Payment failed. Please try again.'}`, {
          position: "top-right",
          autoClose: 5000,
        });
        setError(error.message || "Payment failed. Please try again.");
      }
      
    } finally {
      // ✅ FIXED: Always reset loading state in finally block
      setLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setCosRefNumber(value);
    if (error) {
      setError('');
    }
  };

  // ✅ Loading state
  if (paymentStatus === 'loading') {
    return (
      <div className="max-w-2xl mx-auto mt-8 pt-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking payment status...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Payment completed screen
  if (paymentStatus === 'paid') {
    return (
      <div className="max-w-2xl mx-auto mt-8 pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Completed!</h1>
          <p className="text-lg text-gray-600">
            Your service application has been successfully processed
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-green-900">Service Activated</h2>
          </div>
          
          <div className="space-y-3 text-green-800">
            <div className="flex items-center gap-2">
              <span className="font-medium">Service Plan:</span>
              <span>{SERVICE_CONFIG.plan}</span>
            </div>
            
            {candidateData?.cosRefNumber && (
              <div className="flex items-center gap-2">
                <span className="font-medium">CoS Reference:</span>
                <span className="font-mono bg-green-100 px-2 py-1 rounded text-sm">
                  {candidateData.cosRefNumber}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Payment Status:</span>
              <span className="bg-green-100 px-2 py-1 rounded text-sm font-medium">
                ✅ Paid
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            What happens next?
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Your application is now being processed by our team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>You will receive email updates on your application status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Processing typically takes 5-10 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>You can track your application status in your dashboard</span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Need Help?
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            If you have any questions about your application, feel free to contact our support team.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  // ✅ Payment pending screen
  // if (paymentStatus === 'pending') {
  //   return (
  //     <div className="max-w-2xl mx-auto mt-8 pt-8">
  //       <div className="text-center mb-8">
  //         <div className="flex items-center justify-center mb-4">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
  //         </div>
  //         <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Pending</h1>
  //         <p className="text-lg text-gray-600">
  //           Your payment is currently being processed
  //         </p>
  //       </div>

  //       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-6">
  //         <div className="flex items-center gap-3 mb-4">
  //           <AlertCircle className="h-6 w-6 text-yellow-600" />
  //           <h2 className="text-xl font-semibold text-yellow-900">Payment Processing</h2>
  //         </div>
          
  //         <div className="space-y-3 text-yellow-800">
  //           {candidateData?.cosRefNumber && (
  //             <div className="flex items-center gap-2">
  //               <span className="font-medium">CoS Reference:</span>
  //               <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-sm">
  //                 {candidateData.cosRefNumber}
  //               </span>
  //             </div>
  //           )}
            
  //           <div className="flex items-center gap-2">
  //             <span className="font-medium">Payment Status:</span>
  //             <span className="bg-yellow-100 px-2 py-1 rounded text-sm font-medium">
  //               ⏳ Pending
  //             </span>
  //           </div>
  //         </div>
          
  //         <p className="text-yellow-700 text-sm mt-4">
  //           Your payment is being processed. This usually takes a few minutes. 
  //           Please refresh the page or check back later.
  //         </p>
  //       </div>

  //       <div className="text-center">
  //         <button
  //           onClick={async () => {
  //             const loadingToast = toast.loading('Checking payment status...');
  //             await checkPaymentStatus();
  //             toast.dismiss(loadingToast);
  //             toast.info('Payment status updated!');
  //           }}
  //           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
  //         >
  //           Check Payment Status
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // ✅ For all other statuses (including 'pending'), show the payment form
  return (
    <div className="max-w-2xl mx-auto mt-8 pt-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Application</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Enter your CoS reference number and proceed to payment to complete the application process.
        </p>
      </div>

      {/* Info Message */}
      <div className="bg-blue-100 text-blue-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
        Enter your CoS reference number and complete payment to submit your application.
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-red-100 text-red-800 rounded-xl px-6 py-4 mb-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError('')} 
              className="text-red-600 hover:text-red-800 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Service Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-3">
              CoS Reference Number
            </label>
            <input
              type="text"
              value={cosRefNumber}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your CoS reference number"
              className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            <p className="text-gray-500 text-sm mt-2">
              Enter the CoS reference number you received via email or mail
            </p>
          </div>

          {/* Payment Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Required</h3>
            <p className="text-blue-800 text-sm mb-2">
              Service Plan: <span className="font-medium">{SERVICE_CONFIG.plan}</span>
            </p>
            <p className="text-blue-700 text-xs">
              You will be redirected to secure payment after submitting your CoS reference number.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !cosRefNumber.trim()}
              className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing payment...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Submit & Pay</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• You'll be redirected to secure payment processing</li>
          <li>• After successful payment, your service will be activated</li>
          <li>• You will receive an email confirmation</li>
          <li>• Further instructions will be sent to your email</li>
        </ul>
      </div>
    </div>
  );
};

export default Service;