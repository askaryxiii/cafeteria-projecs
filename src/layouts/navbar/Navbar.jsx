import { useContext, useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillCupHotFill } from "react-icons/bs";
import { ImHome } from "react-icons/im";
import UserAvatar from "../../components/ui/avatar/UserAvatar";
import Logo from "../../components/ui/logos/Logo";
import { Link } from "react-router-dom";
import MobileUserMenu from "./MobileUserMenu";
import { IoFastFoodSharp } from "react-icons/io5";
import AuthContext from "../../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
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
          {user.user.role === "admin" ||
          user.user.role === "employee" ||
          user.user.role === "accountant" ? (
            <div className="flex gap-3">
              {/* <Link to="/user/drinks" className="nav-btn">
                <BsFillCupHotFill className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
              </Link> */}
              <div className="relative group inline-block">
                <button
                  disabled
                  className="nav-btn  opacity-50 cursor-not-allowed">
                  <BsFillCupHotFill className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
                </button>

                {/* Tooltip */}
                <div
                  className="
      absolute bottom-full mb-2 left-1/2 -translate-x-1/2
      whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white
      opacity-0 group-hover:opacity-100 transition-opacity
      pointer-events-none
    ">
                  Drinks are currently unavailable
                </div>
              </div>
              <Link to="/user" className="nav-btn bg-gray-200">
                <IoFastFoodSharp className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
              </Link>
              <Link to="/" className="nav-btn bg-gray-200">
                <ImHome className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
              </Link>
            </div>
          ) : (
            <></>
          )}

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
          <div className="bg-gray-300 flex items-center justify-center px-6 py-1.5 text-gray-700">
            <span className="font-bold">Welcome {user?.user?.name}</span>
          </div>
          <div className="relative group inline-block">
            <button
              type="button"
              disabled
              className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
              <BsFillCupHotFill /> Drinks
            </button>

            {/* Tooltip */}
            <div
              className="
        absolute bottom-full mb-2 left-1/2 -translate-x-1/2
        whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none
      ">
              Drinks are currently unavailable
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
            onClick={() => setOpen(false)}>
            <ImHome /> Home
          </Link>
          <div className="border-t border-[#02356A] my-0.5" />
          <MobileUserMenu onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
