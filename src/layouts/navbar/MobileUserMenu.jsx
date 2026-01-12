import { FaPizzaSlice } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const MobileUserMenu = ({ onClose }) => {
  const { logout, user } = useContext(AuthContext);
  const isAdmin = user?.user?.role === "admin";

  return (
    <div className="flex flex-col gap-1">
      {/* My Orders */}
      <Link
        to="/user/orders"
        onClick={onClose}
        className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded transition ">
        <FaPizzaSlice className="" /> My Orders
      </Link>

      {/* Update Profile / Change Password */}
      <Link
        to="/user/change-password"
        onClick={onClose}
        className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded transition">
        <FaUnlock className="" /> Change Password
      </Link>

      {isAdmin && (
        <Link
          to="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded transition">
          <MdAdminPanelSettings className="w-5 h-5" /> Admin Panel
        </Link>
      )}

      <div className="border-t my-1" />

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          onClose();
        }}
        className="flex items-center gap-2 px-2 text-left rounded hover:bg-gray-200 transition">
        <FaSignOutAlt className="" /> Logout
      </button>
    </div>
  );
};

export default MobileUserMenu;

// import * as Dropdown from "@radix-ui/react-dropdown-menu";
// import { LuPizza } from "react-icons/lu";
// import { GoUnlock } from "react-icons/go";
// import { PiSignOutBold } from "react-icons/pi";
// import { Link } from "react-router-dom";
// import { useContext } from "react";
// import AuthContext from "../../context/AuthContext";
// import { HiUser } from "react-icons/hi2";
// import { MdAdminPanelSettings, MdKeyboardArrowRight } from "react-icons/md";

// const MobileUserMenu = ({ onClose }) => {
//   const { logout, user } = useContext(AuthContext);
//   const isAdmin = user?.user?.role === "admin";

//   return (
//     <Dropdown.Root>
//       <Dropdown.Trigger asChild>
//         <div className="flex justify-between items-center cursor-pointer">
//           <div className="flex gap-2.5 p-2 items-center">
//             <HiUser className="w-5 h-5" />
//             <span>User</span>
//           </div>
//           <MdKeyboardArrowRight />
//         </div>
//       </Dropdown.Trigger>

//       <Dropdown.Content
//         className="min-w-[170px] rounded bg-[#dfe1e9] border shadow-md p-2 mt-3"
//         sideOffset={5}>
//         {/* My Orders */}
//         <Dropdown.Item asChild>
//           <Link
//             to="/user/orders"
//             className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
//             onClick={() => setTimeout(onClose, 10)}>
//             <LuPizza className="w-5 h-5" />
//             <span>My Orders</span>
//           </Link>
//         </Dropdown.Item>

//         <Dropdown.Separator className="h-px bg-gray-300 my-1" />

//         {/* Change Password */}
//         <Dropdown.Item asChild>
//           <Link
//             to="/user/change-password"
//             className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
//             onClick={() => setTimeout(onClose, 10)}>
//             <GoUnlock className="w-5 h-5" />
//             <span>Change Password</span>
//           </Link>
//         </Dropdown.Item>

//         <Dropdown.Separator className="h-px bg-gray-300 my-1" />

//         {isAdmin && (
//           <>
//             <Dropdown.Item asChild>
//               <Link
//                 to="/admin/dashboard"
//                 className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
//                 <MdAdminPanelSettings className="w-6 h-6" />
//                 <span> Admin Panel</span>
//               </Link>
//             </Dropdown.Item>
//           </>
//         )}
//         <Dropdown.Separator className="h-px bg-gray-300 my-1" />

//         {/* Sign Out */}
//         <Dropdown.Item asChild>
//           <button
//             onClick={() => {
//               logout();
//               onClose();
//             }}
//             className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer w-full text-left">
//             <PiSignOutBold className="w-5 h-5" />
//             <span>Sign Out</span>
//           </button>
//         </Dropdown.Item>
//       </Dropdown.Content>
//     </Dropdown.Root>
//   );
// };

// export default MobileUserMenu;
