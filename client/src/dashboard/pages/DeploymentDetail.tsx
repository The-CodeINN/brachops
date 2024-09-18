import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, Server, Github, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeployments } from '@/queriesAndMutations';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig = {
  SUCCESS: {
    icon: Check,
    className: 'text-green-500 bg-green-100 dark:bg-green-900',
  },
  FAILURE: { icon: X, className: 'text-red-500 bg-red-100 dark:bg-red-900' },
  IN_PROGRESS: {
    icon: Clock,
    className: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900',
  },
};

export const DeploymentDetails: React.FC = () => {
  const { jobName, buildId } = useParams<{
    jobName: string;
    buildId: string;
  }>();
  console.log('jobName:', jobName, 'buildId:', buildId);
  const navigate = useNavigate();
  const { GetBuildDetails, GetDeploymentBuildStatus } = useDeployments();

  const {
    data: buildDetailsResponse,
    isLoading: isBuildDetailsLoading,
    error: buildDetailsError,
  } = GetBuildDetails(jobName || '', buildId || '');

  const {
    data: buildStatusResponse,
    isLoading: isBuildStatusLoading,
    error: buildStatusError,
  } = GetDeploymentBuildStatus(jobName || '');

  if (isBuildDetailsLoading || isBuildStatusLoading) {
    return <LoadingSkeleton />;
  }

  if (buildDetailsError || buildStatusError) {
    return (
      <ErrorDisplay
        error={buildDetailsError}
        onBack={() => navigate('/deployments')}
      />
    );
  }

  if (!buildDetailsResponse?.data || !buildStatusResponse) {
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

  const details = buildDetailsResponse.data;
  const buildStatus = buildStatusResponse;

  // Dummy data for missing fields
  const dummyStatus = {
    result: details.result,
    timestamp: new Date().toISOString(),
    builtOn: 'Jenkins Server 1',
    commitHash: 'abc123',
    author: 'John Doe',
    logs: ['Log entry 1', 'Log entry 2', 'Log entry 3'],
  };

  return (
    <div className='container mx-auto px-2 py-8 space-y-8'>
      <h1 className='text-3xl font-bold'>Deployment Details</h1>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{details.fullDisplayName}</span>
            <Badge
              className={
                statusConfig[details.result as keyof typeof statusConfig]
                  ?.className
              }
              variant={
                details.result === 'SUCCESS'
                  ? 'default'
                  : details.result === 'FAILURE'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {details.result}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='flex items-center space-x-2'>
              <Clock className='text-muted-foreground' size={20} />
              <span>{new Date(dummyStatus.timestamp).toLocaleString()}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Server className='text-muted-foreground' size={20} />
              <span>{dummyStatus.builtOn}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Github className='text-muted-foreground' size={20} />
              <span>{dummyStatus.commitHash}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <User className='text-muted-foreground' size={20} />
              <span>{dummyStatus.author}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div
                className={`p-2 rounded-full ${
                  statusConfig[details.result as keyof typeof statusConfig]
                    ?.className
                }`}
              >
                {React.createElement(
                  statusConfig[details.result as keyof typeof statusConfig]
                    ?.icon,
                  {
                    size: 20,
                  }
                )}
              </div>
              <span>{details.result}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='logs'>
        <TabsList>
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          <TabsTrigger value='logs'>Deployment Logs</TabsTrigger>
        </TabsList>
        <TabsContent value='logs'>
          <Card>
            <CardContent className='p-4'>
              <pre className='bg-muted p-4 rounded-md overflow-x-auto'>
                {dummyStatus.logs.map((log: string, index: number) => (
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
                Build Number: {details.number}
                <br />
                Result: {details.result}
                <br />
                Duration: {details.duration / 1000} seconds
                <br />
              </p>
              <h3 className='text-lg font-semibold mt-6'>Build Status</h3>
              <p>
                Deployment Name: {buildStatus.status}
                <br />
                URL:
                <a
                  href={buildStatus.appUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {buildStatus.appUrl}
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className='container mx-auto px-2 py-8 space-y-8'>
    <Skeleton className='h-10 w-1/4' />
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-3/4' />
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className='h-6 w-full' />
          ))}
        </div>
      </CardContent>
    </Card>
    <Skeleton className='h-40 w-full' />
  </div>
);

interface ErrorDisplayProps {
  error: Error | null;
  onBack: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onBack }) => (
  <div className='container mx-auto px-2 py-8 space-y-8'>
    <h1 className='text-3xl font-bold'>Error</h1>
    <p>An error occurred while fetching deployment details: {error?.message}</p>
    <Button onClick={onBack}>Back to Deployments</Button>
  </div>
);

export default DeploymentDetails;
