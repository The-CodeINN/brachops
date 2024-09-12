import { Navbar } from "@/components/global/Navbar";
import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-10 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
