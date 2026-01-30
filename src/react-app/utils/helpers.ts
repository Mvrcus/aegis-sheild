import type { FinalRecordStatus } from "../types";

// File type icon mapping - memoized as constant lookup
const FILE_ICONS: Record<string, string> = {
  document: "📄",
  image: "🖼️",
  video: "🎬",
} as const;

export const getFileIcon = (type: string): string => FILE_ICONS[type] ?? "📎";

// Status color mapping - constant lookup instead of switch
const STATUS_COLORS: Record<FinalRecordStatus, string> = {
  not_requested: "#6b7280",
  requested: "#f59e0b",
  generated: "#10b981",
  delivered: "#3b82f6",
} as const;

export const getStatusColor = (status: FinalRecordStatus): string => 
  STATUS_COLORS[status] ?? "#6b7280";

// Generate unique ID - stable function reference
export const generateId = (prefix = "id"): string => 
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Get initials from name - utility for avatars
export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

// Capitalize first letter
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
