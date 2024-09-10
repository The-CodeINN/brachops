import { type Application } from "express";
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
};
