export const plans = [
  {
    name: "Basic Plan",
    description: "Best for Startups",
    price: "$10",
    per: "per month",
    popular: false,
  },
  {
    name: "Standard Plan",
    description: "Best for Growing Businesses",
    price: "$20",
    per: "per month",
    popular: true,
  },
  {
    name: "Premium Plan",
    description: "Best for Enterprises",
    price: "$40",
    per: "per month",
    popular: false,
  },
];

export const SubscriptionDetails = [
  {
    name: "Starter",
    description: "Stay compliant with minimal spend",
    price: "£120/month",
    features: [
      "Compliance Dashboard + alerts for up to 5 CoS",
      "Manual CoS creation & right-to-work checklist",
      "1 Level-1 user",
      "Email support"
    ],
    popular: true,
  },
  {
    name: "Growth",
    description: "Save time with automation & shared visibility",
    price: "£300/month",
    features: [
      "Compliance Dashboard + alerts for up to 10 CoS",
      "Automated Reporting",
      "CoS assignment-upto 5",
      "Document storage (2 GB) with expiry reminders",
      "Up to 3 Level-1 users",
      "Same Day Support"
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Zero-friction compliance; API-first extensibility",
    price: "Custom",
    features: [
      "Real-time, event-triggered automation",
      "HRIS integration",
      "Unlimited users & granular roles (auditor, adviser)",
      "Advanced analytics & API access",
    ],
  },
];
export const SingleTimeServices = [
  {
    name: "Sponsor-license application",
    // description: "Stay compliant with minimal spend",
    price: "£1399",
    features: [
      "Sponsor license application fee",
      "Home Office application fee",
    ],
    popular: false,
  },
  {
    name: "Skilled Worker visa application",
    // description: "Save time with automation & shared visibility",
    price: "£350",
    features: [

    ],
    popular: false,
  },
  {
    name: "Dependant visa application",
    // description: "Zero-friction compliance; API-first extensibility",
    price: "£300",
    features: [

    ],
  },
];

export const features = [
  {
    category: "Sponsor License",
    items: [
      {
        name: "First visa included",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        name: "Sponsor license assistance",
        basic: true,
        standard: true,
        premium: true,
      },
    ],
  },
  {
    category: "Recruitment",
    items: [
      {
        name: "Screen and Filter Candidates",
        basic: false,
        standard: true,
        premium: true,
      },
      {
        name: "Acccess 150k+ Candidates",
        basic: false,
        standard: true,
        premium: true,
      },
    ],
  },
  {
    category: "Compliance",
    items: [
      {
        name: "Sponsor upto 3 migrant workers",
        basic: false,
        standard: true,
        premium: true,
      },
      {
        name: "Customized Training sessions",
        basic: false,
        standard: false,
        premium: true,
      },
    ],
  },
  {
    category: "Immigration",
    items: [
      {
        name: "Visa processing Assistance",
        basic: false,
        standard: true,
        premium: true,
      },
      {
        name: "Priority visa processing",
        basic: false,
        standard: false,
        premium: true,
      },
    ],
  },
];

export const faqs = [
  {
    id: 1,
    question: "What is a Payment Gateway?",
    answer:
      "A payment gateway is a technology that captures and transfers payment data from the customer to the acquirer and then transfers the payment acceptance or decline back to the customer.",
  },
  {
    id: 2,
    question:
      "Do I need to pay to Instapay even when there is no transaction going on in my business?",
    answer:
      "No, you do not need to pay Instapay where there is no transaction happening. With one of the lowest transaction charges in the industry, pay only when you get paid!",
  },
  {
    id: 3,
    question: "What platforms does ACME payment gateway support?",
    answer:
      "ACME payment gateway supports various platforms including websites, mobile apps, and e-commerce platforms like Shopify, WooCommerce, and Magento.",
  },
  {
    id: 4,
    question: "Does ACME provide international payments support?",
    answer:
      "Yes, ACME supports international payments across multiple currencies with competitive exchange rates and simplified cross-border transaction processing.",
  },
  {
    id: 5,
    question:
      "Is there any setup fee or annual maintainance fee that I need to pay regularly?",
    answer:
      "No, there are no setup fees or annual maintenance fees. You only pay per successful transaction, making it cost-effective for businesses of all sizes.",
  },
];
