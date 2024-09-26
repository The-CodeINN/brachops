import { DeploymentService } from "@/services/jenkinsService";
import { CreateJobInput, CreateScanJobInput } from "@/types";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const useDeployments = () => {
  const queryClient = useQueryClient();

  const GetJenkinsInfo = () =>
    useQuery({
      queryKey: ["jenkins"],
      queryFn: async () => {
        const response = await DeploymentService.getDeployments();
        return response.data;
      },
    });

  const GetJobsWithBuilds = () =>
    useQuery({
      queryKey: ["jobsWithBuilds"],
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
          queryKey: ["jobsWithBuilds"],
        };
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error) => {
        console.error("Deployment creation failed:", error);
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
          queryKey: ["jobsWithBuilds"],
        };
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error) => {
        console.error("Deployment creation failed:", error);
      },
    });

  const DeleteJob = () =>
    useMutation({
      mutationFn: async (jobName: string) => {
        const response = await DeploymentService.deleteJob(jobName);
        return response.data;
      },
      onSuccess: () => {
        const queryKey: InvalidateQueryFilters = {
          queryKey: ["jobsWithBuilds"],
        };
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error) => {
        console.error("Job deletion failed:", error);
      },
    });

  const GetDeploymentBuildStatus = (jobName: string) => {
    return useQuery({
      queryKey: ["deploymentStatus", jobName],
      queryFn: async () => {
        const response = await DeploymentService.getDeploymentBuildStatus(
          jobName
        );
        return response.data;
      },
    });
  };

  const GetBuildDetails = (jobName: string, buildId: string) => {
    return useQuery({
      queryKey: ["buildDetails", jobName, buildId],
      queryFn: async () => {
        if (!jobName || !buildId) {
          throw new Error("Job name or build ID is missing");
        }
        const response = await DeploymentService.getBuildDetails(
          jobName,
          buildId
        );
        return response.data;
      },
      enabled: !!jobName && !!buildId,
    });
  };

  const GetSonarAnalysis = (projectKey: string) => {
    return useQuery({
      queryKey: ["sonarAnalysis"],
      queryFn: async () => {
        const response = await DeploymentService.getSonarAnalysis(projectKey);
        return response.data;
      },
    });
  };

  return {
    GetJenkinsInfo,
    GetJobsWithBuilds,
    CreateDeployment,
    CreateScanDeployment,
    DeleteJob,
    GetDeploymentBuildStatus,
    GetBuildDetails,
    GetSonarAnalysis,
  };
};

export { useDeployments };
