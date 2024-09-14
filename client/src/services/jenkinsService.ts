import { DeploymentResponse, JobWithBuildsResponse } from '@/types';
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
}

export { DeploymentService };
