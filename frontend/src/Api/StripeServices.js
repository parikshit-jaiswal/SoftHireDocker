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
            window.location.href = url; // ✅ redirect to Stripe Checkout
        } else {
            console.error("❌ Stripe session URL not returned:", response.data);
            alert("Failed to initiate payment session.");
        }
    } catch (err) {
        console.error("❌ Stripe checkout error:", err.response?.data || err.message);
        alert("Something went wrong during checkout.");
    }
};

// ✅ UPDATED: Simplified candidate checkout - only needs cosRefNumber and priceId
export const redirectToCandidateCheckout = async (cosRefNumber, priceId) => {
    try {
        const stripe = await stripePromise;

        if (!cosRefNumber || !priceId) {
            alert("Missing service number or price ID");
            return;
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
            window.location.href = url; // ✅ redirect to Stripe Checkout
        } else {
            console.error("❌ Stripe session URL not returned:", response.data);
            alert("Failed to initiate payment session.");
        }
    } catch (err) {
        console.error("❌ Candidate Stripe checkout error:", err.response?.data || err.message);
        alert("Something went wrong during checkout.");
    }
};
