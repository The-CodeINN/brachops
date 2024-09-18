import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconTabs from '@/components/ui/Tab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeploymentForm, {
  DeploymentFormValues,
} from '@/components/pages/createdeployment-form';
import CodeQualityScanForm, {
  CodeQualityScanFormValues,
} from '@/components/pages/codescan-form';
import { useDeployments } from '@/queriesAndMutations';
import {
  CreateJobInput,
  CreateScanJobInput,
  BackendErrorResponse,
} from '@/types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const CreateDeploymentOrScanJob: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Deployment');
  const { CreateDeployment, CreateScanDeployment } = useDeployments();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const createDeploymentMutation = CreateDeployment();
  const createScanDeploymentMutation = CreateScanDeployment();

  useEffect(() => {
    setActiveTab(location.pathname === '/codescan' ? 'CodeScan' : 'Deployment');
  }, [location.pathname]);

  const handleTabChange = (tab: { title: string }) => {
    setActiveTab(tab.title);
    navigate(tab.title === 'Deployment' ? '/deploy' : '/codescan');
  };

  const handleError = (error: unknown) => {
    let errorMessage = 'An unexpected error occurred';
    const formattedErrors: Record<string, string> = {};

    if (error instanceof AxiosError && error.response?.data) {
      const backendError = error.response.data as BackendErrorResponse;

      if (backendError.errors?.details) {
        backendError.errors.details.forEach((err) => {
          const field = err.path.split('.').pop() as string;
          formattedErrors[field] = err.message;
        });
        errorMessage =
          backendError.message || 'Please check the form for errors.';
      } else {
        errorMessage = backendError.message;
      }
      formattedErrors.general = errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      formattedErrors.general = errorMessage;
    }

    setFormErrors(formattedErrors);
    // console.error(error.response?.data || error.message, "Error creating job");
    // @ts-expect-error - Needed
    toast.error(`${error.response.data.error}`);
  };
  const handleSuccess = (jobName: string) => {
    setFormErrors({});
    toast.success(`${activeTab} job created successfully!`);
    navigate(`/deployment/${jobName}/1`);
  };

  const onDeploymentSubmit = (formData: DeploymentFormValues) => {
    const createJobInput: CreateJobInput = {
      jobName: formData.jobName,
      imageName: formData.imageName,
      projectType: formData.projectType,
      envVars: Object.fromEntries(
        formData.envVars.map(({ key, value }) => [key, value])
      ),
    };

    createDeploymentMutation.mutate(createJobInput, {
      onError: handleError,
      onSuccess: () => handleSuccess(createJobInput.jobName),
    });
  };

  const onCodeQualityScanSubmit = (formData: CodeQualityScanFormValues) => {
    const createScanJobInput: CreateScanJobInput = {
      jobName: formData.jobName,
      gitUrl: formData.gitUrl,
      buildPath: formData.buildPath,
    };

    createScanDeploymentMutation.mutate(createScanJobInput, {
      onError: handleError,
      onSuccess: () => handleSuccess(createScanJobInput.jobName),
    });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <IconTabs onTabChange={handleTabChange} selectedTab={activeTab} />
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            {activeTab === 'Deployment'
              ? 'Deployment Job'
              : 'Code Quality Scan'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'Deployment' ? (
            <DeploymentForm
              onSubmit={onDeploymentSubmit}
              serverErrors={formErrors}
              isLoading={createDeploymentMutation.isPending}
            />
          ) : (
            <CodeQualityScanForm
              onSubmit={onCodeQualityScanSubmit}
              serverErrors={formErrors}
              isLoading={createScanDeploymentMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDeploymentOrScanJob;
