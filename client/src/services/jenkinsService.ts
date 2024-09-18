import {
  DeploymentResponse,
  JobWithBuildsResponse,
  CreateJobInput,
  CreateScanJobInput,
  GetDeploymentBuildStatusResponse,
  GetBuildDetailsResponse,
} from '@/types';
import axios, { AxiosResponse } from 'axios';

export const baseUrl = import.meta.env.VITE_BACKEND_URL;

class DeploymentService {
  static async getDeployments(): Promise<AxiosResponse<DeploymentResponse>> {
    return axios.get<DeploymentResponse>(`${baseUrl}/jenkins/info`);
  }

  static getJobsWithBuilds(): Promise<AxiosResponse<JobWithBuildsResponse>> {
    return axios.get<JobWithBuildsResponse>(
      `${baseUrl}/jenkins/jobsWithBuilds`
    );
  }

  static async createDeployment(
    data: CreateJobInput
  ): Promise<AxiosResponse<DeploymentResponse>> {
    return axios.post<DeploymentResponse>(`${baseUrl}/jenkins/job`, data);
  }

  static async createScanDeployment(
    data: CreateScanJobInput
  ): Promise<AxiosResponse<DeploymentResponse>> {
    return axios.post<DeploymentResponse>(`${baseUrl}/jenkins/scan`, data);
  }

  static async deleteJob(
    jobName: string
  ): Promise<AxiosResponse<DeploymentResponse>> {
    return axios.delete<DeploymentResponse>(
      `${baseUrl}/jenkins/job/${jobName}`
    );
  }

  static async getDeploymentBuildStatus(jobName: string): Promise<AxiosResponse<GetDeploymentBuildStatusResponse>> {
    return axios.get<GetDeploymentBuildStatusResponse>(
      `${baseUrl}/jenkins/deployment-status/${jobName}`
    )
  }

  static async getBuildDetails(jobName: string, buildId: string): Promise<AxiosResponse<GetBuildDetailsResponse>> {
    return axios.get<GetBuildDetailsResponse>(
      `${baseUrl}/jenkins/job/${encodeURIComponent(jobName)}/build/${buildId}`
    )
  }
}

export { DeploymentService };
