import { Navbar } from '@/components/global/Navbar';
import { Outlet } from 'react-router-dom';

const PrivateLayout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 pt-32'>
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
