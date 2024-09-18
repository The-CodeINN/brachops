import { type Application, Request, Response } from "express";
import { Server } from "socket.io";
import * as jenkinsController from "$/controller/jenkinsController";
import * as jenkinsLogController from "$/controller/jenkinsLogController";
import { validateResource } from "$/middlewares/validateResource";
import {
  checkJobExistsSchema,
  getBuildStatusSchema,
  createJobSchema,
  getBuildLogSchema,
  streamBuildLogSchema,
  createScanJobSchema,
} from "$/schema";
import rateLimit from "express-rate-limit";
import { jenkins } from "$/utils/jenkinsClient";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

export const routes = (app: Application) => {
  // Health check
  app.get("/health", (req, res) => res.status(200).send("OK")); // http://localhost:3000/health

  // Get Jenkins info
  app.get("/jenkins/info", jenkinsController.getJenkinsInfoHandler); // http://localhost:3000/jenkins/info

  // Check if a job exists
  app.get(
    "/jenkins/job/:jobName",
    validateResource(checkJobExistsSchema),
    jenkinsController.checkJobExistsHandler
  ); // http://localhost:3000/jenkins/job/MyJob

  // Get build status
  app.get(
    "/jenkins/job/:jobName/build/:buildNumber",
    validateResource(getBuildStatusSchema),
    jenkinsController.getBuildStatusHandler
  ); // http://localhost:3000/jenkins/job/MyJob/build/1

  // Get deployment status
  app.get("/jenkins/deployment-status/:jobName", limiter, jenkinsController.getDeploymentStatus); // http://localhost:3000/jenkins/deployment-status/MyJob

  // Create a Jenkins job and trigger it
  app.post(
    "/jenkins/job",
    validateResource(createJobSchema),
    jenkinsController.createJenkinsJobHandler
  ); // http://localhost:3000/jenkins/job

  // Get build log
  app.get(
    "/jenkins/job/:jobName/build/:buildNumber/log",
    validateResource(getBuildLogSchema),
    jenkinsLogController.getBuildLogHandler
  ); // http://localhost:3000/jenkins/job/MyJob/build/1/log or http://localhost:3000/jenkins/job/MyJob/build/1/log?start=0&type=text&meta=true or http://localhost:3000/jenkins/job/MyJob/build/1/log?start=0&type=html&meta=true

  // Stream build log

  app.get(
    "/jenkins/job/:jobName/build/:buildNumber/log/stream",
    validateResource(streamBuildLogSchema),
    jenkinsLogController.streamBuildLogHandler
  ); // http://localhost:3000/jenkins/job/MyJob/build/1/log/stream or http://localhost:3000/jenkins/job/MyJob/build/1/log/stream?type=text&delay=1000 or http://localhost:3000/jenkins/job/MyJob/build/1/log/stream?type=html&delay=1000

  // Stop a build
  app.get("/jenkins/job/:jobName/build/:buildNumber/stop", jenkinsController.stopBuildHandler); // http://localhost:3000/jenkins/job/MyJob/build/1/stop

  // Delete a job
  app.delete("/jenkins/job/:jobName", jenkinsController.deleteJobHandler); // http://localhost:3000/jenkins/job/MyJob

  // List all jobs
  app.get("/jenkins/jobs", jenkinsController.listJobsHandler); // http://localhost:3000/jenkins/jobs

  // Trigger a build
  app.post(
    "/jenkins/job/:jobName",
    validateResource(checkJobExistsSchema),
    jenkinsController.buildJob
  ); // http://localhost:3000/jenkins/job/jobName

  // Create a Jenkins scan job and trigger it
  app.post(
    "/jenkins/scan/",
    validateResource(createScanJobSchema),
    jenkinsController.createScanJobHandler
  ); // http://localhost:3000/jenkins/scan

  // Get job with builds
  app.get("/jenkins/jobsWithBuilds", jenkinsController.getJobWithBuildsHandler); // http://localhost:3000/jenkins/jobsWithBuilds

  // app.get(
  //   "/jenkins/pipelines/:jobName/runs/:buildNumber/nodes",
  //   validateResource(getBuildStatusSchema),
  //   jenkinsLogController.getBuildStageHandler
  // ); //http://localhost:3000/jenkins/pipelines/:jobName/runs/:buildNumber/nodes

  app.post("/sonarqube", jenkinsController.handleSonarQubeWebhook); // http://localhost:3000/sonarqube
};
