import { DeploymentList } from '@/components/pages/deploymentList';
import { ServerErrorPage } from '@/components/pages/serverErrorPage';
import { StatCards } from '@/components/pages/statCards';
import { useDeployments } from '@/queriesAndMutations';

const Deployments = () => {
  const { GetJobsWithBuilds } = useDeployments();
  const { data, isLoading, error } = GetJobsWithBuilds();

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
        <DeploymentList isLoading={isLoading} jobs={data?.data.jobs} />
      </div>
    </div>
  );
};

export default Deployments;
