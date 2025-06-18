const timeZoneOptions = [
    // UTC Negative Offsets
    'UTC-12:00 — International Date Line West',
    'UTC-11:00 — Niue Time',
    'UTC-10:00 — Hawaii Time',
    'UTC-09:00 — Alaska Time',
    'UTC-08:00 — Pacific Time',
    'UTC-07:00 — Mountain Time',
    'UTC-06:00 — Central Time',
    'UTC-05:00 — Eastern Time',
    'UTC-04:00 — Atlantic Time',
    'UTC-03:00 — Greenland Time',
    'UTC-02:00 — Brasilia Summer Time',
    'UTC-01:00 — Azores Time',

    // UTC 0
    'UTC+00:00 — Coordinated Universal Time',

    // Europe, Middle East & Africa
    'UTC+01:00 — Central European Time',
    'UTC+02:00 — Eastern European Time',
    'UTC+03:00 — Turkey Time',
    'UTC+04:00 — Dubai Time',

    // Asia & Oceania
    'UTC+05:00 — Maldives Time',
    'UTC+06:00 — Astana Time',
    'UTC+07:00 — Indochina Time',
    'UTC+08:00 — China Standard Time',
    'UTC+09:00 — Japan Standard Time',
    'UTC+10:00 — Brisbane Time',
    'UTC+11:00 — Vladivostok Time',
    'UTC+12:00 — Auckland, Wellington Time',
    'UTC+13:00 — Samoa Time'
  ];


  const positions = [
    'Full-time employee',
    'Part-time employee',
    'Contractor',
    'Intern',
    'Freelancer',
    'Cofounder'
  ];

  const currencyOptions = [
    'United States Dollar ($)',
    'Euro (€)',
    'British Pound Sterling (£)',
    'Canadian Dollar (CA$)',
    'Australian Dollar (AU$)',
    'Japanese Yen (¥)',
    'Chinese Yuan Renminbi (¥)',
    'Indian Rupee (₹)',
    'Swiss Franc (CHF)',
    'Swedish Krona (kr)',
    'New Zealand Dollar (NZ$)',
    'Mexican Peso (MX$)',
    'Singapore Dollar (S$)',
    'Hong Kong Dollar (HK$)',
    'Norwegian Krone (kr)',
    'South Korean Won (₩)',
    'Turkish Lira (₺)',
    'Russian Ruble (₽)',
    'Brazilian Real (R$)',
    'South African Rand (R)',
    'UAE Dirham (د.إ)',
    'Saudi Riyal (ر.س)',
    'Danish Krone (kr)',
    'Polish Zloty (zł)',
    'Thai Baht (฿)',
    'Indonesian Rupiah (Rp)',
    'Malaysian Ringgit (RM)',
    'Philippine Peso (₱)',
    'Czech Koruna (Kč)',
    'Hungarian Forint (Ft)',
    'Israeli New Shekel (₪)',
    'Chilean Peso (CLP$)',
    'Pakistani Rupee (₨)',
    'Egyptian Pound (E£)',
    'Bangladeshi Taka (৳)',
    'Nigerian Naira (₦)',
    'Vietnamese Dong (₫)',
    'Colombian Peso (COL$)',
    'Argentine Peso (AR$)',
    'Kuwaiti Dinar (د.ك)',
    'Qatari Riyal (ر.ق)',
    'Omani Rial (ر.ع.)'
  ];


  const roles = [
    // IT & Technical Roles
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Cloud Engineer',
    'Security Engineer',
    'Site Reliability Engineer',
    'Mobile App Developer',
    'QA Engineer',
    'Data Scientist',
    'Data Engineer',
    'Machine Learning Engineer',
    'AI Engineer',
    'Blockchain Developer',
    'Embedded Systems Engineer',
    'Network Administrator',
    'Systems Administrator',
    'Database Administrator',
    'IT Support Specialist',
    'IT Consultant',
    'Technical Project Manager',
    'Solutions Architect',
    'Cloud Solutions Architect',
    'Scrum Master',
    'Technical Lead',

    // IT Management Roles
    'IT Manager',
    'IT Director',
    'Chief Technology Officer (CTO)',
    'Chief Information Officer (CIO)',
    'Technical Program Manager',
    'Engineering Manager',
    'Infrastructure Manager',
    'Information Security Manager',
    'Product Manager (Tech)',
    'Project Manager (Tech)',
    'Delivery Manager',
    'IT Operations Manager',
    'DevOps Manager',
    'Systems Manager',

    // Sales Roles
    'Sales Development Representative (SDR)',
    'Business Development Representative (BDR)',
    'Account Executive',
    'Account Manager',
    'Customer Success Manager',
    'Sales Engineer',
    'Pre-Sales Consultant',
    'Sales Manager',
    'Partnerships Manager',
    'Channel Sales Manager',
    'Territory Sales Manager',
    'Key Account Manager',
    'Enterprise Sales Manager',
    'Sales Director',
    'Chief Revenue Officer (CRO)',
    'Inside Sales Representative',
    'Outside Sales Representative',
    'Client Relationship Manager',

    // Industry/Operations & Manufacturing Roles
    'Operations Manager',
    'Plant Manager',
    'Production Manager',
    'Manufacturing Engineer',
    'Quality Assurance Manager',
    'Maintenance Engineer',
    'Industrial Engineer',
    'Process Engineer',
    'Logistics Manager',
    'Supply Chain Manager',
    'Inventory Manager',
    'Procurement Manager',
    'Warehouse Manager',
    'Facilities Manager',
    'Lean Manufacturing Specialist',
    'Six Sigma Consultant',
    'Production Planner',
    'Operations Analyst',
    'Project Manager (Industrial)',
    'Mechanical Engineer (Industrial)',
    'Electrical Engineer (Industrial)',
    'Automation Engineer',
    'Health and Safety Manager'
  ];

  const experienceOptions = [
    "0+ years",
    "1+ years",
    "2+ years",
    "3+ years",
    "4+ years",
    "5+ years",
    "6+ years",
    "7+ years",
    "8+ years",
    "9+ years",
    "10+ years",
  ];

  const skillOptions = [
    // Programming Languages & Frameworks
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Ruby', 'PHP',
    'Node.js', 'Express.js', 'React.js', 'Angular', 'Vue.js', 'Next.js', 'NestJS',
    'Spring Boot', 'Django', 'Flask', 'ASP.NET',

    // Databases
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Mongoose', 'Oracle DB', 'SQLite',
    'Redis', 'Cassandra', 'Elasticsearch',

    // DevOps & Cloud
    'Git', 'Github', 'GitLab', 'Bitbucket', 'Docker', 'Kubernetes', 'Terraform',
    'Jenkins', 'CI/CD', 'Ansible', 'AWS', 'Azure', 'Google Cloud Platform (GCP)',
    'Vercel', 'Netlify', 'Nginx', 'Linux', 'Bash/Shell Scripting',

    // APIs & Testing
    'REST API', 'GraphQL', 'Postman', 'Swagger', 'Jest', 'Mocha', 'Chai', 'Cypress',
    'Selenium', 'Puppeteer', 'Playwright',

    // Real-time & WebSockets
    'Socket.io', 'WebSockets', 'RabbitMQ', 'Kafka',

    // Frontend & UI
    'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'Material UI', 'Redux',
    'Zustand', 'React Query', 'Storybook',

    // Project & Product Management
    'Agile Methodology', 'Scrum', 'Kanban', 'JIRA', 'Trello', 'Asana', 'ClickUp',
    'Notion', 'Confluence', 'MS Project', 'Monday.com', 'Figma', 'Miro',

    // Sales & CRM Tools
    'Salesforce', 'HubSpot', 'Zoho CRM', 'Pipedrive', 'Outreach.io', 'Apollo.io',
    'LinkedIn Sales Navigator', 'Slack', 'Gong.io', 'Chorus.ai', 'Google Analytics',

    // Business & Data Tools
    'Excel', 'Google Sheets', 'Looker', 'Tableau', 'Power BI', 'Metabase',
    'Mixpanel', 'Hotjar', 'Segment', 'Amplitude',

    // Industrial & Operations
    'AutoCAD', 'SolidWorks', 'MATLAB', 'SCADA', 'PLC Programming',
    'SAP', 'Oracle ERP', 'Tally', 'Primavera', 'MS Dynamics',
    'Lean Six Sigma', 'Kaizen', '5S', 'Value Stream Mapping',

    // Soft Skills / Misc
    'Problem Solving', 'Communication', 'Leadership', 'Team Management',
    'Time Management', 'Critical Thinking', 'Presentation Skills'
  ];

  const companySizeOptions = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5000+',
    '',
    '',
    '',
    '',
    '',
  ]

  export { timeZoneOptions, positions, currencyOptions, roles, experienceOptions, skillOptions, companySizeOptions };