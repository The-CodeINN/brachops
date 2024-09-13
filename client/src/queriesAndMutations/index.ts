import { DeploymentService } from '@/services/jenkinsService';
import { useQuery } from '@tanstack/react-query';

const useDeployments = () => {
  //   const queryClient = useQueryClient();

  const getJenkinsInfo = useQuery({
    queryKey: ['jenkins'],
    queryFn: async () => {
      const response = await DeploymentService.getDeployments();
      return response.data;
    },
  });

  return { getJenkinsInfo };
};

export { useDeployments };
