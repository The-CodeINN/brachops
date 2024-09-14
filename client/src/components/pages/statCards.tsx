import { Check, Clock, Rocket, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { JobWithBuilds } from '@/types';

interface StatCardsProps {
  isLoading: boolean;
  jobs?: JobWithBuilds[];
}

export const StatCards: React.FC<StatCardsProps> = ({ isLoading, jobs }) => {
  const totalDeployments =
    jobs?.reduce((acc, job) => acc + (job.builds?.length || 0), 0) || 0;
  const successfulDeployments =
    jobs?.reduce(
      (acc, job) =>
        acc +
        (job.builds?.filter((build) => build.result === 'SUCCESS').length || 0),
      0
    ) || 0;
  const successRate =
    totalDeployments > 0 ? (successfulDeployments / totalDeployments) * 100 : 0;

  const avgDeployTime =
    jobs?.reduce((acc, job) => {
      const jobAvg =
        job.builds?.reduce((sum, build) => sum + build.duration, 0) || 0;
      return acc + jobAvg / (job.builds?.length || 1);
    }, 0) || 0;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <DeploymentCard
        title='Total Deployments'
        value={
          isLoading ? (
            <Skeleton className='h-8 w-20' />
          ) : (
            totalDeployments.toString()
          )
        }
        pillText={`${totalDeployments > 0 ? '+' : ''}${totalDeployments}`}
        trend='up'
        period='All time'
        icon={Rocket}
        isLoading={isLoading}
      />
      <DeploymentCard
        title='Avg. Deploy Time'
        value={
          isLoading ? (
            <Skeleton className='h-8 w-20' />
          ) : (
            formatTime(avgDeployTime)
          )
        }
        pillText='N/A'
        trend='down'
        period='All builds'
        icon={Clock}
        isLoading={isLoading}
      />
      <DeploymentCard
        title='Success Rate'
        value={
          isLoading ? (
            <Skeleton className='h-8 w-20' />
          ) : (
            `${successRate.toFixed(1)}%`
          )
        }
        pillText={`${successRate > 50 ? '+' : '-'}${Math.abs(
          successRate - 50
        ).toFixed(1)}%`}
        trend={successRate >= 50 ? 'up' : 'down'}
        period='All builds'
        icon={Check}
        isLoading={isLoading}
      />
    </div>
  );
};

// DeploymentCard Component
interface DeploymentCardProps {
  title: string;
  value: React.ReactNode;
  pillText: string;
  trend: 'up' | 'down';
  period: string;
  icon: React.ElementType;
  isLoading: boolean;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({
  title,
  value,
  pillText,
  trend,
  period,
  icon: Icon,
  isLoading,
}) => {
  return (
    <Card className='dark:bg-[#0a0a0a] dark:shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {isLoading ? (
          <Skeleton className='h-4 w-4' />
        ) : (
          <Icon className='h-4 w-4 text-muted-foreground' />
        )}
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='text-2xl font-bold'>{value}</div>
          {!isLoading && (
            <span
              className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
                trend === 'up'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className='h-3 w-3' />
              ) : (
                <TrendingDown className='h-3 w-3' />
              )}{' '}
              {pillText}
            </span>
          )}
        </div>
        <p className='text-xs text-muted-foreground mt-1'>{period}</p>
      </CardContent>
    </Card>
  );
};
