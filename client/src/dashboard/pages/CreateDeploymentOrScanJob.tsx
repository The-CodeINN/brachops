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
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data: BackendErrorResponse } };
      if (axiosError.response?.data) {
        const backendErrors = axiosError.response.data.errors.details;
        const formattedErrors: Record<string, string> = {};
        backendErrors.forEach((err) => {
          const field = err.path.split('.').pop() as string;
          formattedErrors[field] = err.message;
        });
        setFormErrors(formattedErrors);
        toast.error(
          `Failed to create ${activeTab.toLowerCase()} job. Please check the form for errors.`
        );
      } else {
        setFormErrors({ general: 'An unexpected error occurred' });
        toast.error('An unexpected error occurred');
      }
    } else {
      setFormErrors({ general: 'An unexpected error occurred' });
      toast.error('An unexpected error occurred');
    }
  };

  const handleSuccess = () => {
    setFormErrors({});
    toast.success(`${activeTab} job created successfully!`);
    navigate('/deployments');
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
      onSuccess: handleSuccess,
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
      onSuccess: handleSuccess,
    });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <IconTabs onTabChange={handleTabChange} selectedTab={activeTab} />
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-primary'>
            {activeTab === 'Deployment'
              ? 'Deployment Job'
              : 'Code Quality Scan'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'Deployment' ? (
            <DeploymentForm
              onSubmit={onDeploymentSubmit}
              errors={formErrors}
              isLoading={createDeploymentMutation.isPending}
            />
          ) : (
            <CodeQualityScanForm
              onSubmit={onCodeQualityScanSubmit}
              errors={formErrors}
              isLoading={createScanDeploymentMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDeploymentOrScanJob;
