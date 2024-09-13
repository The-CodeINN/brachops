import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';

interface Deployment {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'in-progress';
  timestamp: string;
  environment: string;
}

const mockDeployments: Deployment[] = [
  {
    id: '1',
    name: 'Project Alpha v1.2',
    status: 'success',
    timestamp: '2024-09-13 14:30:00',
    environment: 'Production',
  },
  {
    id: '2',
    name: 'Feature Beta Release',
    status: 'failed',
    timestamp: '2024-09-12 09:15:00',
    environment: 'Staging',
  },
  {
    id: '3',
    name: 'Hotfix 1.2.1',
    status: 'in-progress',
    timestamp: '2024-09-13 16:45:00',
    environment: 'Development',
  },
  {
    id: '4',
    name: 'Project Gamma v2.0',
    status: 'success',
    timestamp: '2024-09-11 10:30:00',
    environment: 'Production',
  },
  {
    id: '5',
    name: 'Project Delta v1.0',
    status: 'success',
    timestamp: '2024-09-10 14:30:00',
    environment: 'Production',
  },
  {
    id: '6',
    name: 'Feature Zeta Release',
    status: 'failed',
    timestamp: '2024-09-09 09:15:00',
    environment: 'Staging',
  },
  {
    id: '7',
    name: 'Hotfix 1.2.2',
    status: 'in-progress',
    timestamp: '2024-09-08 16:45:00',
    environment: 'Development',
  },
  {
    id: '8',
    name: 'Project Epsilon v2.0',
    status: 'success',
    timestamp: '2024-09-07 10:30:00',
    environment: 'Production',
  },
  {
    id: '9',
    name: 'Project Theta v1.0',
    status: 'success',
    timestamp: '2024-09-06 14:30:00',
    environment: 'Production',
  },
  {
    id: '10',
    name: 'Feature Iota Release',
    status: 'failed',
    timestamp: '2024-09-05 09:15:00',
    environment: 'Staging',
  },
];

const statusConfig = {
  success: {
    icon: Check,
    className: 'text-green-500 bg-green-100 dark:bg-green-900',
  },
  failed: { icon: X, className: 'text-red-500 bg-red-100 dark:bg-red-900' },
  'in-progress': {
    icon: Clock,
    className: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900',
  },
};

export const DeploymentList: React.FC = () => {
  const navigate = useNavigate();

  const handleDeploymentClick = (id: string) => {
    navigate(`/deployment/${id}`);
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold mb-4'>Recent Deployments</h2>
      {mockDeployments.map((deployment) => (
        <Card
          key={deployment.id}
          className='hover:shadow-md transition-shadow cursor-pointer dark:bg-[#0a0a0a] dark:hover:shadow-lg'
          onClick={() => handleDeploymentClick(deployment.id)}
        >
          <CardContent className='flex items-center justify-between p-4'>
            <div className='flex items-center space-x-4'>
              <div
                className={`p-2 rounded-full ${
                  statusConfig[deployment.status].className
                }`}
              >
                {React.createElement(statusConfig[deployment.status].icon, {
                  size: 20,
                })}
              </div>
              <div>
                <h3 className='font-semibold'>{deployment.name}</h3>
                <p className='text-sm text-muted-foreground'>
                  {deployment.timestamp}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Badge variant='outline'>{deployment.environment}</Badge>
              <Badge
                className={
                  deployment.status === 'success'
                    ? 'text-green-500 bg-green-100 dark:bg-green-900'
                    : deployment.status === 'failed'
                    ? 'text-red-500 bg-red-100 dark:bg-red-900'
                    : 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900'
                }
                variant={
                  deployment.status === 'success'
                    ? 'default'
                    : deployment.status === 'failed'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {deployment.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
