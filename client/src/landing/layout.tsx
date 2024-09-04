import Navbar from '@/components/global/Navbar';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
