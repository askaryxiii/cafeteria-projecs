import Logo from "../../../components/ui/logos/Logo";
import { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import AuthContext from "../../../context/AuthContext";
import { TbLogout } from "react-icons/tb";
import { SidebarItem } from "../../../components/navbar/sidebar-item";

const AdminLogoNav = ({ onMenuToggle, isMobile }) => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 bg-[#E2E2E2] col-span-5 row-span-1 border-b border-[#cfcfcf] shadow-lg flex items-center justify-between">
      <Logo src={"/assets/logo/projecs.webp"} alt="art" className="w-48" />
      <div className="hidden md:block">
        <SidebarItem Icon={TbLogout} label="Logout" onclickfunc={logout} />
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
