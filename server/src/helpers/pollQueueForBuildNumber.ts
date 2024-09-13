import * as jenkinsService from "$/service/jenkinsService";

const pollQueueForBuildNumber = async (queueItem: number, timeout = 15000): Promise<number> => {
  let buildNumber;
  const startTime = Date.now();
  while (!buildNumber) {
    const queueStatus: any = await jenkinsService.getQueueItem(queueItem); // Call the Jenkins API for queue status
    if (queueStatus && queueStatus.executable) {
      buildNumber = queueStatus.executable.number;
    } else {
      console.log("Waiting for job to start...", queueStatus?.executable);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds

      // Check if timeout has been reached
      if (Date.now() - startTime > timeout) {
        throw new Error("Timeout waiting for job to start");
      }
    }
  }
  console.log("Job started...");

  return buildNumber;
};

export { pollQueueForBuildNumber };
