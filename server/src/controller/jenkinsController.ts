import { type Request, type Response, type NextFunction } from "express";
import { log } from "$/utils/logger";
import * as jenkinsService from "$/service/jenkinsService";
import { createJenkinsJobXML } from "$/helpers/configXml";
import { generatePipeline } from "$/helpers/pipeline";
import { ScanCodePipeline } from "$/helpers/ScanCodePipeline";
import {
  type GetBuildStatusInput,
  type CheckJobExistsInput,
  type CreateJobInput,
  type CreateScanJobInput,
} from "$/schema";
import { createErrorResponse, createSuccessResponse } from "$/utils/apiResponse";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import _ from "lodash";
import config from "config";

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

interface JobInfo {
  name: string;
  url: string;
  color: string;
}

interface Build {
  number: number;
  result: string;
  duration: number;
  url: string;
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

const sanitizeName = (name: string): string => {
  // Remove non-alphanumeric characters and convert to lowercase
  let sanitized = name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();

  // Remove the 'deploy-' prefix if it exists
  if (sanitized.startsWith("deploy-")) {
    sanitized = sanitized.substring(7);
  }

  return sanitized;
};

const validateFilePath = (filePath: string): string => {
  // Ensure the path is resolved relative to a known safe directory
  const resolvedPath = path.resolve(filePath);

  // check if the resolved path is within a specific directory to prevent directory traversal
  const allowedDirectory = path.resolve("/tmp"); // only allow access to /tmp
  if (!resolvedPath.startsWith(allowedDirectory)) {
    throw new Error("Invalid file path");
  }

  return resolvedPath;
};

const deleteNamespace = async (namespace: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const kubectlProcess = spawn("kubectl", ["delete", "namespace", namespace]);

    kubectlProcess.stdout.on("data", (data) => {
      console.log(`Namespace deletion stdout: ${data}`);
    });

    kubectlProcess.stderr.on("data", (data) => {
      console.warn(`Namespace deletion stderr: ${data}`);
    });

    kubectlProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`kubectl delete namespace process exited with code ${code}`));
      }
    });
  });
};

const deleteJenkinsJob = async (jobName: string) => {
  try {
    await jenkinsService.deleteJob(jobName);
  } catch (error) {
    log.error(`Error deleting Jenkins job: ${error}`);
    throw error;
  }
};

// Get Jenkins info
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
    const status: { buildInfo: BuildInfo } = await jenkinsService.getBuildStatus(
      jobName,
      parseInt(buildNumber, 10)
    );
    // Extract relevant information from status
    const relevantInfo = {
      fullDisplayName: status.buildInfo.fullDisplayName,
      number: status.buildInfo.number,
      result: status.buildInfo.result,
      url: status.buildInfo.url,
      duration: status.buildInfo.duration,
      parameters: status.buildInfo.parameters,
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
    const { jobName, imageName, projectType, envVars } = req.body;
    console.log(req.body);

    // Check if job already exists
    if (await jenkinsService.checkJobExists(jobName)) {
      return res.status(409).json({ error: `Job ${jobName} already exists` });
    }

    // Generate pipeline script and XML configuration
    const pipelineScript = generatePipeline(imageName, projectType, envVars ?? {}, jobName);
    const xml = createJenkinsJobXML(pipelineScript);

    // Create Jenkins job
    await jenkinsService.createJenkinsJob(jobName, xml);

    // Trigger the build
    await jenkinsService.triggerJob(jobName);

    // Return success response
    res
      .status(201)
      .json(createSuccessResponse({}, `Job ${jobName} created and triggered successfully`));
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const getDeploymentStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobName } = req.params;
    const sanitizedJobName = sanitizeName(jobName);
    const filePath = validateFilePath(path.join("/tmp", `${sanitizedJobName}_url.txt`));
    log.info(`Checking for app URL at: ${filePath}`);

    if (fs.existsSync(filePath)) {
      const appUrl = fs.readFileSync(filePath, "utf8").trim();
      log.info(`App URL found: ${appUrl}`);
      res.json({ status: "completed", appUrl });
    } else {
      log.info("App URL not found, deployment in progress");
      res.json({ status: "in-progress" });
    }
  } catch (error) {
    log.error(`Error checking deployment status: ${error}`);
  }
};

export const stopBuildHandler = async (
  req: Request<GetBuildStatusInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName, buildNumber } = req.params;

    // Stop the build
    await jenkinsService.stopBuild(jobName, parseInt(buildNumber, 10));

    // Return success response
    res.json(createSuccessResponse({}, `Build ${buildNumber} stopped successfully`));
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
    const { jobName, gitUrl, buildPath, projectType } = req.body;

    const exists = await jenkinsService.checkJobExists(jobName);
    if (exists) {
      return res.status(409).json({ error: `Job ${jobName} already exists` });
    }

    // Generate pipeline script and XML configuration
    const pipelineScript = ScanCodePipeline(jobName, gitUrl, buildPath, projectType);
    const xml = createJenkinsJobXML(pipelineScript);

    // Create Jenkins job
    await jenkinsService.createScanJob(jobName, xml);

    // Trigger the build
    await jenkinsService.triggerJob(jobName);

    // Return success response
    res
      .status(201)
      .json(createSuccessResponse({}, `Job ${jobName} created and triggered successfully`));
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

export const deleteJobHandler = async (
  req: Request<CheckJobExistsInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName } = req.params;
    const namespace = sanitizeName(jobName); // Remove the deploy- prefix if present

    // Delete Jenkins job
    await deleteJenkinsJob(jobName);

    // Delete K8s namespace
    await deleteNamespace(namespace);

    res.json(
      createSuccessResponse(
        {},
        `Job ${jobName} and associated Kubernetes resources deleted successfully`
      )
    );
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const listJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await jenkinsService.listJob();
    res.json(createSuccessResponse({ jobs }, `Jobs listed successfully`));
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const getJobWithBuildsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await jenkinsService.listJob();

    // Process each job and get its builds
    const jobsWithBuilds = await Promise.all(
      jobs.map(async (job: JobInfo) => {
        const jobInfo = await jenkinsService.getJobWithBuilds(job.name);
        return {
          name: job.name,
          url: job.url,
          color: job.color,
          builds: jobInfo.allBuilds.map((build: Build) => ({
            number: build.number,
            result: build.result,
            duration: build.duration,
            url: build.url,
          })),
        };
      })
    );

    res.json(
      createSuccessResponse({ jobs: jobsWithBuilds }, "Jobs with builds listed successfully")
    );
  } catch (error) {
    log.error(error);
    next(error);
  }
};

// Store payloads per job/project (in memory for now)
let sonarQubePayloads: { [key: string]: any } = {}; // projectKey or taskId

export const handleSonarQubeWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload || !payload.taskId) {
      log.error("No status found for Scan Analysis payload");
      return res.status(400).send("Invalid webhook payload");
    }
    log.info("Received SonarQube webhook");

    // Storing the payload in memory
    //lastSonarQubePayload = payload;

    // Extracting details from the payload object
    const {
      taskId,
      status,
      project: { key: projectKey, name: projectName, url: sonarAnalysisUrl },
      branch: { isMain },
      analysedAt,
      qualityGate: { conditions, status: sonarGateStatus },
    } = payload;

    // Store the payload by the projectKey or taskId
    sonarQubePayloads[projectKey] = payload;

    // Logging the details
    console.log(`Task ID: ${taskId}`);
    console.log(`Project Status: ${status}`);
    console.log(`Project Key: ${projectKey}`);
    console.log(`Project Name: ${projectName}`);
    console.log(`Is Main Branch: ${isMain}`);
    console.log(`Sonar URL: ${sonarAnalysisUrl}`);
    console.log(`Analysed At: ${analysedAt}`);
    console.log(`Quality Gate Status: ${sonarGateStatus}`);
    console.log("Quality Gate Conditions \n" + JSON.stringify(conditions, null, 2));

    // Sending the response after logging
    return res.json(createSuccessResponse({ payload }, "Scan Analysis Received"));
  } catch (error) {
    log.error(`Error handling SonarQube webhook: ${error}`);
    res.status(500).send("Error handling SonarQube webhook");
  }
};

const ngrokUrl = config.get<string>("NGROK_URL");

export const getSonarQubeAnalysisForJob = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectKey } = req.params;

    if (!projectKey) {
      return res.status(400).send("Project Key is required");
    }

    const payload = sonarQubePayloads[projectKey];

    if (!payload) {
      return res.status(404).send(`No analysis data available for project: ${projectKey}`);
    }

    console.log("ngrokUrl: ", ngrokUrl);
    const {
      taskId,
      status,
      project: { name: projectName, url: sonarAnalysisUrl },
      branch: { isMain },
      analysedAt,
    } = payload;

    const publicSonarUrl = sonarAnalysisUrl.replace("http://localhost:9000", ngrokUrl);

    res.json(
      createSuccessResponse(
        {
          taskId,
          status,
          projectKey,
          projectName,
          publicSonarUrl,
          isMain,
          analysedAt,
        },
        "SonarQube analysis retrieved successfully"
      )
    );
  } catch (error) {
    log.error(error);
    next(error);
  }
};

// export const getSonarQubeAnalysis = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     if (!lastSonarQubePayload) {
//       return res.json(createErrorResponse("No SonarQube analysis found"));
//     }

//     const {
//       taskId,
//       status,
//       project: { key: projectKey, name: projectName, url: sonarAnalysisUrl },
//       branch: { isMain },
//       analysedAt,
//     } = lastSonarQubePayload;

//     res.json(
//       createSuccessResponse(
//         {
//           taskId,
//           status,
//           projectKey,
//           projectName,
//           sonarAnalysisUrl,
//           isMain,
//           analysedAt,
//         },
//         "SonarQube analysis retrieved successfully"
//       )
//     );
//   } catch (error) {
//     log.error(error);
//     next(error);
//   }
// };
