import { DeploymentService } from '@/services/jenkinsService';
import { useQuery } from '@tanstack/react-query';

const useDeployments = () => {
  const getJenkinsInfo = useQuery({
    queryKey: ['jenkins'],
    queryFn: async () => {
      const response = await DeploymentService.getDeployments();
      return response.data;
    },
  });

  const getJobsWithBuilds = useQuery({
    queryKey: ['jobsWithBuilds'],
    queryFn: async () => {
      const response = await DeploymentService.getJobsWithBuilds();
      return response.data;
    },
  });

  return { getJenkinsInfo, getJobsWithBuilds };
};

export { useDeployments };
