// ============ TYPES ============

export type UserRole = "client" | "admin" | null;
export type ProductType = "ZEUS" | "HESTIA";
export type FinalRecordStatus = "not_requested" | "requested" | "generated" | "delivered";

export interface StepTemplate {
  id: string;
  name: string;
}

export interface PhaseTemplate {
  id: string;
  name: string;
  steps: StepTemplate[];
  modules: string[]; // Which HESTIA modules this phase belongs to (empty = all/ZEUS)
}

export interface Phase {
  id: string;
  name: string;
  steps: Step[];
  modules: string[]; // Which HESTIA modules this phase belongs to (empty = all/ZEUS)
}

export interface Step {
  id: string;
  name: string;
  completed: boolean;
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
