import React from "react";
import AdminLogoNav from "./navbar/admin/AdminLogoNav";
import { Sidebar } from "./navbar/admin/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-5  auto-rows-[4rem] gap-2">
      <AdminLogoNav />
      <Sidebar />
      <main className="col-span-4 row-span-4 row-start-2">{children}</main>
    </div>
  );
};

export default AdminLayout;
