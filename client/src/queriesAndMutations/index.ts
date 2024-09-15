import { DeploymentService } from '@/services/jenkinsService';
import { useQuery } from '@tanstack/react-query';

const useDeployments = () => {
  const GetJenkinsInfo = () =>
    useQuery({
      queryKey: ['jenkins'],
      queryFn: async () => {
        const response = await DeploymentService.getDeployments();
        return response.data;
      },
    });

  const GetJobsWithBuilds = () =>
    useQuery({
      queryKey: ['jobsWithBuilds'],
      queryFn: async () => {
        const response = await DeploymentService.getJobsWithBuilds();
        return response.data;
      },
    });

  return { GetJenkinsInfo, GetJobsWithBuilds };
};

export { useDeployments };
