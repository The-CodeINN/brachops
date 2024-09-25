import {
  DeploymentResponse,
  JobWithBuildsResponse,
  CreateJobInput,
  CreateScanJobInput,
  GetDeploymentBuildStatusResponse,
  GetBuildDetailsResponse,
  GetSonarAnalysisResponse,
} from "@/types";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const baseUrl = import.meta.env.VITE_BACKEND_URL;

const axiosConfig = axios.create({
  baseURL: baseUrl,
});

axiosConfig.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set("ngrok-skip-browser-warning", "true");
  return config;
});

class DeploymentService {
  static async getDeployments(): Promise<AxiosResponse<DeploymentResponse>> {
    return axiosConfig.get<DeploymentResponse>(`${baseUrl}/jenkins/info`);
  }

  static getJobsWithBuilds(): Promise<AxiosResponse<JobWithBuildsResponse>> {
    return axiosConfig.get<JobWithBuildsResponse>(
      `${baseUrl}/jenkins/jobsWithBuilds`
    );
  }

  static async createDeployment(
    data: CreateJobInput
  ): Promise<AxiosResponse<DeploymentResponse>> {
    return axiosConfig.post<DeploymentResponse>(`${baseUrl}/jenkins/job`, data);
  }

  static async createScanDeployment(
    data: CreateScanJobInput
  ): Promise<AxiosResponse<DeploymentResponse>> {
    return axiosConfig.post<DeploymentResponse>(
      `${baseUrl}/jenkins/scan`,
      data
    );
  }

  static async deleteJob(
    jobName: string
  ): Promise<AxiosResponse<DeploymentResponse>> {
    return axiosConfig.delete<DeploymentResponse>(
      `${baseUrl}/jenkins/job/${jobName}`
    );
  }

  static async getDeploymentBuildStatus(
    jobName: string
  ): Promise<AxiosResponse<GetDeploymentBuildStatusResponse>> {
    return axiosConfig.get<GetDeploymentBuildStatusResponse>(
      `${baseUrl}/jenkins/deployment-status/${jobName}`
    );
  }

  static async getBuildDetails(
    jobName: string,
    buildId: string
  ): Promise<AxiosResponse<GetBuildDetailsResponse>> {
    const encodedJobName = encodeURIComponent(jobName);
    return axiosConfig.get<GetBuildDetailsResponse>(
      `${baseUrl}/jenkins/job/${encodedJobName}/build/${buildId}`
    );
  }

  static async getSonarAnalysis(): Promise<AxiosResponse<any>> {
    return axiosConfig.get<GetSonarAnalysisResponse>(
      `${baseUrl}/sonarqube-analysis`
    );
  }
}

export { DeploymentService };
