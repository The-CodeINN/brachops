import { DeploymentList } from '@/components/pages/deploymentList';
import { StatCards } from '@/components/pages/statCards';
import { useDeployments } from '@/queriesAndMutations';
import { JobWithBuildsResponse } from '@/types';

const Deployments = () => {
  const { getJobsWithBuilds } = useDeployments();
  const { data, isLoading, error } = getJobsWithBuilds as {
    data?: JobWithBuildsResponse;
    isLoading: boolean;
    error: Error | null;
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='container mx-auto px-2 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Deployment Overview</h1>
      <div className='space-y-6'>
        <StatCards isLoading={isLoading} jobs={data?.data.jobs} />
        <DeploymentList isLoading={isLoading} jobs={data?.data.jobs} />
      </div>
    </div>
  );
};

export default Deployments;
