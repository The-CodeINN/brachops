import { Link } from "react-router-dom";
import { MountainIcon } from "@/assets/icons/mountainIcon";
import SidebarButton from "../global/sidebar-button";
import { SidebarItems } from "@/types";

interface SidebarProps {
  sidebarItems: SidebarItems;
}

const Sidebar = (props: SidebarProps) => {
  return (
    <aside className="w-[270px] max-w-xs h-screen fixed left-0 top-0 z-40 border-r">
      <div className="h-full px-3 py-4">
        <Link
          to="/create-deployment"
          className="flex-shrink-0 flex items-center"
        >
          <MountainIcon className="h-8 w-8" aria-hidden="true" />
          <h1 className="text-2xl font-bold ml-2">BrachOps</h1>
        </Link>
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} to={link.path}>
                <SidebarButton icon={link.icon} className="w-full">
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
