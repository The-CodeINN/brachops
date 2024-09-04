import Navbar from '@/components/global/Navbar';
import { Outlet } from 'react-router-dom';

const PrivateLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
