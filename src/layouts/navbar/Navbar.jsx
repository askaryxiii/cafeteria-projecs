import Logo from "../../ui/logos/Logo";
import { Link } from "react-router-dom";
import UserAvatar from "../../ui/avatar/UserAvatar";
import { ImHome } from "react-icons/im";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between">
      <Logo src={"/assets/logo/projecs.webp"} alt="art" width="300" />
      <div className="flex gap-2">
        <Link
          to={"/"}
          className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center hover:bg-gray-200">
          <ImHome className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A] " />
        </Link>
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
