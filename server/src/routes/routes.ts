import { type Application } from "express";
import * as jenkinsController from "$/controller/jenkinsController";

export const routes = (app: Application) => {
  app.get("/health", (req, res) => res.status(200).send("OK"));

  app.get("/jenkins/info", jenkinsController.getJenkinsInfoHandler); // http://localhost:3000/jenkins/info
  app.get("/jenkins/job/:jobName", jenkinsController.checkJobExistsHandler); // http://localhost:3000/jenkins/job/MyJob
  app.post("/jenkins/job/:jobName/build", jenkinsController.triggerBuildHandler); // http://localhost:3000/jenkins/job/MyJob/build
  app.get("/jenkins/job/:jobName/build/:buildNumber", jenkinsController.getBuildStatusHandler); // http://localhost:3000/jenkins/job/MyJob/build/1
};
