import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, Server, Github, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeploymentDetail {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'in-progress';
  timestamp: string;
  environment: string;
  commitHash: string;
  author: string;
  logs: string[];
}

const mockDeployments: DeploymentDetail[] = [
  {
    id: '1',
    name: 'Project Alpha v1.2',
    status: 'success',
    timestamp: '2024-09-13 14:30:00',
    environment: 'Production',
    commitHash: 'a1b2c3d',
    author: 'Jane Doe',
    logs: [
      '[14:30:00] Deployment started',
      '[14:30:05] Pulling latest changes',
      '[14:30:10] Building application',
      '[14:30:30] Running tests',
      '[14:30:45] Deploying to production servers',
      '[14:31:00] Deployment completed successfully',
    ],
  },
  // Add more mock deployments as needed
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

export const DeploymentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deployment = mockDeployments.find((d) => d.id === id);

  if (!deployment) {
    return (
      <div className='container mx-auto px-2 py-8 space-y-8'>
        <h1 className='text-3xl font-bold'>Deployment Not Found</h1>
        <p>The deployment you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/deployments')}>
          Back to Deployments
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-2 py-8 space-y-8'>
      <h1 className='text-3xl font-bold'>Deployment Details</h1>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{deployment.name}</span>
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='flex items-center space-x-2'>
              <Clock className='text-muted-foreground' size={20} />
              <span>{deployment.timestamp}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Server className='text-muted-foreground' size={20} />
              <span>{deployment.environment}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Github className='text-muted-foreground' size={20} />
              <span>{deployment.commitHash}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <User className='text-muted-foreground' size={20} />
              <span>{deployment.author}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div
                className={`p-2 rounded-full ${
                  statusConfig[deployment.status].className
                }`}
              >
                {React.createElement(statusConfig[deployment.status].icon, {
                  size: 20,
                })}
              </div>
              <span>{deployment.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='logs'>
        <TabsList>
          <TabsTrigger value='logs'>Deployment Logs</TabsTrigger>
          <TabsTrigger value='summary'>Summary</TabsTrigger>
        </TabsList>
        <TabsContent value='logs'>
          <Card>
            <CardContent className='p-4'>
              <pre className='bg-muted p-4 rounded-md overflow-x-auto'>
                {deployment.logs.map((log, index) => (
                  <div key={index} className='font-mono text-sm'>
                    {log}
                  </div>
                ))}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='summary'>
          <Card>
            <CardContent className='p-4'>
              <p>
                Deployment summary and additional details can be added here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeploymentDetails;
