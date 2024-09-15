import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconTabs from '@/components/ui/Tab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeploymentForm from '@/components/pages/createdeployment-form';
import CodeQualityScanForm from '@/components/pages/codescan-form';

const CreateDeploymentOrScanJob: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Deployment');

  useEffect(() => {
    // Set the initial active tab based on the current URL
    if (location.pathname === '/codescan') {
      setActiveTab('CodeScan');
    } else {
      setActiveTab('Deployment');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: { title: string }) => {
    setActiveTab(tab.title);
    if (tab.title === 'Deployment') {
      navigate('/deploy');
    } else {
      navigate('/codescan');
    }
  };

  const onDeploymentSubmit = (data: unknown) => {
    console.log('Deployment form submitted:', data);
    // Handle form submission
  };

  const onCodeQualityScanSubmit = (data: unknown) => {
    console.log('Code Quality Scan form submitted:', data);
    // Handle form submission
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
            <DeploymentForm onSubmit={onDeploymentSubmit} />
          ) : (
            <CodeQualityScanForm onSubmit={onCodeQualityScanSubmit} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDeploymentOrScanJob;
