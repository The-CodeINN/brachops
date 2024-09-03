import { type Request, type Response } from "express";
import { log } from "$/utils/logger";
import * as jenkinsService from "$/service/jenkinsService";

export const getJenkinsInfoHandler = async (req: Request, res: Response) => {
  try {
    const info = await jenkinsService.getJenkinsInfo();
    res.json(info);
  } catch (error) {
    log.error("Failed to get Jenkins info", error);
    res.status(500).json({ error: "Failed to get Jenkins info" });
  }
};

export const checkJobExistsHandler = async (req: Request, res: Response) => {
  try {
    const { jobName } = req.params;
    const exists = await jenkinsService.checkJobExists(jobName);
    res.json({ exists });
  } catch (error) {
    log.error(`Failed to check job existence: ${req.params.jobName}`, error);
    res.status(500).json({ error: "Failed to check job existence" });
  }
};

export const triggerBuildHandler = async (req: Request, res: Response) => {
  try {
    const { jobName, imageName } = req.body;
    const result = await jenkinsService.triggerBuild(jobName, imageName);
    res.json(result);
  } catch (error) {
    log.error(`Failed to trigger build: ${req.body.jobName}`, error);
    res.status(500).json({ error: "Failed to trigger build" });
  }
};

export const getBuildStatusHandler = async (req: Request, res: Response) => {
  try {
    const { jobName, buildNumber } = req.params;
    const status = await jenkinsService.getBuildStatus(jobName, parseInt(buildNumber, 10));
    res.json(status);
  } catch (error) {
    log.error(
      `Failed to get build status for job: ${req.params.jobName}, build: ${req.params.buildNumber}`,
      error
    );
    res.status(500).json({ error: "Failed to get build status" });
  }
};
