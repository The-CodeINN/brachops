import { type Application } from "express";
import * as jenkinsController from "$/controller/jenkinsController";
import { validateResource } from "$/middlewares/validateResource";
import { checkJobExistsSchema, getBuildStatusSchema, createJobSchema } from "$/schema";

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
};
