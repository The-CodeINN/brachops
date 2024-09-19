import { useParams, useNavigate } from "react-router-dom";
import { useDeployments } from "@/queriesAndMutations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { JobWithBuilds, Build } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";

const statusConfig = {
  SUCCESS: { icon: CheckCircle, variant: "default", label: "Success" },
  FAILURE: { icon: XCircle, variant: "destructive", label: "Failure" },
  IN_PROGRESS: { icon: Clock, variant: "secondary", label: "In Progress" },
};

const DeploymentDetailsTable = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { GetJobsWithBuilds } = useDeployments();
  const { data, isLoading, error } = GetJobsWithBuilds();

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
      const encodedJobName = encodeURIComponent(name);
      navigate(`/deployment/${encodedJobName}/${buildId}`);
    }
  };

  const handleDelete = (buildId: string) => {
    // Implement delete functionality here
    console.log(`Delete build ${buildId}`);
  };

  const getBuildStatus = (result: string | null) => {
    if (result === "SUCCESS") return statusConfig.SUCCESS;
    if (result === "FAILURE") return statusConfig.FAILURE;
    return statusConfig.IN_PROGRESS;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Deployment: {name}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deployment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Builds: {job?.builds?.length || 0}</p>
          <p>
            Latest Build Status: {job?.builds?.[0]?.result || "In Progress"}
          </p>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                : job?.builds?.map((build: Build) => {
                    const status = getBuildStatus(build.result);
                    return (
                      <TableRow key={build.number}>
                        <TableCell className="font-medium">
                          {build.number}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status.variant as
                                | "default"
                                | "destructive"
                                | "secondary"
                            }
                          >
                            <status.icon className="w-4 h-4 mr-2" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(build.duration)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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
                    );
                  })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentDetailsTable;
