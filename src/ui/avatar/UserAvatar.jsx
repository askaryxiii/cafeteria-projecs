import { DropdownMenu } from "radix-ui";
import { HiUser } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { LuPizza } from "react-icons/lu";
import { GoUnlock } from "react-icons/go";
import { PiSignOutBold } from "react-icons/pi";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const UserAvatar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex border-2 w-10 h-10 border-gray-400 items-center justify-center rounded  outline-none  "
          aria-label="Customise options">
          <HiUser className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-sm bg-[#dfe1e9] border-2 border-[#B8B6B6]"
          sideOffset={5}>
          <DropdownMenu.Item className="group relative flex gap-2.5 p-2 select-none items-center leading-none text-[#032552] outline-none ">
            <LuPizza className="w-5 h-5" />
            <Link to="/user/orders"> My Orders </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className=" bg-[#B1B1B1] h-px w-3/4" />
          <DropdownMenu.Item className="group relative flex gap-2.5 p-2 select-none items-center leading-none text-[#032552] outline-none ">
            <GoUnlock className="w-5 h-5" />
            <Link to="/">Change Password</Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className=" bg-[#B1B1B1] h-px w-3/4" />
          <DropdownMenu.Item className="group relative flex gap-2.5 p-2 select-none items-center leading-none text-[#032552] outline-none ">
            <PiSignOutBold className="w-5 h-5" />
            <button onClick={logout} className="cursor-pointer">
              Sign Out
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserAvatar;
