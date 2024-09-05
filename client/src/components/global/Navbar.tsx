import React, { useState } from 'react';
import { MountainIcon } from '@/assets/icons/mountainIcon';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import { SidebarOpen } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className='bg-background z-40 top-0 left-0 w-full fixed border-b border-grey p-2'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo and title */}
          <Link to='/' className='flex-shrink-0 flex items-center'>
            <MountainIcon className='h-8 w-8' aria-hidden='true' />
            <h1 className='text-2xl font-bold ml-2'>BrachOps</h1>
          </Link>

          {/* Desktop menu - centered */}
          <div className='hidden sm:flex flex-grow justify-center'>
            <div className='flex items-baseline space-x-4'>
              <a
                href='/'
                className='text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
              >
                Home
              </a>
              <a
                href='/docs'
                className='text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center'
              >
                <HeartFilledIcon
                  className='text-red-500 mr-2'
                  aria-hidden='true'
                />
                Docs
              </a>
            </div>
          </div>

          {/* Right-aligned items */}
          <div className='hidden sm:flex items-center'>
            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className='sm:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className='sr-only'>Open main menu</span>
              <SidebarOpen className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        id='mobile-menu'
      >
        <div className='px-2 pt-2 pb-3 space-y-1'>
          <a
            href='/'
            className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
          >
            Home
          </a>
          <a
            href='/docs'
            className='text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center'
          >
            <HeartFilledIcon className='text-red-500 mr-2' aria-hidden='true' />
            Docs
          </a>
          <div className='px-3 py-2'>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
