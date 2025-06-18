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

export const PricingDetails = [
  {
    name: "Basic Plan",
    // description: "Best for Startups",
    price: "£1200",
    features: ["Sponsorship license "],
    popular: true,
  },
  {
    name: "Standard Plan",
    // description: "Best for Growing Businesses",
    price: "£1650",
    features: [
      "Sponsorship licence",
      "Access to Recruitment Portal",
      "CoS assignment-upto 5",
      "Visa assistance for recruits",
      "On-going Sponsorship Compliance for upto 10 Employees",
    ],
    popular: true,
  },
  {
    name: "Premium Plan",
    // description: "Best for Startups",
    price: "£2200",
    features: [
      "Sponsorship licence ",
      "Access to Recruitment Portal",
      "Upto 20 CoS assignment",
      "Visa assistance for recruits",
      "On-going Sponsorship Compliance for unlimited Employees",
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
        name: "Sponsor licence assistance",
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
