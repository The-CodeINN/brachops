import Jenkins from "jenkins";
import config from "config";

const userName = config.get<string>("jenkins.jenkinsUserName");
const password = config.get<string>("jenkins.jenkinsPassword");
const jenkinsUrl = config.get<string>("jenkins.jenkinsUrl");

export const jenkins = new Jenkins({
  baseUrl: `http://${userName}:${password}@${jenkinsUrl}`,
  crumbIssuer: true, //
});
