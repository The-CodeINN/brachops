import { type Request, type Response, type NextFunction } from "express";
import { log } from "$/utils/logger";
import * as jenkinsService from "$/service/jenkinsService";
import { createJenkinsJobXML } from "$/helpers/configXml";
import { generatePipeline } from "$/helpers/pipeline";
import { type GetBuildStatusInput, type CheckJobExistsInput, type CreateJobInput } from "$/schema";

export const getJenkinsInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const info = await jenkinsService.getJenkinsInfo();
    res.json(info);
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const checkJobExistsHandler = async (
  req: Request<CheckJobExistsInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName } = req.params;
    const exists = await jenkinsService.checkJobExists(jobName);
    res.json({ exists });
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const getBuildStatusHandler = async (
  req: Request<GetBuildStatusInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName, buildNumber } = req.params;
    const status = await jenkinsService.getBuildStatus(jobName, parseInt(buildNumber, 10));
    res.json(status);
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const createJenkinsJobHandler = async (
  req: Request<object, object, CreateJobInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    const { jobName, imageName } = req.body;
    console.log(req.body);

    // Check if job already exists
    if (await jenkinsService.checkJobExists(jobName)) {
      return res.status(409).json({ error: `Job ${jobName} already exists` });
    }

    // Generate pipeline script and XML configuration
    const pipelineScript = generatePipeline(imageName);
    const xml = createJenkinsJobXML(pipelineScript);

    // Create Jenkins job
    await jenkinsService.createJenkinsJob(jobName, xml);

    // Trigger the build
    const buildResult = await jenkinsService.triggerJob(jobName);

    // Return success response
    res.status(201).json({
      message: `Job ${jobName} created and triggered successfully`,
      buildResult,
    });
  } catch (error) {
    log.error(error);
    next(error);
  }
};
