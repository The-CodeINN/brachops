import Jenkins from "jenkins";
import config from "config";
import { NewJenkinsClient } from "$/custom/customJenkinClients";

const userName = config.get<string>("jenkins.jenkinsUserName");
const password = config.get<string>("jenkins.jenkinsPassword");
const jenkinsUrl = config.get<string>("jenkins.jenkinsUrl");
const jenkinsCustomUrl = config.get<string>("jenkins.jenkinsCustomUrl");
const jenkinsUserToken = config.get<string>("jenkins.jenkinsUserToken");

export const jenkins = new Jenkins({
  baseUrl: `http://${userName}:${password}@${jenkinsUrl}`,
  crumbIssuer: true, //
});

export const customJenkinsClient = new NewJenkinsClient(
  jenkinsCustomUrl,
  userName,
  jenkinsUserToken
);
