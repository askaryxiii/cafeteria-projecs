import { useEffect } from "react";
import { SidebarHeader } from "../../../components/navbar/sidebar-header";
import { SidebarNav } from "../../../components/navbar/sidebar-nav";
import { SidebarFooter } from "../../../components/navbar/sidebar-footer";
import { MdClose } from "react-icons/md";

export function MobileMenuDrawer({
  isOpen,
  onClose,
  selectedMenuItem,
  menuItems,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed top-0 left-0 w-screen h-dvh bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed
  top-0
  left-0
  w-80
  h-dvh
  bg-[#EFEFEF]
  border-r border-[#9C9393]
  shadow-lg
  z-50
  md:hidden
  flex
  flex-col
  overflow-y-auto">
        {/* Close Button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">Admin Menu</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-300 rounded transition"
            aria-label="Close menu">
            <MdClose className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Menu Content */}
        <SidebarHeader />
        <SidebarNav
          menuItems={menuItems}
          selectedMenuItem={selectedMenuItem}
          onItemClick={onClose}
        />
        <SidebarFooter onItemClick={onClose} />
      </div>
    </>
  );
}
