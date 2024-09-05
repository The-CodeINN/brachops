import Jenkins from "jenkins";
import config from "config";

const userName = config.get<string>("jenkinsUserName");
const password = config.get<string>("jenkinsPassword");
const jenkinsUrl = config.get<string>("jenkinsUrl");

export const jenkins = new Jenkins({
  baseUrl: `http://${userName}:${password}@${jenkinsUrl}`,
  crumbIssuer: true, //
});
