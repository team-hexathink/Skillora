export type UserType = 'worker' | 'employer';

export interface User {
  username: string;
  password?: string; // Should not be stored long-term in FE state
  type?: UserType;
}

export enum JobType {
  FullTime = 'Full-Time',
  PartTime = 'Part-Time',
  Contract = 'Contract',
  Freelance = 'Freelance',
}

export enum LocationType {
    Remote = 'Remote',
    OnSite = 'On-Site',
    Hybrid = 'Hybrid'
}

export enum ApplicationStatus {
    Applied = 'Applied',
    UnderReview = 'Under Review',
    Interviewing = 'Interviewing',
    Offered = 'Offered',
    Rejected = 'Rejected',
    Withdrawn = 'Withdrawn'
}

export interface WorkerProfile {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  title: string;
  location: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  portfolio: PortfolioItem[];
  // Fix: Add email and contact properties to WorkerProfile to align with data collected during onboarding.
  email: string;
  contact: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  period: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface EmployerProfile {
    id: number;
    username: string;
    companyName: string;
    logoUrl: string;
    industry: string;
    location: string;
    about: string;
    // Fix: Add email and contact properties to EmployerProfile to align with data collected during onboarding.
    email: string;
    contact: string;
}

export interface Job {
  id: number;
  employerId: number;
  title: string;
  description: string;
  skills: string[];
  compensation: {
    min: number;
    max: number;
    currency: string;
    period: 'hour' | 'month' | 'year';
  };
  jobType: JobType;
  locationType: LocationType;
  workingConditions: string[];
}

export interface Application {
    id: number;
    jobId: number;
    workerId: number;
    status: ApplicationStatus;
    dateApplied: string;
}