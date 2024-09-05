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
    const { gitUrl, branchName, dockerImage, tag, kubeDeploymentYaml, kubeServiceYaml, prometheusYaml, grafanaYaml, appName } = req.body;
    const { jobName } = req.params;
    console.log(req.body);
    console.log(req.params);
    if (!jobName || !gitUrl || !dockerImage || !kubeDeploymentYaml || !kubeServiceYaml || !prometheusYaml || !grafanaYaml || !appName) {
      return res.status(400).json({ error: "Required parameters are missing." });
    }

    const exists = await jenkinsService.checkJobExists(jobName);
    if (!exists) {
      return res.status(404).json({ error: `Job ${jobName} not found.` });
    }
    // Trigger the Jenkins build with the provided parameters
    const result = await jenkinsService.triggerBuild(jobName, {
      gitUrl, branchName, dockerImage, tag, kubeDeploymentYaml, kubeServiceYaml, prometheusYaml, grafanaYaml, appName
    });

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
