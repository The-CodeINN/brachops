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

export const triggerBuild = async (jobName: string, imageName: string) => {
  const buildOptions = {
    parameters: { IMAGE_NAME: imageName },
  };
  const queueItem = await jenkins.job.build({ name: jobName, parameters: buildOptions.parameters });
  return { queueItem };
};

export const getBuildStatus = async (jobName: string, buildNumber: number) => {
  const buildInfo = await jenkins.build.get(jobName, buildNumber);
  return {
    buildInfo,
  };
};
