import type { Phase, PhaseTemplate, Client } from "../types";

// ============ MOCK DATA ============

export const createPhases = (): Phase[] => [
  {
    id: "vetting",
    name: "Vetting Phase",
    description: "We verify your contractor's credentials, licensing, and reputation to ensure they're trustworthy before you commit.",
    modules: ["vetting"],
    steps: [
      { 
        id: "v1", 
        name: "Initial consultation completed", 
        completed: true,
        description: "We've completed your initial consultation call. During this call, we discussed your project scope, timeline expectations, and gathered information about the contractor(s) you're considering. This helps us tailor our vetting process to your specific situation."
      },
      { 
        id: "v2", 
        name: "Contractor credentials verified", 
        completed: true,
        description: "We've verified your contractor's business credentials including their business registration, years in operation, and professional certifications. We check multiple databases to ensure they are who they claim to be."
      },
      { 
        id: "v3", 
        name: "License and insurance confirmed", 
        completed: false,
        description: "We verify that your contractor holds valid state and local licenses required for your type of project. We also confirm they carry adequate liability insurance and workers' compensation coverage to protect you from potential claims."
      },
      { 
        id: "v4", 
        name: "Reference check completed", 
        completed: false,
        description: "We contact previous clients and review online reputation across multiple platforms. We look for patterns in feedback, how they handle complaints, and verify that positive reviews are authentic."
      },
    ],
  },
  {
    id: "review",
    name: "Review Phase",
    description: "We analyze your contract, estimate, and scope of work to identify red flags and ensure fair terms.",
    modules: ["review"],
    steps: [
      { 
        id: "r1", 
        name: "Contract review initiated", 
        completed: true,
        description: "Please upload your contract or estimate documents. We'll review them for unfair terms, missing protections, and industry best practices. Upload documents in the 'Your Documents' section."
      },
      { 
        id: "r2", 
        name: "Scope of work documented", 
        completed: true,
        description: "We've documented the complete scope of work for your project. This includes all tasks, materials, specifications, and deliverables. This document will serve as your reference throughout the project."
      },
      { 
        id: "r3", 
        name: "Payment terms reviewed", 
        completed: false,
        description: "We analyze the payment schedule to ensure it's fair and protects you. Industry standard is to never pay more than 10% upfront, with payments tied to completed milestones. We'll flag any concerning payment structures."
      },
      { 
        id: "r4", 
        name: "Timeline approved", 
        completed: false,
        description: "We review the proposed timeline for realism and include recommendations for milestone checkpoints. A well-structured timeline protects both parties and sets clear expectations."
      },
    ],
  },
  {
    id: "design",
    name: "Design & Material Phase",
    description: "We help ensure your design choices and material selections are documented and meet quality standards.",
    modules: ["design"],
    steps: [
      { 
        id: "d1", 
        name: "Design consultation scheduled", 
        completed: false,
        description: "We'll schedule a design review consultation to discuss your vision, review contractor proposals, and ensure all design elements are clearly specified in writing."
      },
      { 
        id: "d2", 
        name: "Material selections documented", 
        completed: false,
        description: "All material selections should be documented with specific brands, model numbers, colors, and quantities. This prevents substitutions and ensures you get exactly what you're paying for."
      },
      { 
        id: "d3", 
        name: "Design approval received", 
        completed: false,
        description: "Final design approval means all drawings, specifications, and material choices are locked in. Changes after this point may incur additional costs, so we ensure everything is right before approval."
      },
      { 
        id: "d4", 
        name: "Material orders placed", 
        completed: false,
        description: "We verify that material orders match your approved specifications and document delivery timelines. This helps prevent project delays and ensures accountability."
      },
    ],
  },
  {
    id: "inspection",
    name: "Inspection & Warranty Phase",
    description: "We coordinate inspections at critical project milestones and ensure warranty documentation is complete.",
    modules: ["inspection"],
    steps: [
      { 
        id: "i1", 
        name: "Pre-work inspection completed", 
        completed: false,
        description: "Before work begins, we document the existing condition of your property. This protects you by establishing a baseline and identifying any pre-existing issues that shouldn't be attributed to the contractor."
      },
      { 
        id: "i2", 
        name: "Mid-project inspection scheduled", 
        completed: false,
        description: "A mid-project inspection catches issues before they're covered up by finishing work. We'll review work quality, adherence to plans, and identify any concerns while corrections are still easy to make."
      },
      { 
        id: "i3", 
        name: "Final inspection completed", 
        completed: false,
        description: "The final inspection verifies all work is complete, meets specifications, and is free of defects. We document everything and create a punch list of any items requiring attention before final payment."
      },
      { 
        id: "i4", 
        name: "Warranty documentation collected", 
        completed: false,
        description: "We collect and organize all warranties - manufacturer warranties on materials, contractor workmanship warranties, and any extended warranties. This documentation is crucial for future claims."
      },
    ],
  },
  {
    id: "dispute",
    name: "Dispute & Completion",
    description: "We help ensure a smooth project closeout and provide support if any disputes arise.",
    modules: ["dispute"],
    steps: [
      { 
        id: "dc1", 
        name: "Final walkthrough scheduled", 
        completed: false,
        description: "The final walkthrough is your opportunity to inspect all completed work with your contractor present. We provide a checklist of items to review and can attend virtually to help identify issues."
      },
      { 
        id: "dc2", 
        name: "Punch list created", 
        completed: false,
        description: "Any deficiencies or incomplete items identified during the walkthrough are documented on a formal punch list. This list becomes part of the contract and must be resolved before final payment."
      },
      { 
        id: "dc3", 
        name: "All items resolved", 
        completed: false,
        description: "We track punch list completion and verify that all items have been properly addressed. Only after all issues are resolved should you release final payment."
      },
      { 
        id: "dc4", 
        name: "Project signed off", 
        completed: false,
        description: "Project sign-off means all work is complete, all punch list items are resolved, warranties are in hand, and you're satisfied with the results. Congratulations on completing your project with Aegis Shield protection!"
      },
    ],
  },
];

// Default phase templates for admin management
export const defaultPhaseTemplates: PhaseTemplate[] = [
  {
    id: "vetting",
    name: "Vetting Phase",
    description: "We verify your contractor's credentials, licensing, and reputation to ensure they're trustworthy before you commit.",
    modules: ["vetting"],
    steps: [
      { id: "v1", name: "Initial consultation completed", description: "We've completed your initial consultation call. During this call, we discussed your project scope, timeline expectations, and gathered information about the contractor(s) you're considering. This helps us tailor our vetting process to your specific situation." },
      { id: "v2", name: "Contractor credentials verified", description: "We've verified your contractor's business credentials including their business registration, years in operation, and professional certifications. We check multiple databases to ensure they are who they claim to be." },
      { id: "v3", name: "License and insurance confirmed", description: "We verify that your contractor holds valid state and local licenses required for your type of project. We also confirm they carry adequate liability insurance and workers' compensation coverage to protect you from potential claims." },
      { id: "v4", name: "Reference check completed", description: "We contact previous clients and review online reputation across multiple platforms. We look for patterns in feedback, how they handle complaints, and verify that positive reviews are authentic." },
    ],
  },
  {
    id: "review",
    name: "Review Phase",
    description: "We analyze your contract, estimate, and scope of work to identify red flags and ensure fair terms.",
    modules: ["review"],
    steps: [
      { id: "r1", name: "Contract review initiated", description: "Please upload your contract or estimate documents. We'll review them for unfair terms, missing protections, and industry best practices. Upload documents in the 'Your Documents' section." },
      { id: "r2", name: "Scope of work documented", description: "We've documented the complete scope of work for your project. This includes all tasks, materials, specifications, and deliverables. This document will serve as your reference throughout the project." },
      { id: "r3", name: "Payment terms reviewed", description: "We analyze the payment schedule to ensure it's fair and protects you. Industry standard is to never pay more than 10% upfront, with payments tied to completed milestones. We'll flag any concerning payment structures." },
      { id: "r4", name: "Timeline approved", description: "We review the proposed timeline for realism and include recommendations for milestone checkpoints. A well-structured timeline protects both parties and sets clear expectations." },
    ],
  },
  {
    id: "design",
    name: "Design & Material Phase",
    description: "We help ensure your design choices and material selections are documented and meet quality standards.",
    modules: ["design"],
    steps: [
      { id: "d1", name: "Design consultation scheduled", description: "We'll schedule a design review consultation to discuss your vision, review contractor proposals, and ensure all design elements are clearly specified in writing." },
      { id: "d2", name: "Material selections documented", description: "All material selections should be documented with specific brands, model numbers, colors, and quantities. This prevents substitutions and ensures you get exactly what you're paying for." },
      { id: "d3", name: "Design approval received", description: "Final design approval means all drawings, specifications, and material choices are locked in. Changes after this point may incur additional costs, so we ensure everything is right before approval." },
      { id: "d4", name: "Material orders placed", description: "We verify that material orders match your approved specifications and document delivery timelines. This helps prevent project delays and ensures accountability." },
    ],
  },
  {
    id: "inspection",
    name: "Inspection & Warranty Phase",
    description: "We coordinate inspections at critical project milestones and ensure warranty documentation is complete.",
    modules: ["inspection"],
    steps: [
      { id: "i1", name: "Pre-work inspection completed", description: "Before work begins, we document the existing condition of your property. This protects you by establishing a baseline and identifying any pre-existing issues that shouldn't be attributed to the contractor." },
      { id: "i2", name: "Mid-project inspection scheduled", description: "A mid-project inspection catches issues before they're covered up by finishing work. We'll review work quality, adherence to plans, and identify any concerns while corrections are still easy to make." },
      { id: "i3", name: "Final inspection completed", description: "The final inspection verifies all work is complete, meets specifications, and is free of defects. We document everything and create a punch list of any items requiring attention before final payment." },
      { id: "i4", name: "Warranty documentation collected", description: "We collect and organize all warranties - manufacturer warranties on materials, contractor workmanship warranties, and any extended warranties. This documentation is crucial for future claims." },
    ],
  },
  {
    id: "dispute",
    name: "Dispute & Completion",
    description: "We help ensure a smooth project closeout and provide support if any disputes arise.",
    modules: ["dispute"],
    steps: [
      { id: "dc1", name: "Final walkthrough scheduled", description: "The final walkthrough is your opportunity to inspect all completed work with your contractor present. We provide a checklist of items to review and can attend virtually to help identify issues." },
      { id: "dc2", name: "Punch list created", description: "Any deficiencies or incomplete items identified during the walkthrough are documented on a formal punch list. This list becomes part of the contract and must be resolved before final payment." },
      { id: "dc3", name: "All items resolved", description: "We track punch list completion and verify that all items have been properly addressed. Only after all issues are resolved should you release final payment." },
      { id: "dc4", name: "Project signed off", description: "Project sign-off means all work is complete, all punch list items are resolved, warranties are in hand, and you're satisfied with the results. Congratulations on completing your project with Aegis Shield protection!" },
    ],
  },
];

// Available HESTIA modules
export const AVAILABLE_MODULES = [
  { id: "vetting", name: "Vetting" },
  { id: "review", name: "Review" },
  { id: "design", name: "Design & Material" },
  { id: "inspection", name: "Inspection & Warranty" },
  { id: "dispute", name: "Dispute & Completion" },
];

export const mockClients: Client[] = [
  {
    id: "client1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    product: "ZEUS",
    hestiaModules: [],
    progress: 35,
    phases: createPhases(),
    clientFiles: [
      { id: "f1", name: "contract_draft.pdf", type: "document", uploadedBy: "client", uploadedAt: "Jan 15, 2026", size: "2.4 MB" },
      { id: "f2", name: "kitchen_before.jpg", type: "image", uploadedBy: "client", uploadedAt: "Jan 18, 2026", size: "3.1 MB" },
      { id: "f3", name: "walkthrough_video.mp4", type: "video", uploadedBy: "client", uploadedAt: "Jan 20, 2026", size: "45.2 MB" },
    ],
    adminFiles: [
      { id: "af1", name: "contractor_analysis.pdf", type: "document", uploadedBy: "admin", uploadedAt: "Jan 17, 2026", size: "1.8 MB" },
      { id: "af2", name: "scope_review_annotated.pdf", type: "document", uploadedBy: "admin", uploadedAt: "Jan 22, 2026", size: "3.2 MB" },
    ],
    meetingLinks: [
      { id: "m1", title: "Initial Consultation", url: "https://zoom.us/j/123456789", date: "Jan 25, 2026 at 2:00 PM" },
      { id: "m2", title: "Contract Review Call", url: "https://meet.google.com/abc-defg-hij", date: "Jan 28, 2026 at 10:00 AM" },
    ],
    finalRecordStatus: "not_requested",
  },
  {
    id: "client2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    product: "HESTIA",
    hestiaModules: ["vetting", "review"],
    progress: 65,
    phases: createPhases(),
    clientFiles: [
      { id: "f4", name: "bid_comparison.xlsx", type: "document", uploadedBy: "client", uploadedAt: "Jan 10, 2026", size: "856 KB" },
      { id: "f5", name: "contractor_license.pdf", type: "document", uploadedBy: "client", uploadedAt: "Jan 12, 2026", size: "1.2 MB" },
    ],
    adminFiles: [
      { id: "af3", name: "vetting_report.pdf", type: "document", uploadedBy: "admin", uploadedAt: "Jan 14, 2026", size: "2.1 MB" },
    ],
    meetingLinks: [
      { id: "m3", title: "Vetting Results Review", url: "https://zoom.us/j/987654321", date: "Jan 30, 2026 at 3:00 PM" },
    ],
    finalRecordStatus: "requested",
  },
  {
    id: "client3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    product: "ZEUS",
    hestiaModules: [],
    progress: 85,
    phases: createPhases().map((phase, idx) => ({
      ...phase,
      steps: phase.steps.map((step, stepIdx) => ({
        ...step,
        completed: idx < 4 || (idx === 4 && stepIdx < 2),
      })),
    })),
    clientFiles: [
      { id: "f6", name: "final_contract.pdf", type: "document", uploadedBy: "client", uploadedAt: "Dec 1, 2025", size: "4.5 MB" },
      { id: "f7", name: "renovation_complete.jpg", type: "image", uploadedBy: "client", uploadedAt: "Jan 24, 2026", size: "5.2 MB" },
    ],
    adminFiles: [
      { id: "af4", name: "full_project_analysis.pdf", type: "document", uploadedBy: "admin", uploadedAt: "Jan 20, 2026", size: "8.7 MB" },
      { id: "af5", name: "warranty_documentation.pdf", type: "document", uploadedBy: "admin", uploadedAt: "Jan 23, 2026", size: "2.3 MB" },
    ],
    meetingLinks: [
      { id: "m4", title: "Final Walkthrough", url: "https://zoom.us/j/456789123", date: "Feb 1, 2026 at 11:00 AM" },
    ],
    finalRecordStatus: "generated",
  },
];
