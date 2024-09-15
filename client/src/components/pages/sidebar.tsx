import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MountainIcon } from '@/assets/icons/mountainIcon';
import SidebarButton from '../global/sidebar-button';
import { SidebarItems } from '@/types';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebarStore } from '@/store/sidebarStore';

interface SidebarProps {
  sidebarItems: SidebarItems;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarItems, className }) => {
  const location = useLocation();
  const { isOpen, closeSidebar } = useSidebarStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-background fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:transform-none ${className}`}
      >
        <div className='h-full px-3 py-4 overflow-y-auto'>
          <Link
            to='/'
            className='flex items-center mb-5 border-b pb-5'
            onClick={closeSidebar}
          >
            <MountainIcon className='h-8 w-8' aria-hidden='true' />
            <h1 className='text-2xl font-bold ml-2'>BrachOps</h1>
          </Link>
          {/* Close Icon */}
          <Button
            onClick={closeSidebar}
            variant={'outline'}
            className='absolute top-3 right-3 lg:hidden rounded p-2'
            aria-label='Close Sidebar'
          >
            <X className='h-6 w-6' />
          </Button>

          <nav className='pt-8'>
            {sidebarItems.links.map((link, index) => (
              <Link key={index} to={link.path} onClick={closeSidebar}>
                <SidebarButton
                  icon={link.icon}
                  className='w-full mb-2'
                  isActive={location.pathname === link.path}
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
