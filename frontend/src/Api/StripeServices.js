import { loadStripe } from "@stripe/stripe-js";
import API from "./api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Existing function for recruiter sponsorship applications
export const redirectToCheckout = async (applicationId, priceId) => {
    try {
        const stripe = await stripePromise;

        if (!applicationId || !priceId) {
            alert("Missing applicationId or priceId");
            return;
        }

        const response = await API.post(
            "/stripe/create-checkout-session",
            { applicationId, priceId },
            { withCredentials: true }
        );

        const { url } = response.data;

        if (url) {
            window.location.href = url;
        } else {
            console.error("❌ Stripe session URL not returned:", response.data);
            alert("Failed to initiate payment session.");
        }
    } catch (err) {
        console.error("❌ Stripe checkout error:", err.response?.data || err.message);
        alert("Something went wrong during checkout.");
    }
};

// ✅ FIXED: Better error handling for candidate checkout
export const redirectToCandidateCheckout = async (cosRefNumber, priceId) => {
    try {
        const stripe = await stripePromise;

        if (!cosRefNumber || !priceId) {
            throw new Error("Missing service number or price ID");
        }

        console.log("🚀 Calling candidate checkout with:", { cosRefNumber, priceId });

        const response = await API.post(
            "/stripe/candidate/create-checkout-session",
            { 
                cosRefNumber,
                priceId 
            },
            { withCredentials: true }
        );

        const { url } = response.data;

        if (url) {
            console.log("✅ Redirecting to Stripe checkout:", url);
            window.location.href = url;
        } else {
            console.error("❌ Stripe session URL not returned:", response.data);
            throw new Error("Failed to initiate payment session.");
        }
    } catch (err) {
        console.error("❌ Candidate Stripe checkout error:", err.response?.data || err.message);
        
        // ✅ FIXED: Better error handling for different HTTP status codes
        if (err.response) {
            // Server responded with error status
            const errorMessage = err.response.data?.error || err.response.data?.message || "Payment failed";
            
            // Handle specific error cases
            if (err.response.status === 400) {
                if (errorMessage.includes("Payment already completed")) {
                    throw new Error("Payment already completed");
                } else if (errorMessage.includes("price")) {
                    throw new Error("Invalid price configuration");
                } else if (errorMessage.includes("Candidate not found")) {
                    throw new Error("Candidate profile not found");
                }
            }
            
            throw new Error(errorMessage);
        } else if (err.request) {
            // Network error
            throw new Error("Network error. Please check your connection and try again.");
        } else {
            // Other error
            throw new Error(err.message || "Something went wrong during checkout.");
        }
    }
};

// ✅ ADDED: Default export with all functions
const stripeService = {
    redirectToCheckout,
    redirectToCandidateCheckout,
    createCandidateCheckoutSession: redirectToCandidateCheckout // ✅ Alias for backwards compatibility
};

export default stripeService;

// ✅ Get candidate payment status
export const getCandidatePaymentStatus = async () => {
  try {
    const response = await API.get("/stripe/candidate/payment-status", { withCredentials: true });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "Failed to fetch payment status"
    );
  }
};
