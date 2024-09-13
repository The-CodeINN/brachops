import React, { useState } from 'react';
import Sidebar from '@/components/pages/sidebar';
import Topbar from '@/components/pages/topbar';
import { ImportIcon, BookIcon, ScanIcon, NotebookIcon } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const PrivateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarItems = {
    links: [
      { label: 'Deploy Code', path: '/create-deployment', icon: ImportIcon },
      { label: 'Deployments', path: '/deployments', icon: BookIcon },
      { label: 'Scan Code', path: '/codescan', icon: ScanIcon },
      { label: 'Scan Details', path: '/scan-details', icon: NotebookIcon },
    ],
  };

  return (
    <div className='h-screen flex bg-gray-100 dark:bg-gray-950 transition-colors duration-200'>
      <Sidebar
        sidebarItems={sidebarItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className='flex-shrink-0'
      />
      <div className='flex-grow flex flex-col overflow-hidden  md:m-3 bg-white dark:bg-background shadow transition-colors duration-200 rounded-lg border'>
        <Topbar onMenuClick={toggleSidebar} className='flex-shrink-0' />
        <main className='flex-grow overflow-auto  p-4'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
