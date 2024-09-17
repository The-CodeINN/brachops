import { LucideIcon } from 'lucide-react';

export interface SidebarItems {
  links: Array<{
    label: string;
    path: string;
    icon?: LucideIcon;
  }>;
}

export interface Job {
  name: string;
  url: string;
  color: string;
}

export interface JenkinsInfo {
  jobs: Job[];
  numExecutors: number;
  url: string;
}

export interface DeploymentResponse {
  data: JenkinsInfo | object;
  message: string;
  status: string;
}

export interface JobWithBuildsResponse {
  status: string;
  data: {
    jobs: JobWithBuilds[];
  };
  message: string;
}

export interface JobWithBuilds extends Job {
  builds: Build[];
}

export interface Build {
  number: number;
  result: string;
  duration: number;
  url: string;
}

export interface CreateJobInput {
  jobName: string;
  imageName: string;
  projectType: 'DotNetCore' | 'NodeJs';
  envVars: Record<string, string>;
}

export interface CreateScanJobInput {
  jobName: string;
  gitUrl: string;
  buildPath: string;
}

export interface BackendError {
  path: string;
  message: string;
}

export interface BackendErrorResponse {
  status: string;
  message: string;
  errors: {
    details: BackendError[];
  };
}
