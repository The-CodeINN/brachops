import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  MINIKUBE_URL: string;
  jenkins: {
    jenkinsUrl: string;
    jenkinsUserName: string;
    jenkinsPassword: string;
    jenkinsCustomUrl: string;
    jenkinsUserToken: string | undefined;
  };
  SONARQUBE_URL: string;
  SONARQUBE_API_TOKEN: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  jenkins: {
    jenkinsUrl: process.env.JENKINS_URL || "localhost:8080",
    jenkinsUserName: process.env.JENKINS_USERNAME || "",
    jenkinsPassword: process.env.JENKINS_PASSWORD || "",
    jenkinsCustomUrl: process.env.JENKINS_CUSTOM_URL || "",
    jenkinsUserToken: process.env.JENKINS_USER_TOKEN,
  },
  MINIKUBE_URL: process.env.MINIKUBE_URL || "",
  SONARQUBE_URL: process.env.SONARQUBE_URL || "",
  SONARQUBE_API_TOKEN: process.env.SONARQUBE_API_TOKEN || "",
};

export default config;
