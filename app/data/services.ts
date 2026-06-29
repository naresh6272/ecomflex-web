export interface Service {
  id: string
  category: string
  icon: string
  title: string
  description: string
  featured?: boolean
}

export const serviceCategories = [
  'All',
  'Website Development',
  'Custom Software',
  'Business Systems',
  'APIs & Backend',
  'Cloud & DevOps',
  'AI & Automation',
  'Design & Consulting',
]

export const services: Service[] = [
  // ── Website Development ──────────────────────────────
  {
    id: 'website-development',
    category: 'Website Development',
    icon: 'Globe',
    title: 'Website Development',
    description: 'Professional, high-performance websites for businesses of all sizes — from portfolios and landing pages to large corporate platforms.',
    featured: true,
  },
  {
    id: 'ecommerce',
    category: 'Website Development',
    icon: 'ShoppingBag',
    title: 'E-Commerce Stores',
    description: 'Full-featured online stores with product management, cart, checkout, payment gateways, and order tracking.',
    featured: true,
  },
  {
    id: 'web-portals',
    category: 'Website Development',
    icon: 'LayoutDashboard',
    title: 'Web Portals',
    description: 'Customer, employee, and partner portals with secure logins, dashboards, and role-based access to information.',
  },

  // ── Custom Software ───────────────────────────────────
  {
    id: 'custom-web-apps',
    category: 'Custom Software',
    icon: 'Code2',
    title: 'Custom Web Applications',
    description: 'Bespoke web applications built precisely to your business requirements with scalable architecture and clean code.',
    featured: true,
  },
  {
    id: 'saas-platforms',
    category: 'Custom Software',
    icon: 'Cloud',
    title: 'SaaS Platforms',
    description: 'Multi-tenant SaaS products with subscription billing, usage analytics, white-labeling, and API marketplace.',
    featured: true,
  },
  {
    id: 'enterprise-software',
    category: 'Custom Software',
    icon: 'Server',
    title: 'Enterprise Software',
    description: 'Mission-critical enterprise platforms handling complex workflows, multi-department collaboration, and large-scale data.',
  },
  {
    id: 'mobile-apps',
    category: 'Custom Software',
    icon: 'Smartphone',
    title: 'Mobile Applications',
    description: 'Native and cross-platform iOS & Android apps with seamless UX, offline support, and backend integration.',
    featured: true,
  },

  // ── Business Systems ──────────────────────────────────
  {
    id: 'erp',
    category: 'Business Systems',
    icon: 'Network',
    title: 'ERP Systems',
    description: 'Unified enterprise resource planning integrating finance, operations, HR, sales, and supply chain in one platform.',
    featured: true,
  },
  {
    id: 'crm',
    category: 'Business Systems',
    icon: 'PhoneCall',
    title: 'CRM Systems',
    description: 'Customer relationship platforms with pipeline management, interaction history, task automation, and sales forecasting.',
    featured: true,
  },
  {
    id: 'hrms',
    category: 'Business Systems',
    icon: 'Users2',
    title: 'HR & Payroll Systems',
    description: 'Complete HRMS covering recruitment, onboarding, attendance, payroll, performance reviews, and offboarding.',
  },
  {
    id: 'inventory',
    category: 'Business Systems',
    icon: 'Package',
    title: 'Inventory & Billing',
    description: 'Real-time inventory tracking, GST-compliant billing, invoicing, purchase orders, and financial reporting.',
  },
  {
    id: 'booking-systems',
    category: 'Business Systems',
    icon: 'CalendarCheck',
    title: 'Booking & Scheduling',
    description: 'Powerful booking engines for clinics, hotels, salons, and services with automated reminders and payment integration.',
  },

  // ── APIs & Backend ────────────────────────────────────
  {
    id: 'api-development',
    category: 'APIs & Backend',
    icon: 'Plug',
    title: 'API Development',
    description: 'RESTful and GraphQL APIs following OpenAPI standards with versioning, rate limiting, and comprehensive documentation.',
    featured: true,
  },
  {
    id: 'payment-integration',
    category: 'APIs & Backend',
    icon: 'CreditCard',
    title: 'Payment Integration',
    description: 'Seamless payment integration with Razorpay, Stripe, PayPal, Cashfree, and UPI with PCI DSS compliance.',
    featured: true,
  },
  {
    id: 'third-party-integration',
    category: 'APIs & Backend',
    icon: 'GitMerge',
    title: 'Third-Party Integrations',
    description: 'Connect your system to any external service — WhatsApp, SMS, email, maps, logistics, accounting, and more.',
  },

  // ── Cloud & DevOps ────────────────────────────────────
  {
    id: 'cloud-deployment',
    category: 'Cloud & DevOps',
    icon: 'CloudUpload',
    title: 'Cloud Deployment',
    description: 'Production-ready deployments on AWS, Google Cloud, and Azure with auto-scaling, backups, and high availability.',
    featured: true,
  },
  {
    id: 'performance-seo',
    category: 'Cloud & DevOps',
    icon: 'Zap',
    title: 'Performance & SEO',
    description: 'Deep performance audits and SEO optimization achieving sub-second load times and 95+ Lighthouse scores.',
  },
  {
    id: 'maintenance-support',
    category: 'Cloud & DevOps',
    icon: 'Wrench',
    title: 'Maintenance & Support',
    description: 'Proactive maintenance with 24/7 monitoring, security patches, feature updates, and dedicated support channels.',
  },

  // ── AI & Automation ───────────────────────────────────
  {
    id: 'ai-chatbots',
    category: 'AI & Automation',
    icon: 'Bot',
    title: 'AI Chatbots',
    description: 'Intelligent conversational AI trained on your business data to handle customer support, lead qualification, and FAQs.',
    featured: true,
  },
  {
    id: 'workflow-automation',
    category: 'AI & Automation',
    icon: 'Workflow',
    title: 'Workflow Automation',
    description: 'Eliminate repetitive tasks with intelligent automation connecting your tools and data sources seamlessly.',
  },
  {
    id: 'ai-integration',
    category: 'AI & Automation',
    icon: 'Sparkles',
    title: 'AI Integration',
    description: 'Embed AI capabilities — GPT, vision, voice, and prediction — directly into your existing products and workflows.',
  },

  // ── Design & Consulting ───────────────────────────────
  {
    id: 'ui-ux-design',
    category: 'Design & Consulting',
    icon: 'Palette',
    title: 'UI/UX Design',
    description: 'Research-driven design creating intuitive, beautiful interfaces that users love and businesses profit from.',
    featured: true,
  },
  {
    id: 'tech-consulting',
    category: 'Design & Consulting',
    icon: 'Lightbulb',
    title: 'Technology Consulting',
    description: 'Expert guidance on stack selection, architecture decisions, digital transformation, and build-vs-buy strategy.',
  },
]
