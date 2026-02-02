
export enum UserRole {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
  TRANSLATOR = 'TRANSLATOR'
}

export enum JobStatus {
  UNASSIGNED = 'UNASSIGNED',
  NEW = 'NEW',
  STARTED = 'STARTED',
  TRANSLATED = 'TRANSLATED',
  RECORDED = 'RECORDED',
  QA = 'QA',
  UPLOADED = 'UPLOADED'
}

export type ProjectType = 'document' | 'video';

export interface PlatformClient {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  ratePerWord: number;
  ratePerMinute: number;
  status: 'pending' | 'active';
  inviteToken?: string;
}

export interface PlatformTranslator {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isDeaf: boolean;
  ratePerWord: number;
  ratePerMinute: number;
  avatar?: string;
  status: 'pending' | 'active';
  inviteToken?: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string; // For simulation
  role: UserRole;
  email: string;
  phone?: string;
  avatar?: string;
  clientRecordId?: string;
  status?: 'active' | 'pending';
}

export interface Project {
  id: string;
  name: string;
  title?: string;
  type: ProjectType;
  status: JobStatus;
  clientId: string;
  wordCount?: number;
  minuteCount?: number;
  driveLink?: string;
  appliedRate: number; 
  ratePerWord?: number;
  sourceLang?: string;
  targetLang?: string;
  translatorIds: string[];
  clientQuote: number;
  translatorQuotes: Record<string, number>;
  createdAt: string;
  deadline: string;
  description?: string;
}

export type Job = Project;

export interface Invite {
  token: string;
  email: string;
  role: UserRole;
  targetId: string; // ID of the client or translator record
}
