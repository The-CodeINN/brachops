import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-lg w-full space-y-8 text-center'>
        <div
          className='animate-fade-in'
          style={{ '--animation-delay': '0ms' } as React.CSSProperties}
        >
          <svg
            className='mx-auto h-40 w-auto text-primary'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={0.5}
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <div
          className='animate-fade-up'
          style={{ '--animation-delay': '300ms' } as React.CSSProperties}
        >
          <h2 className='mt-6 text-6xl font-extrabold text-foreground'>
            Oops! 404
          </h2>
          <p className='mt-2 text-3xl font-medium text-muted-foreground'>
            Page not found
          </p>
          <p className='mt-4 text-lg text-muted-foreground'>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div
          className='animate-fade-up'
          style={{ '--animation-delay': '600ms' } as React.CSSProperties}
        >
          <button
            onClick={() => navigate('/')}
            className='mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out'
          >
            <HomeIcon className='h-5 w-5 mr-2' />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
