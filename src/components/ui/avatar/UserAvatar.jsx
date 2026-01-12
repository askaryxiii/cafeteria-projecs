"use client";

import { DropdownMenu } from "radix-ui";
import { HiUser } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { LuPizza } from "react-icons/lu";
import { GoUnlock } from "react-icons/go";
import { PiSignOutBold } from "react-icons/pi";
import { MdAdminPanelSettings } from "react-icons/md";
import { useContext } from "react";
import AuthContext from "../../../context/AuthContext";

const UserAvatar = () => {
  const { logout, user } = useContext(AuthContext);
  const isAdmin = user?.user?.role === "admin";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex border-2 w-10 h-10 border-gray-400 items-center justify-center rounded outline-none"
          aria-label="Customise options">
          <HiUser className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[280px] rounded-lg bg-white border-2 border-gray-200 shadow-lg overflow-hidden"
          sideOffset={5}>
          <DropdownMenu.Item className="group relative flex gap-3 px-6 py-3 select-none items-center leading-none text-gray-700 outline-none hover:bg-gray-50 cursor-pointer transition-colors">
            <LuPizza className="w-5 h-5 shrink-0" />
            <Link
              to="/user/orders"
              className="text-gray-700 font-medium flex-1">
              My Orders
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="bg-gray-200 h-px" />

          <DropdownMenu.Item className="group relative flex gap-3 px-6 py-3 select-none items-center leading-none text-gray-700 outline-none hover:bg-gray-50 cursor-pointer transition-colors">
            <GoUnlock className="w-5 h-5 shrink-0" />
            <Link
              to="/user/change-password"
              className="text-gray-700 font-medium flex-1">
              Change Password
            </Link>
          </DropdownMenu.Item>

          {isAdmin && (
            <>
              <DropdownMenu.Separator className="bg-gray-200 h-px" />
              <DropdownMenu.Item className="group relative flex gap-3 px-6 py-3 select-none items-center leading-none text-gray-700 outline-none hover:bg-gray-50 cursor-pointer transition-colors">
                <MdAdminPanelSettings className="w-5 h-5 shrink-0" />
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 font-medium flex-1">
                  Admin Panel
                </Link>
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Separator className="bg-gray-200 h-px" />

          <DropdownMenu.Item className="group relative flex gap-3 px-6 py-3 select-none items-center leading-none text-gray-700 outline-none hover:bg-gray-50 cursor-pointer transition-colors">
            <PiSignOutBold className="w-5 h-5 shrink-0" />
            <button
              onClick={logout}
              className="cursor-pointer text-gray-700 font-medium text-left flex-1">
              Sign Out
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserAvatar;
