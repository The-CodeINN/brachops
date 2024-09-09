import { type Request, type Response, type NextFunction } from "express";
import { log } from "$/utils/logger";
import * as jenkinsService from "$/service/jenkinsService";
import { createJenkinsJobXML } from "$/helpers/configXml";
import { generatePipeline } from "$/helpers/pipeline";
import { type GetBuildStatusInput, type CheckJobExistsInput, type CreateJobInput } from "$/schema";
import { createSuccessResponse } from "$/utils/apiResponse";

interface JobInfo {
  name: string;
  url: string;
  color: string;
}

interface JenkinsInfo {
  numExecutors: number;
  jobs: JobInfo[];
  url: string;
}

interface BuildInfo {
  fullDisplayName: string;
  number: number;
  result: string;
  url: string;
  duration: number;
  parameters?: any; 
}

export const getJenkinsInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const info: JenkinsInfo = await jenkinsService.getJenkinsInfo();

    // Extract relevant information
    const relevantInfo = {
      numExecutors: info.numExecutors,
      jobs: info.jobs.map((job: JobInfo) => ({
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

export const getBuildStatusHandler = async (
  req: Request<GetBuildStatusInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName, buildNumber } = req.params;
    const status: { buildInfo: BuildInfo } = await jenkinsService.getBuildStatus(jobName, parseInt(buildNumber, 10));

    // Extract relevant information from status
    const relevantInfo = {
      fullDisplayName: status.buildInfo.fullDisplayName,
      number: status.buildInfo.number,
      result: status.buildInfo.result,
      url: status.buildInfo.url,
      duration: status.buildInfo.duration,
      parameters: status.buildInfo.parameters
    };

    res.json(createSuccessResponse(relevantInfo, "Build status retrieved successfully"));
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
    res.status(201).json(createSuccessResponse({ buildResult }, `Job ${jobName} created and triggered successfully`));
  } catch (error) {
    log.error(error);
    next(error);
  }
};