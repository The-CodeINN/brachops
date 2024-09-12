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

export const triggerJob = async (jobName: string) => {
  const queueItem = await jenkins.job.build({ name: jobName });
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

// stop build
export const stopBuild = async (jobName: string, buildNumber: number) => {
  await jenkins.build.stop(jobName, buildNumber);
}

// delete job
export const deleteJob = async (jobName: string) => {
  await jenkins.job.destroy(jobName);
}

// list job 
export const listJob = async () => {
  return await jenkins.job.list();
}
export const createCredentials = async (credentials: any) => {
  //@ts-expect-error - The type definitions for the jenkins-client library are incorrect
  return await jenkins.credentials.create(credentials);
};
