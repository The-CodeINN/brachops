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
} from "$/schema";

export const routes = (app: Application) => {
  app.get("/health", (req, res) => res.status(200).send("OK")); // http://localhost:3000/health

  app.get("/jenkins/info", jenkinsController.getJenkinsInfoHandler); // http://localhost:3000/jenkins/info
  app.get(
    "/jenkins/job/:jobName",
    validateResource(checkJobExistsSchema),
    jenkinsController.checkJobExistsHandler
  ); // http://localhost:3000/jenkins/job/MyJob
  app.get(
    "/jenkins/job/:jobName/build/:buildNumber",
    validateResource(getBuildStatusSchema),
    jenkinsController.getBuildStatusHandler
  ); // http://localhost:3000/jenkins/job/MyJob/build/1
  app.post(
    "/jenkins/job",
    validateResource(createJobSchema),
    jenkinsController.createJenkinsJobHandler
  ); // http://localhost:3000/jenkins/job

  app.get(
    "/jenkins/job/:jobName/build/:buildNumber/log",
    validateResource(getBuildLogSchema),
    jenkinsLogController.getBuildLogHandler
  ); // http://localhost:3000/jenkins/job/MyJob/build/1/log or http://localhost:3000/jenkins/job/MyJob/build/1/log?start=0&type=text&meta=true or http://localhost:3000/jenkins/job/MyJob/build/1/log?start=0&type=html&meta=true

  app.get(
    "/jenkins/job/:jobName/build/:buildNumber/log/stream",
    validateResource(streamBuildLogSchema),
    jenkinsLogController.streamBuildLogHandler
  ); // http://localhost:3000/jenkins/job/MyJob/build/1/log/stream or http://localhost:3000/jenkins/job/MyJob/build/1/log/stream?type=text&delay=1000 or http://localhost:3000/jenkins/job/MyJob/build/1/log/stream?type=html&delay=1000

  app.get("/jenkins/job/:jobName/build/:buildNumber/stop", jenkinsController.stopBuildHandler); // http://localhost:3000/jenkins/job/MyJob/build/1/stop

  app.delete("/jenkins/job/:jobName", jenkinsController.deleteJobHandler); // http://localhost:3000/jenkins/job/MyJob

  app.get("/jenkins/jobs", jenkinsController.listJobsHandler); // http://localhost:3000/jenkins/jobs
};
