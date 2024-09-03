import { z } from "zod";
import { type Request, type Response } from "express";
import { log } from "$/utils/logger";
import * as jenkinsService from "$/service/jenkinsService";
import * as validators from "$/validators";

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
    const validatedData = validators.checkJobExistsValidator.parse(req.params);
    const { jobName } = validatedData;
    const exists = await jenkinsService.checkJobExists(jobName);
    res.json({ exists });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors from Zod
      res.status(400).json({ error: error.errors });
    } else {
      log.error(`Failed to check job existence: ${req.params.jobName}`, error);
      res.status(500).json({ error: "Failed to check job existence" });
    }
  }
};

export const triggerBuildHandler = async (req: Request, res: Response) => {
  try {
    console.log("Request body: ", req.body);
    const validatedData = validators.triggerBuildValidator.parse(req.body);
    const { jobName, imageName } = validatedData; 
    const result = await jenkinsService.triggerBuild(jobName, imageName);
    res.json(result);

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors from Zod
      res.status(400).json({ error: error.errors });
    } else {
      log.error(`Failed to trigger build for job: ${req.body.jobName}`, error);
      res.status(500).json({ error: "Failed to trigger build" });
    }
  }
};

export const getBuildStatusHandler = async (req: Request, res: Response) => {
  try {
    const validatedData = validators.getBuildStatusValidator.parse(req.params);
    const { jobName, buildNumber } = validatedData;
    //const status = await jenkinsService.getBuildStatus(jobName, parseInt(buildNumber, 10));
    const status = await jenkinsService.getBuildStatus(jobName, buildNumber);
    res.json(status);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors from Zod
      res.status(400).json({ error: error.errors });
    } else {
      log.error(
        `Failed to get build status for job: ${req.params.jobName}, 
        build: ${req.params.buildNumber}`,
        error);
      res.status(500).json({ error: "Failed to get build status" });
    }
  }
};
