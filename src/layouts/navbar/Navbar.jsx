import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillCupHotFill } from "react-icons/bs";
import { ImHome } from "react-icons/im";
import UserAvatar from "../../components/ui/avatar/UserAvatar";
import Logo from "../../components/ui/logos/Logo";
import { Link } from "react-router-dom";
import MobileUserMenu from "./MobileUserMenu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <Logo
          src={"/assets/logo/projecs.webp"}
          alt="art"
          className="w-36 md:w-52 lg:w-64"
        />

        <div className="hidden md:flex gap-3">
          <Link to="/" className="nav-btn">
            <BsFillCupHotFill className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
          </Link>
          <Link to="/" className="nav-btn">
            <ImHome className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
          </Link>
          <UserAvatar />
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center"
          onClick={() => setOpen(!open)}>
          <GiHamburgerMenu className="text-2xl text-[#02356A]" />
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-3 top-full bg-[#dfe1e9] rounded shadow-lg p-4 z-50 flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
            onClick={() => setOpen(false)}>
            <BsFillCupHotFill /> Drinks
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
            onClick={() => setOpen(false)}>
            <ImHome /> Home
          </Link>

          <div className="border-t my-1" />

          <MobileUserMenu onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
