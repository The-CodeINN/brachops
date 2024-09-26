import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock, Server, Github, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeployments } from "@/queriesAndMutations";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogStream } from "@/lib/useLogStream";

const statusConfig = {
  SUCCESS: {
    icon: Check,
    className: "text-green-500 bg-green-100 dark:bg-green-900",
    label: "Success",
  },
  FAILURE: {
    icon: X,
    className: "text-red-500 bg-red-100 dark:bg-red-900",
    label: "Failure",
  },
  IN_PROGRESS: {
    icon: Clock,
    className: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900",
    label: "In Progress",
  },
};

export const DeploymentDetails: React.FC = () => {
  const { jobName, buildId } = useParams<{
    jobName: string;
    buildId: string;
  }>();
  const navigate = useNavigate();
  const { GetBuildDetails, GetDeploymentBuildStatus, GetSonarAnalysis } =
    useDeployments();

  const {
    data: sonarAnalysisResponse,
    isLoading: isSonarAnalysisLoading,
    error: sonarAnalysisError,
  } = GetSonarAnalysis(jobName || "");

  const {
    logs,
    isConnected,
    error: logStreamError,
  } = useLogStream(jobName || "", buildId || "");

  const {
    data: buildDetailsResponse,
    isLoading: isBuildDetailsLoading,
    error: buildDetailsError,
  } = GetBuildDetails(jobName || "", buildId || "");

  const {
    data: buildStatusResponse,
    isLoading: isBuildStatusLoading,
    error: buildStatusError,
  } = GetDeploymentBuildStatus(jobName || "");

  const [activeTab, setActiveTab] = useState("summary");
  const logContainerRef = useRef<HTMLPreElement>(null);

  const scrollToBottom = () => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      scrollToBottom();
    }
  }, [activeTab, logs]);

  if (isBuildDetailsLoading || isBuildStatusLoading || isSonarAnalysisLoading) {
    return <LoadingSkeleton />;
  }

  if (buildDetailsError || buildStatusError || sonarAnalysisError) {
    return (
      <ErrorDisplay
        error={buildDetailsError || buildStatusError || sonarAnalysisError}
        onBack={() => navigate("/deployments")}
      />
    );
  }

  if (
    !buildDetailsResponse?.data ||
    !buildStatusResponse ||
    !sonarAnalysisResponse
  ) {
    return (
      <div className="container mx-auto px-2 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Deployment Not Found</h1>
        <p>The deployment you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/deployments")}>
          Back to Deployments
        </Button>
      </div>
    );
  }

  const details = buildDetailsResponse.data;
  const buildStatus = buildStatusResponse;
  const sonarAnalysis = sonarAnalysisResponse.data;

  // Dummy data for missing fields
  const dummyStatus = {
    result: details.result || "IN_PROGRESS",
    timestamp: new Date().toISOString(),
    builtOn: "Jenkins Server 1",
    commitHash: "abc123",
    author: "Tom Delaney",
    logs: ["Log entry 1", "Log entry 2", "Log entry 3"],
  };

  const getStatusConfig = (result: string | null) => {
    if (result === "SUCCESS") return statusConfig.SUCCESS;
    if (result === "FAILURE") return statusConfig.FAILURE;
    return statusConfig.IN_PROGRESS;
  };

  const status = getStatusConfig(dummyStatus.result);

  return (
    <div className="container mx-auto px-2 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Deployment Details</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {details.fullDisplayName || `Job: ${jobName}, Build: ${buildId}`}
            </span>
            <Badge className={status.className}>
              <status.icon className="mr-2 h-4 w-4" />
              {status.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-muted-foreground" size={20} />
              <span>{new Date(dummyStatus.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Server className="text-muted-foreground" size={20} />
              <span>{dummyStatus.builtOn}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Github className="text-muted-foreground" size={20} />
              <span>{dummyStatus.commitHash}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="text-muted-foreground" size={20} />
              <span>{dummyStatus.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${status.className}`}>
                <status.icon size={20} />
              </div>
              <span>{status.label}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="logs">Deployment Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="logs">
          <Card>
            <CardContent className="p-4">
              {logStreamError ? (
                <p className="text-red-500">{logStreamError}</p>
              ) : (
                <>
                  <p className="mb-2">
                    {isConnected ? "Connected to log stream" : "Connecting..."}
                  </p>
                  <pre
                    ref={logContainerRef}
                    className="bg-muted p-4 rounded-md overflow-x-auto h-96 overflow-y-auto"
                  >
                    {logs.length > 0
                      ? logs.map((log, index) => (
                          <div key={index} className="font-mono text-sm">
                            {log}
                          </div>
                        ))
                      : dummyStatus.logs.map((log, index) => (
                          <div key={index} className="font-mono text-sm">
                            {log}
                          </div>
                        ))}
                  </pre>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary">
          <Card>
            <CardContent className="p-4">
              <p>
                Build Number: {details.number || buildId}
                <br />
                Result: {status.label}
                <br />
                Duration:{" "}
                {details.duration
                  ? `${details.duration / 1000} seconds`
                  : "N/A"}
                <br />
              </p>
              <h3 className="text-lg font-semibold mt-6">Build Status</h3>
              <p>
                Deployment Name: {buildStatus.status}
                <br />
                URL:
                <a
                  href={buildStatus.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {buildStatus.appUrl}
                </a>
              </p>

              {sonarAnalysis && sonarAnalysis.status === "SUCCESS" && (
                <>
                  <h3 className="text-lg font-semibold mt-6">Sonar Analysis</h3>
                  <p>
                    Status: {sonarAnalysis.status}
                    <br />
                    URL:
                    <a
                      href={sonarAnalysis.publicSonarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sonarAnalysis.publicSonarUrl}
                    </a>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="container mx-auto px-2 py-8 space-y-8">
    <Skeleton className="h-10 w-1/4" />
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
    <Skeleton className="h-40 w-full" />
  </div>
);

interface ErrorDisplayProps {
  error: Error | null;
  onBack: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onBack }) => (
  <div className="container mx-auto px-2 py-8 space-y-8">
    <h1 className="text-3xl font-bold">Error</h1>
    <p>An error occurred while fetching deployment details: {error?.message}</p>
    <Button onClick={onBack}>Back to Deployments</Button>
  </div>
);

export default DeploymentDetails;
