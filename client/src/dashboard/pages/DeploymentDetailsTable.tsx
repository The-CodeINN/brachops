import { useParams, useNavigate } from 'react-router-dom';
import { useDeployments } from '@/queriesAndMutations';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { JobWithBuildsResponse, JobWithBuilds, Build } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

const DeploymentDetailsTable = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { getJobsWithBuilds } = useDeployments();
  const { data, isLoading, error } = getJobsWithBuilds as {
    data?: JobWithBuildsResponse;
    isLoading: boolean;
    error: Error | null;
  };

  if (error) return <div>Error: {error.message}</div>;

  const job = data?.data.jobs.find((job: JobWithBuilds) => job.name === name);

  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  const handleViewDetails = (buildId: string) => {
    if (name) {
      navigate(`/deployment/${encodeURIComponent(name)}/${buildId}`);
    }
  };

  const handleDelete = (buildId: string) => {
    // Implement delete functionality here
    console.log(`Delete build ${buildId}`);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Deployment: {name}</h1>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Deployment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Builds: {job?.builds?.length || 0}</p>
          <p>Latest Build Status: {job?.builds?.[0]?.result || 'N/A'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Build History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Build Number</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className='h-4 w-8' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-20' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-24' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-16' />
                      </TableCell>
                    </TableRow>
                  ))
                : job?.builds?.map((build: Build) => (
                    <TableRow key={build.number}>
                      <TableCell className='font-medium'>
                        {build.number}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            build.result === 'SUCCESS'
                              ? 'default'
                              : build.result === 'FAILURE'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {build.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDuration(build.duration)}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <span className='sr-only'>Open menu</span>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewDetails(build.number.toString())
                              }
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(build.number.toString())
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentDetailsTable;
