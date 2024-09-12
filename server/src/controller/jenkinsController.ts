import { type Request, type Response, type NextFunction } from "express";
import { log } from "$/utils/logger";
import * as jenkinsService from "$/service/jenkinsService";
import { createJenkinsJobXML } from "$/helpers/configXml";
import { generatePipeline } from "$/helpers/pipeline";
import {
  type GetBuildStatusInput,
  type CheckJobExistsInput,
  type CreateJobInput,
  CreateScanJobInput,
} from "$/schema";
import { createSuccessResponse } from "$/utils/apiResponse";
import { generateGitPipeline } from "$/helpers/gitPipeline";

// Get Jenkins info
export const getJenkinsInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const info = await jenkinsService.getJenkinsInfo();

    // Extract relevant information
    const relevantInfo = {
      numExecutors: info.numExecutors,
      jobs: info.jobs.map((job: any) => ({
        name: job.name,
        url: job.url,
        color: job.color,
      })),
      url: info.url,
    };

    res.json(createSuccessResponse(relevantInfo, "Jenkins info retrieved successfully"));
  } catch (error) {
    log.error(error);
    next(error);
  }
};

// Check if a job exists
export const checkJobExistsHandler = async (
  req: Request<CheckJobExistsInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName } = req.params;
    const exists = await jenkinsService.checkJobExists(jobName);
    res.json(createSuccessResponse({ exists }, `Job existence checked successfully`));
  } catch (error) {
    log.error(error);
    next(error);
  }
};

// Get the status of a build
export const getBuildStatusHandler = async (
  req: Request<GetBuildStatusInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName, buildNumber } = req.params;
    const status = await jenkinsService.getBuildStatus(jobName, parseInt(buildNumber, 10));

    // Extract relevant information from status
    const relevantInfo = {
      fullDisplayName: status.buildInfo.fullDisplayName,
      number: status.buildInfo.number,
      result: status.buildInfo.result,
      url: status.buildInfo.url,
      duration: status.buildInfo.duration,
      parameters: status.buildInfo.actions.find(
        (action: any) => action._class === "hudson.model.ParametersAction"
      )?.parameters,
    };

    res.json(createSuccessResponse(relevantInfo, "Build status retrieved successfully"));
  } catch (error) {
    log.error(error);
    next(error);
  }
};

// Create a new Jenkins job and trigger a build
export const createJenkinsJobHandler = async (
  req: Request<object, object, CreateJobInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    const { jobName, imageName, projectType } = req.body;

    // Check if job already exists
    if (await jenkinsService.checkJobExists(jobName)) {
      return res.status(409).json({ error: `Job ${jobName} already exists` });
    }

    // Generate pipeline script and XML configuration
    const pipelineScript = generatePipeline(imageName, projectType);
    const xml = createJenkinsJobXML(pipelineScript);

    // Create Jenkins job
    await jenkinsService.createJenkinsJob(jobName, xml);

    // Trigger the build
    const buildResult = await jenkinsService.triggerJob(jobName);

    // Return success response
    res
      .status(201)
      .json(
        createSuccessResponse({ buildResult }, `Job ${jobName} created and triggered successfully`)
      );
  } catch (error) {
    log.error(error);
    next(error);
  }
};

// Create a new Jenkins job for code scanning and trigger a build
export const createScanJobHandler = async (
  req: Request<object, object, CreateScanJobInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    const { jobName, gitUrl } = req.body;
    const exists = await jenkinsService.checkJobExists(jobName);
    if (exists) {
      return res.status(409).json({ error: `Job ${jobName} already exists` });
    }

    // Generate pipeline script and XML configuration
    const pipelineScript = generateGitPipeline(jobName, gitUrl);
    const xml = createJenkinsJobXML(pipelineScript);

    // Create Jenkins job
    await jenkinsService.createScanJob(jobName, xml);

    // Trigger the build
    const buildResult = await jenkinsService.triggerJob(jobName);

    // Return success response
    res
      .status(201)
      .json(
        createSuccessResponse({ buildResult }, `Job ${jobName} created and triggered successfully`)
      );

    const buildInfo = await jenkinsService.getBuildStatus(jobName, buildResult.queueItem.number);
  } catch (error) {
    log.error(error);
    next(error);
  }
};

// Trigger a build for an existing job
export const buildJob = async (
  req: Request<CheckJobExistsInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    const { jobName } = req.params;
    const exists = await jenkinsService.checkJobExists(jobName);
    if (exists) {
      // Trigger the build
      const buildResult = await jenkinsService.triggerJob(jobName);
      // Return success response
      res
        .status(201)
        .json(createSuccessResponse({ buildResult }, `Job ${jobName} triggered successfully`));
    } else {
      return res.status(404).json({ error: `Job ${jobName} does not exist` });
    }
  } catch (error) {
    log.error(error);
    next(error);
  }
};
