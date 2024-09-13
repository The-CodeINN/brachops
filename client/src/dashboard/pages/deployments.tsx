import { DeploymentList } from '@/components/pages/deploymentList';
import { StatCards } from '@/components/pages/statCards';

const Deployments = () => {
  return (
    <div className='container mx-auto px-2 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Deployment Overview</h1>
      <div className='space-y-6'>
        <StatCards />
        <DeploymentList />
      </div>
    </div>
  );
};

export default Deployments;
