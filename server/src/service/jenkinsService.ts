import { jenkins } from "$/utils/jenkinsClient";

export const getJenkinsInfo = async () => {
  // console.log(jenkins);
  return await jenkins.info();
};

export const checkJobExists = async (jobName: string) => {
  return await jenkins.job.exists(jobName);
};

export const getBuildInfo = async (jobName: string, buildNumber: number) => {
  return await jenkins.build.get(jobName, buildNumber);
};

export const triggerBuild = async (jobName: string, parameters: any) => {
  const buildOptions = {
    parameters: {
      GIT_URL: parameters.gitUrl,
      BRANCH_NAME: parameters.branchName,
      DOCKER_IMAGE: parameters.dockerImageName,
      TAG: parameters.tag,
      KUBE_DEPLOYMENT_YAML: parameters.kubeDeploymentYaml,
      KUBE_SERVICE_YAML: parameters.kubeServiceYaml,
      PROMETHEUS_YAML: parameters.prometheusYaml,
      GRAFANA_YAML: parameters.grafanaYaml,
      APP_NAME: parameters.appName,
    },
  };
  const queueItem = await jenkins.job.build({ name: jobName, parameters: buildOptions.parameters });
  return { queueItem };
};

export const createJenkinsJob = async (jobName: string, jobConfigXml: string) => {
  await jenkins.job.create(jobName, jobConfigXml);
};

export const getBuildStatus = async (jobName: string, buildNumber: number) => {
  const buildInfo = await jenkins.build.get(jobName, buildNumber);
  return {
    buildInfo,
  };
};
