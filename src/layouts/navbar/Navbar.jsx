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
import { getAvailableDrinks, updateAvailableDrinks } from "../../lib/apis";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const menuRef = useRef(null);

  // Modal state for editing drinks availability
  const [drinksModalOpen, setDrinksModalOpen] = useState(false);
  const [drinks, setDrinks] = useState([]);
  const [loadingDrinks, setLoadingDrinks] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load drinks when modal opens
  useEffect(() => {
    if (!drinksModalOpen) return;
    let mounted = true;
    (async () => {
      setLoadingDrinks(true);
      const res = await getAvailableDrinks();
      if (!mounted) return;
      setLoadingDrinks(false);
      if (res && res.error) {
        toast.error(res.error || "Failed to load drinks");
        return;
      }
      // normalize items
      const items = (res.items || []).map((it) => ({
        id: it.menu_item_id,
        name: it.item_name,
        is_available: !!Number(it.is_available),
      }));
      setDrinks(items);
    })();
    return () => (mounted = false);
  }, [drinksModalOpen]);

  const toggleDrink = (id) => {
    setDrinks((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, is_available: !d.is_available } : d,
      ),
    );
  };

  const saveDrinks = async () => {
    setSaving(true);
    const payloadItems = drinks.map((d) => ({
      menu_item_id: d.id,
      is_available: d.is_available,
    }));
    const res = await updateAvailableDrinks(payloadItems);
    setSaving(false);
    if (res && res.error) {
      toast.error(res.error || "Failed to save drink availability");
      return;
    }
    toast.success("Drinks availability updated");
    setDrinksModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <Logo
          src={"/assets/logo/projecs-ramadan.svg"}
          alt="art"
          className="w-36 md:w-52 lg:w-64 pt-1"
        />

        <div className="flex gap-3">
          <div className="hidden md:flex gap-3">
            {user.user.role === "cafeteria" ? (
              <div className="flex gap-3">
                <button
                  className="border-2 border-dark-grey/50 text-primary-navy font-semibold px-4 py-1 rounded cursor-pointer"
                  onClick={() => setDrinksModalOpen(true)}>
                  Edit Drinks
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="hidden md:flex gap-3">
            {user.user.role === "admin" ||
            user.user.role === "employee" ||
            user.user.role === "accountant" ? (
              <div className="flex gap-3">
                <Link to="/user/drinks" className="nav-btn">
                  <BsFillCupHotFill className="w-7 h-7 p-0.5 bg-light-grey text-primary-navy" />
                </Link>

                {/* previously disabled drinks */}
                {/* <div className="relative group inline-block">
                <button
                  disabled
                  className="nav-btn  opacity-50 cursor-not-allowed">
                  <BsFillCupHotFill className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />
                </button>

                <div
                  className="
      absolute bottom-full mb-2 left-1/2 -translate-x-1/2
      whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white
      opacity-0 group-hover:opacity-100 transition-opacity
      pointer-events-none
    ">
                  Drinks are currently unavailable
                </div>
              </div> */}
                <Link to="/user" className="nav-btn bg-light-grey">
                  <IoFastFoodSharp className="w-7 h-7 p-0.5 bg-light-grey text-primary-navy" />
                </Link>
                <Link to="/" className="nav-btn bg-light-grey">
                  <ImHome className="w-7 h-7 p-0.5 bg-light-grey text-primary-navy" />
                </Link>
              </div>
            ) : (
              <></>
            )}

            <UserAvatar />
          </div>
        </div>

        {!open ? (
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setOpen(!open)}>
            <GiHamburgerMenu className="text-2xl text-primary-navy" />
          </button>
        ) : (
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setOpen(!open)}>
            <IoClose className="text-3xl text-primary-navy" />
          </button>
        )}
      </div>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-3 top-full bg-light-grey rounded shadow-lg p-4 z-50 flex flex-col gap-1">
          <div className="bg-gray-300 flex items-center justify-center px-6 py-1.5 text-primary-navy">
            <span className="font-bold">Welcome {user?.user?.name}</span>
          </div>
          <div className="flex gap-3">
            {user.user.role === "cafeteria" ? (
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-2 p-2 rounded text-primary-navy font-medium"
                  onClick={() => setDrinksModalOpen(true)}>
                  Edit Drinks
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          {user.user.role !== "cafeteria" && (
            <Link
              to="/user/drinks"
              className="flex items-center gap-2 p-2 rounded text-primary-navy font-medium"
              onClick={() => setOpen(false)}>
              <BsFillCupHotFill /> Drinks
            </Link>
          )}
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded text-primary-navy font-medium"
            onClick={() => setOpen(false)}>
            <ImHome /> Home
          </Link>
          <div className="border-t border-dark-grey/50 my-0.5" />
          <MobileUserMenu onClose={() => setOpen(false)} />
        </div>
      )}

      {/* Drinks modal */}
      {drinksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setDrinksModalOpen(false)}
          />
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-50">
            <h3 className="text-lg font-semibold mb-4">
              Edit Available Drinks
            </h3>

            {loadingDrinks ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {drinks.map((d) => (
                  <label key={d.id} className="flex items-center gap-3 text-xl">
                    <input
                      type="checkbox"
                      className="min-w-4 min-h-4 accent-primary-navy"
                      checked={d.is_available}
                      onChange={() => toggleDrink(d.id)}
                    />
                    <span>{d.name}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-between gap-3 mt-5">
              <button
                className="text-primary-navy bg-mid-grey border-2 border-dark-grey/50 font-semibold px-4 py-1 rounded cursor-pointer"
                onClick={() => setDrinksModalOpen(false)}
                disabled={saving}>
                Cancel
              </button>
              <button
                className="text-light-grey bg-primary-navy font-semibold px-4 py-1 rounded cursor-pointer"
                onClick={saveDrinks}
                disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
