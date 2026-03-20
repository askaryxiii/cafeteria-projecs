import Logo from "../../../components/ui/logos/Logo";
import { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import AuthContext from "../../../context/AuthContext";
import { SidebarHeader } from "../../../components/navbar/sidebar-header";

const AdminLogoNav = ({ onMenuToggle, isMobile }) => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="pr-4 md:pr-6 lg:pr-8 py-2 md:py-0 md:pb-2 bg-light-grey col-span-5 row-span-1 border-b border-dark-grey/50 flex items-center justify-between">
      <Logo
        src={"/assets/logo/projecs.webp"}
        alt="art"
        className="w-52 py-1.5 mx-2"
      />
      <div className="hidden md:block">
        <SidebarHeader />
        {/* <SidebarItem Icon={TbLogout} label="Logout" onclickfunc={logout} /> */}
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-gray-300 rounded transition"
          aria-label="Toggle menu">
          <GiHamburgerMenu className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default AdminLogoNav;
