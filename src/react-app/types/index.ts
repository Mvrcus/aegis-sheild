// ============ TYPES ============

export type UserRole = "client" | "admin" | null;
export type ProductType = "ZEUS" | "HESTIA";
export type FinalRecordStatus = "not_requested" | "requested" | "generated" | "delivered";

export interface StepTemplate {
  id: string;
  name: string;
  description?: string; // Default description text (template-level)
}

export interface PhaseTemplate {
  id: string;
  name: string;
  description?: string; // Phase-level description (template)
  steps: StepTemplate[];
  modules: string[]; // Which HESTIA modules this phase belongs to (empty = all/ZEUS)
}

export interface Phase {
  id: string;
  name: string;
  description?: string; // Phase-level description (can be customized per client)
  steps: Step[];
  modules: string[]; // Which HESTIA modules this phase belongs to (empty = all/ZEUS)
}

export interface Step {
  id: string;
  name: string;
  completed: boolean;
  description?: string; // Step description (inherited from template, can be customized per client)
}

export interface UploadedFile {
  id: string;
  name: string;
  type: "document" | "image" | "video";
  uploadedBy: "client" | "admin";
  uploadedAt: string;
  size: string;
}

export interface MeetingLink {
  id: string;
  title: string;
  url: string;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  product: ProductType;
  hestiaModules: string[];
  progress: number;
  phases: Phase[];
  clientFiles: UploadedFile[];
  adminFiles: UploadedFile[];
  meetingLinks: MeetingLink[];
  finalRecordStatus: FinalRecordStatus;
}
