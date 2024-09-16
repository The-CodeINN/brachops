import { DeploymentList } from '@/components/pages/deploymentList';
import { ServerErrorPage } from '@/components/pages/serverErrorPage';
import { StatCards } from '@/components/pages/statCards';
import { useDeployments } from '@/queriesAndMutations';
import { toast } from 'sonner';

const Deployments = () => {
  const { GetJobsWithBuilds, DeleteJob } = useDeployments();
  const { data, isLoading, error } = GetJobsWithBuilds();
  const deleteJobMutation = DeleteJob();

  const handleDeleteJob = async (jobName: string) => {
    toast.promise(deleteJobMutation.mutateAsync(jobName), {
      loading: 'Deleting job...',
      success: () => `Successfully deleted job: ${jobName}`,
      error: (error) => `Failed to delete job: ${error?.message}`,
    });
  };

  if (error)
    return (
      <div className=' md:pt-10'>
        <ServerErrorPage error={error as unknown as Error} />
      </div>
    );

  return (
    <div className='container mx-auto px-2 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Deployment Overview</h1>
      <div className='space-y-6'>
        <StatCards isLoading={isLoading} jobs={data?.data.jobs} />
        <DeploymentList
          onDelete={handleDeleteJob}
          isLoading={isLoading}
          jobs={data?.data.jobs}
        />
      </div>
    </div>
  );
};

export default Deployments;
