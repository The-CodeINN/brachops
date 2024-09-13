import * as jenkinsService from "$/service/jenkinsService";
import { extractSonarqubeDashboardUrl } from "./getSonarAnalysisUrl";

const pollBuildStatus = async (
  jobName: string,
  buildNumber: number,
  timeout = 300000
): Promise<string> => {
  const startTime = Date.now();
  while (true) {
    const status = await jenkinsService.getBuildStatus(jobName, buildNumber);
    console.log("Polling build status...", status.buildInfo.result);

    // Check if the build is finished
    if (status.buildInfo.result !== null) {
      return extractSonarqubeDashboardUrl(status.buildInfo.actions); // Return sonarqube url when done
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, 7000));

    // Check if timeout has been reached
    if (Date.now() - startTime > timeout) {
      throw new Error("Timeout waiting for job to start");
    }
  }
};

export { pollBuildStatus };
