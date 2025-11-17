import Logo from "../../../components/ui/logos/Logo";
import React from "react";

const AdminLogoNav = () => {
  return (
    <div className="px-8 py-4 bg-[#E2E2E2] col-span-5 row-span-1 border-b border-[#cfcfcf] shadow-lg">
      <Logo src={"/assets/logo/projecs.webp"} alt="art" width="150" />
    </div>
  );
};

export default AdminLogoNav;
