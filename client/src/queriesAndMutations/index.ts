import { DeploymentService } from '@/services/jenkinsService';
import { CreateJobInput, CreateScanJobInput } from '@/types';
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const useDeployments = () => {
  const queryClient = useQueryClient();

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

  const CreateDeployment = () =>
    useMutation({
      mutationFn: async (data: CreateJobInput) => {
        const response = await DeploymentService.createDeployment(data);
        return response.data;
      },
      onSuccess: () => {
        const queryKey: InvalidateQueryFilters = {
          queryKey: ['jobsWithBuilds'],
        };
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error) => {
        console.error('Deployment creation failed:', error);
      },
    });

  const CreateScanDeployment = () =>
    useMutation({
      mutationFn: async (data: CreateScanJobInput) => {
        const response = await DeploymentService.createScanDeployment(data);
        return response.data;
      },
      onSuccess: () => {
        const queryKey: InvalidateQueryFilters = {
          queryKey: ['jobsWithBuilds'],
        };
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error) => {
        console.error('Deployment creation failed:', error);
      },
    });

  return {
    GetJenkinsInfo,
    GetJobsWithBuilds,
    CreateDeployment,
    CreateScanDeployment,
  };
};

export { useDeployments };
