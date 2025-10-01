import React, { useState, useRef, useEffect } from "react";
import logo2 from "../assets/main_logo.png";
import Search from "../components/search";
import DisplayCartItems from "../components/DisplayCartItems";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BsShop } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { useSelector } from "react-redux";
import useMobile from "../Hooks/useMobile";
import UserMenu from "./userMenu";
import { useGlobalContext } from "../provider/globalProvider";

const Header = () => {
  const [isMobile] = useMobile();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const { totalQty } = useGlobalContext();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);
  const userMenuRef = useRef(null);

  const redirectToLoginPage = () => navigate("/login");
  const handleMobileUsers = () => {
    if (!user?._id) return navigate("/login");
    navigate("/user");
  };

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 shadow-lg">
      {/* Gradient Topbar */}
      <div className="bg-gradient-to-b from-amber-300 via-amber-200 to-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer">
            <img
              src={logo2}
              alt="Quickoo logo"
              className="w-[120px] sm:w-[140px] h-auto object-contain"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center mx-6 max-w-2xl">
            <Search />
          </div>

          {/* Right side: User, Cart, Seller */}
          <div className="flex items-center gap-5 text-gray-800">
            {/* User Section */}
            {user?._id ? (
              <>
                <div
                  className="relative hidden md:flex items-center"
                  ref={userMenuRef}
                >
                  <button
                    onClick={() => setOpenUserMenu(!openUserMenu)}
                    className="flex items-center gap-1 font-medium text-sm hover:text-purple-700 transition"
                  >
                    {user.name?.length > 14
                      ? `${user.name.slice(0, 10)}...`
                      : user.name || user.phone}
                    {openUserMenu ? (
                      <CiCircleChevUp size={18} />
                    ) : (
                      <CiCircleChevDown size={18} />
                    )}
                  </button>
                  {openUserMenu && (
                    <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl p-4 min-w-[240px] z-50 border border-gray-200">
                      <UserMenu close={() => setOpenUserMenu(false)} />
                    </div>
                  )}
                </div>

                {/* Mobile user icon */}
                <div className="md:hidden">
                  <button
                    onClick={handleMobileUsers}
                    className="p-2 rounded-full hover:bg-amber-100 transition"
                  >
                    <FaUserCircle size={28} className="text-gray-800" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={redirectToLoginPage}
                className="flex items-center gap-1 text-sm font-medium hover:text-purple-700 transition"
              >
                <FaUserCircle size={20} />
                Login
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setOpenCartSection(true)}
              className="relative flex items-center gap-1 text-sm font-medium hover:text-purple-700 transition"
            >
              <FaCartShopping size={24} />
              <span className="hidden sm:inline">Cart</span>
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] rounded-full h-4 w-4 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>

            {/* Seller */}
            <button
              className="hidden lg:flex items-center gap-1 text-sm font-medium hover:text-purple-700 transition"
              title="Become A Seller"
            >
              <BsShop size={22} />
              <span className="hidden xl:inline">Sell</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search + navigation */}
      {isMobile && (
        <div className="w-full px-3 py-2 bg-white flex items-center justify-between gap-2 border-t border-gray-200 shadow-md">
          <button
            onClick={() => navigate("/")}
            className="text-amber-600 text-xs flex flex-col justify-center items-center hover:text-purple-700 transition"
          >
            <GoHomeFill size={20} />
            <p className="text-[11px]">Home</p>
          </button>
          <div className="flex-1">
            <Search />
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      {openCartSection && (
        <DisplayCartItems close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
