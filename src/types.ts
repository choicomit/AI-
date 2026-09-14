export type UserRole = 'instructor' | 'student' | 'guest';

export type CurriculumTab =
  | 'dashboard-overview'
  | 'live-class-workspace'
  | 'ai-prompt-sandbox'
  | 'task-review-feedback'
  | 'class-resources-archive'
  | 'instructor-management-console';

export interface LectureSessionData {
  date: string; // e.g. "2026-09-16"
  round: string; // e.g. "5회차"
  displayDate: string; // e.g. "2026. 09. 16 (수)"
  title: string;
  summary: string;
  difficulty: string;
  deadline: string;
}

export interface ClassFileItem {
  id: string;
  name: string;
  type: 'vod' | 'pdf' | 'xlsx' | 'docx';
  size: string;
  detail: string;
  isPublic: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AiReviewData {
  tags: string[];
  summary: string;
  actionItems: ActionItem[];
  confidenceScore: string;
  tokenUsage: string;
  lastSyncedAt?: string;
  isAttachedToStudent: boolean;
}

export interface InfographicStep {
  step: string;
  title: string;
  desc: string;
  icon: string;
  colorClass: string;
}

export interface InfographicData {
  prompt: string;
  type: string;
  aspectRatio: string;
  theme: 'blue' | 'emerald' | 'slate';
  isAttachedToStudent: boolean;
  steps: InfographicStep[];
}

export interface ToastState {
  show: boolean;
  title: string;
  message: string;
  icon: string;
}
