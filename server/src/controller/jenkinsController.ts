import { z } from "zod";
import { type Request, type Response } from "express";
import { log } from "$/utils/logger";
import * as jenkinsService from "$/service/jenkinsService";
import * as validators from "$/validators";
import { createJenkinsJobXML } from "$/helpers/configXml";
import { generatePipeline } from "$/helpers/pipeline";

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
    const {
      gitUrl,
      branchName,
      dockerImage,
      tag,
      kubeDeploymentYaml,
      kubeServiceYaml,
      prometheusYaml,
      grafanaYaml,
      appName,
    } = req.body;
    const { jobName } = req.params;
    console.log(req.body);
    console.log(req.params);
    if (
      !jobName ||
      !gitUrl ||
      !dockerImage ||
      !kubeDeploymentYaml ||
      !kubeServiceYaml ||
      !prometheusYaml ||
      !grafanaYaml ||
      !appName
    ) {
      return res.status(400).json({ error: "Required parameters are missing." });
    }

    const exists = await jenkinsService.checkJobExists(jobName);
    if (!exists) {
      return res.status(404).json({ error: `Job ${jobName} not found.` });
    }
    // Trigger the Jenkins build with the provided parameters
    const result = await jenkinsService.triggerBuild(jobName, {
      gitUrl,
      branchName,
      dockerImage,
      tag,
      kubeDeploymentYaml,
      kubeServiceYaml,
      prometheusYaml,
      grafanaYaml,
      appName,
    });

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
        error
      );
      res.status(500).json({ error: "Failed to get build status" });
    }
  }
};

export const createJenkinsJobHandler = async (req: Request, res: Response) => {
  console.log(req.body), "req.body";

  const { jobName, imageName } = validators.triggerBuildValidator.parse(req.body);
  try {
    // check if job already exists
    const exists = await jenkinsService.checkJobExists(jobName);
    if (exists) {
      return res.status(400).json({ error: `Job ${jobName} already exists` });
    }

    // Generate the pipeline script
    const pipelineScript = generatePipeline(imageName);

    //console.log(pipelineScript), "pipelineScript";

    // Create the Jenkins job
    const xml = createJenkinsJobXML(pipelineScript);

    console.log(xml), "xml";

    const result = await jenkinsService.createJenkinsJob(jobName, xml);

    // trigger the build
    const jobCreated = await jenkinsService.checkJobExists(jobName);
    if (jobCreated) {
      const buildResult = await jenkinsService.triggerJob(jobName);
      console.log(buildResult, "buildResult");

      res.json({ jobCreated, buildResult });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors from Zod
      res.status(400).json({ error: error.errors });
    } else {
      log.error(`Failed to create Jenkins job: ${jobName}`, error);
      res.status(500).json({ error: `Failed to create ${jobName} job` });
    }
  }
};
