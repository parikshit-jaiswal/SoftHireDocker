const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripe");
const { authenticate, authorizeRecruiter } = require("../middleware/authMiddleware");

// Create Checkout Session
router.post("/create-checkout-session", authenticate, authorizeRecruiter , stripeController.createSponsorshipCheckoutSession);

// Stripe Webhook (must use raw body)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeController.handleWebhook
);
router.post(
  "/candidate/create-checkout-session",
  authenticate,
  stripeController.createCandidateCheckoutSession);
//   router.post(
//   "/candidate/webhook",
//   express.raw({ type: "application/json" }),
//   stripeController.candidateWebhook
// );

// ✅ Candidate payment status route
router.get(
  "/candidate/payment-status",
  authenticate,
  stripeController.getCandidatePaymentStatus
);

module.exports = router;
