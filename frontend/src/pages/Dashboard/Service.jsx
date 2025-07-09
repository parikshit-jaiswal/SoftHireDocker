import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Save,
  AlertCircle
} from 'lucide-react';
import { redirectToCandidateCheckout } from '@/Api/StripeServices';

const Service = () => {
  const [serviceNumber, setServiceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Service configuration
  const SERVICE_CONFIG = {
    priceId: "price_1Rg8DR2acj2EAQETDTVMknsF",
    plan: "Standard Service Plan"
  };

  // ✅ SIMPLIFIED: No need for complex state management
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!serviceNumber.trim()) {
      setError('Service number is required');
      return;
    }

    // ✅ SUPER SIMPLE: Just call with service number and price ID
    redirectToCandidateCheckout(serviceNumber, SERVICE_CONFIG.priceId);
    console.log("🚀 Submitting service number:", serviceNumber);
  };

  const handleInputChange = (value) => {
    setServiceNumber(value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 pt-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Application</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Enter your COS number and proceed to payment to complete the application process.
        </p>
      </div>

      {/* Info Message */}
      <div className="bg-blue-100 text-blue-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
        Enter your COS number and complete payment to submit your application.
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
              COS Number (CoS Reference)
            </label>
            <input
              type="text"
              value={serviceNumber}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your service number"
              className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            <p className="text-gray-500 text-sm mt-2">
              Enter the COS number you received via email or mail
            </p>
          </div>

          {/* Payment Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Required</h3>
            <p className="text-blue-800 text-sm mb-2">
              Service Plan: <span className="font-medium">{SERVICE_CONFIG.plan}</span>
            </p>
            <p className="text-blue-700 text-xs">
              You will be redirected to secure payment after submitting your COS number.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !serviceNumber.trim()}
              className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
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