import Sidebar from "@/components/pages/sidebar";
import { ImportIcon, BookIcon, ScanIcon, NotebookIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar
        sidebarItems={{
          links: [
            {
              label: "Deploy Code",
              path: "/create-deployment",
              icon: ImportIcon,
            },
            {
              label: "Deploy Details",
              path: "/deploy-details",
              icon: BookIcon,
            },
            { label: "Scan Code", path: "/codescan", icon: ScanIcon },
            {
              label: "Scan Details",
              path: "/scan-details",
              icon: NotebookIcon,
            },
          ],
        }}
      />
      <main className=" ml-[270px] flex-1 pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
