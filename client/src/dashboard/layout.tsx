import React from 'react';
import Sidebar from '@/components/global/sidebar';
import Topbar from '@/components/pages/topbar';
import { Rocket, Rows4, Radar, NotebookIcon } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const PrivateLayout: React.FC = () => {
  const sidebarItems = {
    links: [
      { label: 'Deploy Code', path: '/deploy', icon: Rocket },
      { label: 'Scan Code', path: '/codescan', icon: Radar },
      { label: 'Deployments', path: '/deployments', icon: Rows4 },
      { label: 'Scan Details', path: '/scan-details', icon: NotebookIcon },
    ],
  };

  return (
    <div className='h-screen flex bg-gray-100 dark:bg-gray-900 transform transition-colors duration-200 ease-in-out'>
      <Sidebar sidebarItems={sidebarItems} className='flex-shrink-0' />
      <div className='flex-grow flex flex-col overflow-hidden md:m-3 bg-white dark:bg-background shadow transform transition-colors duration-200 ease-in-out rounded-lg border'>
        <Topbar className='flex-shrink-0' />
        <main className='flex-grow overflow-auto p-4'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
