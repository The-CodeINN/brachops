import { Check, Clock, Rocket, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const StatCards = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <DeploymentCard
        title='Total Deployments'
        value='1,254'
        pillText='12.5%'
        trend='up'
        period='Last 30 days'
        icon={Rocket}
      />
      <DeploymentCard
        title='Avg. Deploy Time'
        value='27.97s'
        pillText='1.01%'
        trend='down'
        period='Last 30 days'
        icon={Clock}
      />
      <DeploymentCard
        title='Success Rate'
        value='99.8%'
        pillText='0.75%'
        trend='up'
        period='Last 30 days'
        icon={Check}
      />
    </div>
  );
};

interface DeploymentCardProps {
  title: string;
  value: string;
  pillText: string;
  trend: 'up' | 'down';
  period: string;
  icon: React.ElementType;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({
  title,
  value,
  pillText,
  trend,
  period,
  icon: Icon,
}) => {
  return (
    <Card className=' dark:bg-[#0a0a0a] dark:shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='text-2xl font-bold'>{value}</div>
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
        </div>
        <p className='text-xs text-muted-foreground mt-1'>{period}</p>
      </CardContent>
    </Card>
  );
};
