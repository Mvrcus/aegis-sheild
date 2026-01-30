import type { Phase, PhaseTemplate, Client } from "../types";

// ============ MOCK DATA ============

export const createPhases = (): Phase[] => [
  {
    id: "vetting",
    name: "Vetting Phase",
    modules: ["vetting"],
    steps: [
      { id: "v1", name: "Initial consultation completed", completed: true },
      { id: "v2", name: "Contractor credentials verified", completed: true },
      { id: "v3", name: "License and insurance confirmed", completed: false },
      { id: "v4", name: "Reference check completed", completed: false },
    ],
  },
  {
    id: "review",
    name: "Review Phase",
    modules: ["review"],
    steps: [
      { id: "r1", name: "Contract review initiated", completed: true },
      { id: "r2", name: "Scope of work documented", completed: true },
      { id: "r3", name: "Payment terms reviewed", completed: false },
      { id: "r4", name: "Timeline approved", completed: false },
    ],
  },
  {
    id: "design",
    name: "Design & Material Phase",
    modules: ["design"],
    steps: [
      { id: "d1", name: "Design consultation scheduled", completed: false },
      { id: "d2", name: "Material selections documented", completed: false },
      { id: "d3", name: "Design approval received", completed: false },
      { id: "d4", name: "Material orders placed", completed: false },
    ],
  },
  {
    id: "inspection",
    name: "Inspection & Warranty Phase",
    modules: ["inspection"],
    steps: [
      { id: "i1", name: "Pre-work inspection completed", completed: false },
      { id: "i2", name: "Mid-project inspection scheduled", completed: false },
      { id: "i3", name: "Final inspection completed", completed: false },
      { id: "i4", name: "Warranty documentation collected", completed: false },
    ],
  },
  {
    id: "dispute",
    name: "Dispute & Completion",
    modules: ["dispute"],
    steps: [
      { id: "dc1", name: "Final walkthrough scheduled", completed: false },
      { id: "dc2", name: "Punch list created", completed: false },
      { id: "dc3", name: "All items resolved", completed: false },
      { id: "dc4", name: "Project signed off", completed: false },
    ],
  },
];

// Default phase templates for admin management
export const defaultPhaseTemplates: PhaseTemplate[] = [
  {
    id: "vetting",
    name: "Vetting Phase",
    modules: ["vetting"],
    steps: [
      { id: "v1", name: "Initial consultation completed" },
      { id: "v2", name: "Contractor credentials verified" },
      { id: "v3", name: "License and insurance confirmed" },
      { id: "v4", name: "Reference check completed" },
    ],
  },
  {
    id: "review",
    name: "Review Phase",
    modules: ["review"],
    steps: [
      { id: "r1", name: "Contract review initiated" },
      { id: "r2", name: "Scope of work documented" },
      { id: "r3", name: "Payment terms reviewed" },
      { id: "r4", name: "Timeline approved" },
    ],
  },
  {
    id: "design",
    name: "Design & Material Phase",
    modules: ["design"],
    steps: [
      { id: "d1", name: "Design consultation scheduled" },
      { id: "d2", name: "Material selections documented" },
      { id: "d3", name: "Design approval received" },
      { id: "d4", name: "Material orders placed" },
    ],
  },
  {
    id: "inspection",
    name: "Inspection & Warranty Phase",
    modules: ["inspection"],
    steps: [
      { id: "i1", name: "Pre-work inspection completed" },
      { id: "i2", name: "Mid-project inspection scheduled" },
      { id: "i3", name: "Final inspection completed" },
      { id: "i4", name: "Warranty documentation collected" },
    ],
  },
  {
    id: "dispute",
    name: "Dispute & Completion",
    modules: ["dispute"],
    steps: [
      { id: "dc1", name: "Final walkthrough scheduled" },
      { id: "dc2", name: "Punch list created" },
      { id: "dc3", name: "All items resolved" },
      { id: "dc4", name: "Project signed off" },
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
      { id: "f1", name: "contract_draft.pdf", type: "document", uploadedBy: "client", uploadedAt: "2026-01-15", size: "2.4 MB" },
      { id: "f2", name: "kitchen_before.jpg", type: "image", uploadedBy: "client", uploadedAt: "2026-01-18", size: "3.1 MB" },
      { id: "f3", name: "walkthrough_video.mp4", type: "video", uploadedBy: "client", uploadedAt: "2026-01-20", size: "45.2 MB" },
    ],
    adminFiles: [
      { id: "af1", name: "contractor_analysis.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-17", size: "1.8 MB" },
      { id: "af2", name: "scope_review_annotated.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-22", size: "3.2 MB" },
    ],
    meetingLinks: [
      { id: "m1", title: "Initial Consultation", url: "https://zoom.us/j/123456789", date: "2026-01-25 2:00 PM" },
      { id: "m2", title: "Contract Review Call", url: "https://meet.google.com/abc-defg-hij", date: "2026-01-28 10:00 AM" },
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
      { id: "f4", name: "bid_comparison.xlsx", type: "document", uploadedBy: "client", uploadedAt: "2026-01-10", size: "856 KB" },
      { id: "f5", name: "contractor_license.pdf", type: "document", uploadedBy: "client", uploadedAt: "2026-01-12", size: "1.2 MB" },
    ],
    adminFiles: [
      { id: "af3", name: "vetting_report.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-14", size: "2.1 MB" },
    ],
    meetingLinks: [
      { id: "m3", title: "Vetting Results Review", url: "https://zoom.us/j/987654321", date: "2026-01-30 3:00 PM" },
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
      { id: "f6", name: "final_contract.pdf", type: "document", uploadedBy: "client", uploadedAt: "2025-12-01", size: "4.5 MB" },
      { id: "f7", name: "renovation_complete.jpg", type: "image", uploadedBy: "client", uploadedAt: "2026-01-24", size: "5.2 MB" },
    ],
    adminFiles: [
      { id: "af4", name: "full_project_analysis.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-20", size: "8.7 MB" },
      { id: "af5", name: "warranty_documentation.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-23", size: "2.3 MB" },
    ],
    meetingLinks: [
      { id: "m4", title: "Final Walkthrough", url: "https://zoom.us/j/456789123", date: "2026-02-01 11:00 AM" },
    ],
    finalRecordStatus: "generated",
  },
];
