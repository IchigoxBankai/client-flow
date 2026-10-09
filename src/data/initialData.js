export const INITIAL_STUDIO = {
  id: 'studio_northstar',
  name: 'Northstar Creative',
  tagline: 'Independent Digital Product & Brand Atelier',
  services: ['Web Development', 'UI/UX Design', 'Brand Systems'],
  currency: '₹',
  ownerName: 'Nishant Puthran',
  ownerTitle: 'Principal Designer & Full-Stack Developer',
  email: 'studio@northstar.creative',
  phone: '+91 98200 12345',
  location: 'Bangalore, India',
  paymentDetails: 'UPI: northstar@okhdfcbank | Bank: HDFC Bank, A/C: 50200019283746, IFSC: HDFC0001234',
  isOnboarded: true,
  isDemo: true
};

export const INITIAL_CLIENTS = [
  {
    id: 'cli_olive',
    name: 'Olive & Ember Bistro',
    contactPerson: 'Raghav Anand',
    email: 'raghav@oliveandember.in',
    phone: '+91 98201 44321',
    company: 'Olive & Ember Hospitality LLP',
    location: 'Indiranagar, Bangalore',
    notes: 'Premium Mediterranean wood-fired bistro. Values minimal typography, photography-first layout, and seamless table booking.',
    totalProjectValue: 25000,
    outstandingBalance: 12500,
    lastInteraction: '2026-10-08T14:30:00Z',
    status: 'active'
  },
  {
    id: 'cli_aura',
    name: 'Aura Botanicals',
    contactPerson: 'Priya Sharma',
    email: 'priya@aurabotanicals.co',
    phone: '+91 98111 88234',
    company: 'Aura Wellness Organics',
    location: 'Mumbai, India',
    notes: 'Sustainable organic skincare line. Rebranding and launching D2C Shopify headless storefront.',
    totalProjectValue: 45000,
    outstandingBalance: 0,
    lastInteraction: '2026-10-07T11:15:00Z',
    status: 'active'
  },
  {
    id: 'cli_kestrel',
    name: 'Kestrel Studio',
    contactPerson: 'Ar. Kabir Mehta',
    email: 'kabir@kestrelstudio.arch',
    phone: '+91 97333 55120',
    company: 'Kestrel Architecture & Interiors',
    location: 'New Delhi, India',
    notes: 'Boutique architectural practice. Needs an editorial case study portfolio with high-resolution drawing galleries.',
    totalProjectValue: 38000,
    outstandingBalance: 18000,
    lastInteraction: '2026-10-05T16:45:00Z',
    status: 'active'
  },
  {
    id: 'cli_solace',
    name: 'Solace Health',
    contactPerson: 'Dr. Ananya Iyer',
    email: 'ananya@solacehealth.io',
    phone: '+91 98450 99876',
    company: 'Solace Telehealth Technologies',
    location: 'Hyderabad, India',
    notes: 'Patient appointment scheduler and clinician dashboard. Phase 1 completed successfully.',
    totalProjectValue: 60000,
    outstandingBalance: 0,
    lastInteraction: '2026-09-28T10:00:00Z',
    status: 'completed'
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj_restaurant',
    projectNumber: 'PRJ-001',
    title: 'Restaurant Website & Reservation Redesign',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    status: 'in_progress', // 'lead' | 'planning' | 'in_progress' | 'review' | 'completed'
    budget: 25000,
    currency: '₹',
    startDate: '2026-10-01',
    deadline: '2026-10-22',
    timelineWeeks: 3,
    completionPercentage: 45,
    brief: 'Build a modern, high-conversion restaurant website featuring an interactive seasonal food & beverage menu, an intuitive table reservation request flow, and an ambient visual story.',
    requirements: [
      'Editorial, typography-forward responsive layout optimized for mobile diners',
      'Categorized seasonal menu with dietary filters (Vegan, GF, Chef Specials)',
      'Instant table booking request form with SMS/Email confirmation hooks',
      'Location map, valet parking info, and Instagram social grid feed',
      'Sub-second page load times and technical SEO'
    ],
    deliverables: [
      'High-fidelity Figma UI design prototype (Desktop & Mobile)',
      'Production-ready React + Tailwind web application',
      'Table reservation inquiry routing system',
      'DNS hosting setup & SSL certificate handover'
    ],
    milestones: [
      {
        id: 'ms_1',
        number: '01',
        name: 'Discovery & Content Architecture',
        description: 'Review brand assets, menu copy, sitemap, and dining booking requirements.',
        startDate: '2026-10-01',
        dueDate: '2026-10-05',
        status: 'completed', // 'pending' | 'in_progress' | 'in_review' | 'completed'
        approvalStatus: 'approved', // 'unapproved' | 'pending_approval' | 'approved'
        taskCount: 2,
        completedTaskCount: 2
      },
      {
        id: 'ms_2',
        number: '02',
        name: 'Visual Design & Wireframes',
        description: 'Homepage layout, typographic hierarchy, menu display, and reservation modal mockups.',
        startDate: '2026-10-06',
        dueDate: '2026-10-12',
        status: 'in_review',
        approvalStatus: 'pending_approval',
        taskCount: 3,
        completedTaskCount: 2
      },
      {
        id: 'ms_3',
        number: '03',
        name: 'Frontend Development',
        description: 'Component architecture, responsive layouts, menu filtering, and form state logic.',
        startDate: '2026-10-13',
        dueDate: '2026-10-18',
        status: 'pending',
        approvalStatus: 'unapproved',
        taskCount: 3,
        completedTaskCount: 0
      },
      {
        id: 'ms_4',
        number: '04',
        name: 'Testing & Client QA',
        description: 'Cross-browser compatibility testing, speed audit, and client feedback revisions.',
        startDate: '2026-10-19',
        dueDate: '2026-10-21',
        status: 'pending',
        approvalStatus: 'unapproved',
        taskCount: 2,
        completedTaskCount: 0
      },
      {
        id: 'ms_5',
        number: '05',
        name: 'Launch & Domain Handover',
        description: 'Vercel hosting deployment, custom domain DNS mapping, and client training guide.',
        startDate: '2026-10-22',
        dueDate: '2026-10-22',
        status: 'pending',
        approvalStatus: 'unapproved',
        taskCount: 2,
        completedTaskCount: 0
      }
    ],
    tasks: [
      {
        id: 'tsk_101',
        milestoneId: 'ms_1',
        title: 'Review menu copy and food photography package',
        description: 'Catalog high-res food imagery and dietary classification tags.',
        status: 'done',
        priority: 'high',
        dueDate: '2026-10-03',
        estimatedHours: 3
      },
      {
        id: 'tsk_102',
        milestoneId: 'ms_1',
        title: 'Draft site information architecture and user flow',
        description: 'Establish frictionless path from landing view to reservation CTA.',
        status: 'done',
        priority: 'medium',
        dueDate: '2026-10-05',
        estimatedHours: 4
      },
      {
        id: 'tsk_103',
        milestoneId: 'ms_2',
        title: 'Design editorial Homepage layout & typography system',
        description: 'Craft hero section with warm ambient textures and menu teaser.',
        status: 'done',
        priority: 'high',
        dueDate: '2026-10-08',
        estimatedHours: 8
      },
      {
        id: 'tsk_104',
        milestoneId: 'ms_2',
        title: 'Interactive Menu layout & dietary filter UX',
        description: 'Design tabbed menu system for Aperitifs, Mains, Woodfired, and Desserts.',
        status: 'done',
        priority: 'high',
        dueDate: '2026-10-10',
        estimatedHours: 6
      },
      {
        id: 'tsk_105',
        milestoneId: 'ms_2',
        title: 'Table reservation modal & confirmation state',
        description: 'Date, party size, time slot, and special dining request fields.',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-10-12',
        estimatedHours: 5
      },
      {
        id: 'tsk_106',
        milestoneId: 'ms_3',
        title: 'Implement responsive hero banner & navigation',
        description: 'Smooth mobile drawer and sticky book-table CTA.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-10-14',
        estimatedHours: 6
      },
      {
        id: 'tsk_107',
        milestoneId: 'ms_3',
        title: 'Build dynamic menu filter components',
        description: 'Instant client-side filter by dietary restriction.',
        status: 'todo',
        priority: 'medium',
        dueDate: '2026-10-16',
        estimatedHours: 8
      },
      {
        id: 'tsk_108',
        milestoneId: 'ms_3',
        title: 'Integrate reservation email notification webhooks',
        description: 'Send instant notification to manager and auto-reply to diner.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-10-18',
        estimatedHours: 6
      },
      {
        id: 'tsk_109',
        milestoneId: 'ms_4',
        title: 'Cross-browser responsive stress test & Lighthouse QA',
        description: 'Ensure 95+ score on performance, accessibility, and SEO.',
        status: 'todo',
        priority: 'medium',
        dueDate: '2026-10-20',
        estimatedHours: 4
      },
      {
        id: 'tsk_110',
        milestoneId: 'ms_4',
        title: 'Client feedback round & minor tweaks',
        description: 'Incorporate Raghav\'s feedback on beverage descriptions.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-10-21',
        estimatedHours: 4
      },
      {
        id: 'tsk_111',
        milestoneId: 'ms_5',
        title: 'Configure custom domain DNS and SSL certs',
        description: 'Point oliveandember.in to production edge servers.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-10-22',
        estimatedHours: 2
      },
      {
        id: 'tsk_112',
        milestoneId: 'ms_5',
        title: 'Studio handover checklist and CMS training video',
        description: 'Record 5-minute Loom walkthrough on editing seasonal specials.',
        status: 'todo',
        priority: 'low',
        dueDate: '2026-10-22',
        estimatedHours: 2
      }
    ],
    notes: [
      {
        id: 'not_1',
        date: '2026-10-08',
        author: 'Nishant Puthran',
        category: 'client_feedback',
        content: 'Raghav approved the typography pairing (Instrument Serif + Inter) and loves the warm paper background colorway.'
      },
      {
        id: 'not_2',
        date: '2026-10-04',
        author: 'Flow Agent',
        category: 'decision',
        content: 'Milestone 01 Discovery approved. Advance invoice INV-2026-041 of ₹12,500 settled by client.'
      }
    ]
  },
  {
    id: 'proj_ecommerce',
    projectNumber: 'PRJ-002',
    title: 'E-Commerce Brand Platform & Identity',
    clientId: 'cli_aura',
    clientName: 'Aura Botanicals',
    status: 'lead',
    budget: 45000,
    currency: '₹',
    startDate: '2026-10-25',
    deadline: '2026-11-20',
    timelineWeeks: 4,
    completionPercentage: 10,
    brief: 'Complete digital packaging, identity guidelines, and headless Shopify storefront for 12 organic botanical formulations.',
    requirements: [
      'Refined minimalist apothecary aesthetic',
      'Ingredients transparency modal for each product',
      'Subscription order management module'
    ],
    deliverables: [
      'Brand Identity Guide (Color, Typography, Packaging labels)',
      'Custom Shopify Theme Codebase',
      'Payment Gateway Integration (Razorpay + Stripe)'
    ],
    milestones: [
      {
        id: 'ms_aura_1',
        number: '01',
        name: 'Brand Discovery & Visual Language',
        description: 'Color palette, typography, and moodboard exploration.',
        startDate: '2026-10-25',
        dueDate: '2026-11-01',
        status: 'pending',
        approvalStatus: 'unapproved',
        taskCount: 3,
        completedTaskCount: 0
      },
      {
        id: 'ms_aura_2',
        number: '02',
        name: 'Storefront UI & Cart UX',
        description: 'Product detail templates, bundle builder, and mobile cart.',
        startDate: '2026-11-02',
        dueDate: '2026-11-10',
        status: 'pending',
        approvalStatus: 'unapproved',
        taskCount: 4,
        completedTaskCount: 0
      }
    ],
    tasks: [
      {
        id: 'tsk_aura_1',
        milestoneId: 'ms_aura_1',
        title: 'Draft botanical color palette and typography hierarchy',
        description: 'Explore earth tones and editorial typefaces.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-10-28',
        estimatedHours: 8
      }
    ],
    notes: []
  },
  {
    id: 'proj_kestrel',
    projectNumber: 'PRJ-003',
    title: 'Architectural Portfolio System',
    clientId: 'cli_kestrel',
    clientName: 'Kestrel Studio',
    status: 'review',
    budget: 38000,
    currency: '₹',
    startDate: '2026-09-10',
    deadline: '2026-10-14',
    timelineWeeks: 5,
    completionPercentage: 90,
    brief: 'Monochrome editorial portfolio showcase with interactive floorplan overlays and high-res project galleries.',
    requirements: [
      'Full-bleed architectural imagery with zero compression artifacts',
      'Project filtering by Typology (Residential, Commercial, Civic)',
      'Awards & Press archive with downloadable press kits'
    ],
    deliverables: [
      'Custom portfolio website',
      'CMS for project additions',
      'SEO & Performance optimization'
    ],
    milestones: [
      {
        id: 'ms_kes_1',
        number: '01',
        name: 'Editorial Architecture & Grid Design',
        description: 'Grid systems and full-bleed image layouts.',
        startDate: '2026-09-10',
        dueDate: '2026-09-22',
        status: 'completed',
        approvalStatus: 'approved',
        taskCount: 3,
        completedTaskCount: 3
      },
      {
        id: 'ms_kes_2',
        number: '02',
        name: 'Development & Drawing Interactive Layer',
        description: 'SVG blueprint zooms and project case studies.',
        startDate: '2026-09-23',
        dueDate: '2026-10-08',
        status: 'completed',
        approvalStatus: 'approved',
        taskCount: 4,
        completedTaskCount: 4
      },
      {
        id: 'ms_kes_3',
        number: '03',
        name: 'Final Client Review & Handover',
        description: 'Final walkthrough with Ar. Kabir Mehta.',
        startDate: '2026-10-09',
        dueDate: '2026-10-14',
        status: 'in_review',
        approvalStatus: 'pending_approval',
        taskCount: 2,
        completedTaskCount: 1
      }
    ],
    tasks: [
      {
        id: 'tsk_kes_1',
        milestoneId: 'ms_kes_3',
        title: 'Review final image crop ratios on ultra-wide monitors',
        description: 'Verify gallery aspect ratios.',
        status: 'done',
        priority: 'medium',
        dueDate: '2026-10-11',
        estimatedHours: 3
      },
      {
        id: 'tsk_kes_2',
        milestoneId: 'ms_kes_3',
        title: 'Client final signoff walkthrough',
        description: 'Walk through CMS project editor with Kabir.',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-10-14',
        estimatedHours: 2
      }
    ],
    notes: []
  },
  {
    id: 'proj_solace',
    projectNumber: 'PRJ-004',
    title: 'Patient Booking App UI Kit',
    clientId: 'cli_solace',
    clientName: 'Solace Health',
    status: 'completed',
    budget: 60000,
    currency: '₹',
    startDate: '2026-08-01',
    deadline: '2026-09-20',
    timelineWeeks: 7,
    completionPercentage: 100,
    brief: 'Accessible telemedicine scheduling experience for iOS and Web.',
    requirements: ['WCAG 2.1 AAA Accessibility', 'Clinician time-slot sync'],
    deliverables: ['Design System Figma file', 'React Native component library'],
    milestones: [
      {
        id: 'ms_sol_1',
        number: '01',
        name: 'Design & Code Handover',
        description: 'Final design system delivery.',
        status: 'completed',
        approvalStatus: 'approved',
        taskCount: 4,
        completedTaskCount: 4
      }
    ],
    tasks: [],
    notes: []
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop_001',
    proposalNumber: 'PROP-2026-08',
    title: 'Client Proposal — Olive & Ember Bistro Website Redesign',
    projectId: 'proj_restaurant',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    createdAt: '2026-10-01',
    validUntil: '2026-10-31',
    status: 'accepted',
    totalBudget: 25000,
    currency: '₹',
    overview: 'Northstar Creative is pleased to present this proposal for the complete design and engineering of Olive & Ember Bistro\'s digital presence. We will deliver an editorial, high-performance website that captures the warm atmosphere of your Indiranagar dining room and makes table reservation effortless.',
    scope: [
      'Comprehensive content architecture and brand translation',
      'Bespoke desktop & mobile UI design system with interactive prototypes',
      'Production-grade responsive web frontend built with React & Tailwind',
      'Table reservation workflow with manager notification triggers',
      'SEO optimization and hosting handover'
    ],
    deliverables: [
      'Interactive Figma UI prototype',
      'Production-ready web application codebase',
      'Integrated table booking notification system',
      '14-day post-launch support and CMS training guide'
    ],
    timelineSummary: '3 Weeks total duration across 5 sequential milestones.',
    pricingItems: [
      { description: 'Phase 1: Discovery, Content Architecture & Wireframes', amount: 6000 },
      { description: 'Phase 2: Bespoke Visual Design & Interactive Prototype', amount: 8000 },
      { description: 'Phase 3: Frontend Development & Reservation Booking Flow', amount: 8000 },
      { description: 'Phase 4 & 5: Testing, QA, Launch & Handover Documentation', amount: 3000 }
    ],
    paymentSchedule: '50% Advance on project kickoff (₹12,500), 50% upon milestone completion and final launch (₹12,500).',
    terms: 'Two revision rounds are included per milestone. Additional requests outside the stated scope will be estimated separately. All intellectual property transfers to Olive & Ember Bistro upon settlement of the final invoice.'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2026-041',
    title: 'Milestone 01 Advance — Olive & Ember Bistro',
    projectId: 'proj_restaurant',
    projectTitle: 'Restaurant Website & Reservation Redesign',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    clientEmail: 'raghav@oliveandember.in',
    clientAddress: '12th Main Road, Indiranagar, Bangalore 560038',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    paidDate: '2026-10-04',
    currency: '₹',
    status: 'paid', // 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'
    lineItems: [
      { description: 'Project Kickoff & Milestone 01 Discovery / Content Architecture', quantity: 1, rate: 12500, amount: 12500 }
    ],
    subtotal: 12500,
    taxPercent: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 12500,
    amountPaid: 12500,
    notes: 'Thank you for your business. Payment received via UPI transfer.',
    payments: [
      { id: 'pay_1', date: '2026-10-04', amount: 12500, method: 'UPI / Bank Transfer', reference: 'UPI-HDFC-99182' }
    ]
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2026-042',
    title: 'Milestone 02 Visual Design & Final Handover — Olive & Ember Bistro',
    projectId: 'proj_restaurant',
    projectTitle: 'Restaurant Website & Reservation Redesign',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    clientEmail: 'raghav@oliveandember.in',
    clientAddress: '12th Main Road, Indiranagar, Bangalore 560038',
    issueDate: '2026-10-10',
    dueDate: '2026-10-24',
    currency: '₹',
    status: 'sent',
    lineItems: [
      { description: 'Phase 2 Visual Design, Interactive Prototype & Frontend Deployment', quantity: 1, rate: 12500, amount: 12500 }
    ],
    subtotal: 12500,
    taxPercent: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 12500,
    amountPaid: 0,
    notes: 'Please remit payment to Northstar Creative within 14 days.',
    payments: []
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2026-039',
    title: 'Final Handover Balance — Kestrel Studio Portfolio',
    projectId: 'proj_kestrel',
    projectTitle: 'Architectural Portfolio System',
    clientId: 'cli_kestrel',
    clientName: 'Kestrel Studio',
    clientEmail: 'kabir@kestrelstudio.arch',
    clientAddress: 'Defence Colony, New Delhi 110024',
    issueDate: '2026-09-24',
    dueDate: '2026-10-08',
    currency: '₹',
    status: 'overdue',
    lineItems: [
      { description: 'Phase 3 Final CMS Handover & Interactive SVG Floorplan Integration', quantity: 1, rate: 18000, amount: 18000 }
    ],
    subtotal: 18000,
    taxPercent: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 18000,
    amountPaid: 0,
    notes: 'Friendly reminder: payment was due on October 8, 2026.',
    payments: []
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc_prop_1',
    type: 'proposal',
    title: 'Olive & Ember Bistro — Full Project Agreement',
    projectId: 'proj_restaurant',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-02',
    status: 'approved'
  },
  {
    id: 'doc_inv_1',
    type: 'invoice',
    title: 'INV-2026-041 (Kickoff Advance ₹12,500)',
    projectId: 'proj_restaurant',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-04',
    status: 'paid'
  },
  {
    id: 'doc_email_1',
    type: 'email',
    title: 'Visual Design Handover & Review Request',
    projectId: 'proj_restaurant',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-08',
    status: 'draft',
    content: 'Hi Raghav,\n\nI am thrilled to share the initial visual design and interactive prototype for Olive & Ember Bistro. The menu layout and reservation form are ready for your review.\n\nPlease take a look and let us know if you approve moving straight to frontend development!\n\nBest,\nNishant'
  },
  {
    id: 'doc_brief_1',
    type: 'brief',
    title: 'Project Blueprint & Requirements Specification',
    projectId: 'proj_restaurant',
    clientId: 'cli_olive',
    clientName: 'Olive & Ember Bistro',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
    status: 'final'
  }
];

export const INITIAL_ACTIVITY = [
  {
    id: 'act_1',
    timestamp: '2026-10-08T15:20:00Z',
    type: 'agent_action',
    title: 'Flow Agent prepared design review email draft',
    description: 'Generated client communication for Olive & Ember Bistro.',
    projectId: 'proj_restaurant'
  },
  {
    id: 'act_2',
    timestamp: '2026-10-08T11:45:00Z',
    type: 'milestone_update',
    title: 'Milestone 02 moved to In Review',
    description: 'Visual Design mockups submitted for Raghav\'s signoff.',
    projectId: 'proj_restaurant'
  },
  {
    id: 'act_3',
    timestamp: '2026-10-04T18:00:00Z',
    type: 'payment_received',
    title: 'Payment recorded for INV-2026-041',
    description: 'Received ₹12,500 via UPI transfer from Olive & Ember Bistro.',
    projectId: 'proj_restaurant'
  },
  {
    id: 'act_4',
    timestamp: '2026-10-01T10:00:00Z',
    type: 'project_created',
    title: 'Project created from AI Brief Intake',
    description: 'Extracted 5 milestones, 12 tasks, and budget ₹25,000.',
    projectId: 'proj_restaurant'
  }
];
