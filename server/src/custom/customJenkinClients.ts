import axios, { type AxiosRequestConfig } from "axios";

/**
 * JenkinsClient is a reusable and customizable client for interacting with the Jenkins API.
 */
class NewJenkinsClient {
  private baseUrl: string;
  private authHeader: string;

  /**
   * @param baseUrl - The base URL of the Jenkins instance.
   * @param username - Jenkins username for authentication.
   * @param apiToken - Jenkins API token for authentication.
   */
  constructor(baseUrl: string, username: string, apiToken: string) {
    this.baseUrl = baseUrl;
    const credentials = `${username}:${apiToken}`;
    this.authHeader = `Basic ${btoa(credentials)}`;
  }

  /**
   * Get Jenkins crumb for CSRF protection.
   * @returns A promise that resolves with the crumb.
   */
  private async getCrumb(): Promise<any> {
    try {
      const response = await axios({
        method: "get",
        url: `${this.baseUrl}/crumbIssuer/api/json`,
        headers: {
          Authorization: this.authHeader,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch crumb:", error);
      throw new Error("Failed to fetch Jenkins crumb");
    }
  }

  /**
   * Get information about a Jenkins job.
   * @param name - The name of the Jenkins job.
   * @param depth - The JSON depth for the API response.
   * @param fetchAllBuilds - Whether to fetch all builds (may return a large amount of data).
   * @returns A promise that resolves to a dictionary of job information.
   */
  public async getJobInfo(
    name: string,
    depth: number = 0,
    fetchAllBuilds: boolean = false
  ): Promise<any> {
    try {
      const crumb = await this.getCrumb();
      const url = `${this.baseUrl}/job/${name}/api/json?depth=${depth}&tree=${fetchAllBuilds ? "allBuilds[*]" : ""}`;
      const requestConfig: AxiosRequestConfig = {
        method: "get",
        url,
        headers: {
          Authorization: this.authHeader,
          [crumb.crumbRequestField]: crumb.crumb,
        },
      };

      const response = await axios(requestConfig);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch job info:", error);
      throw new Error("Failed to fetch Jenkins job info");
    }
  }

  /**
   * Get details of a pipeline run.
   * @param jobName - The name of the Jenkins job.
   * @param runId - The ID of the pipeline run.
   * @returns A promise that resolves to the pipeline run details.
   */
  public async getPipelineRunDetails(jobName: string, runId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/blue/rest/organizations/jenkins/pipelines/${jobName}/runs/${runId}/nodes/`;

      const requestConfig: AxiosRequestConfig = {
        method: "get",
        url,
        headers: {
          Authorization: this.authHeader,
        },
      };

      const response = await axios(requestConfig);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch pipeline run details:", error);
      throw new Error("Failed to fetch Jenkins pipeline run details");
    }
  }
}

export { NewJenkinsClient };
