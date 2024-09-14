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
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-[auto,1fr] grid-rows-[auto,1fr] bg-gray-100 dark:bg-black transition-colors duration-200'>
      <Sidebar
        sidebarItems={sidebarItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className='row-start-1 row-span-full'
      />
      <main className='md:m-3 lg:col-start-2 md:border rounded-lg bg-white dark:bg-background shadow transition-colors duration-200'>
        <Topbar
          onMenuClick={toggleSidebar}
          className='col-span-full lg:col-start-2'
        />
        <div className='overflow-y-auto min-h-[calc(100vh-4rem)] p-4'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PrivateLayout;
