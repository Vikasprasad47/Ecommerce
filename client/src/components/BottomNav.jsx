import React, { useState } from "react";
import {
  Tags,
  MessageCircle,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { BiSolidCategory } from "react-icons/bi";

const BottomNav = () => {
  const [active, setActive] = useState("categories");

  const navLinkStyle = (id) =>
    `group flex flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-wide transition-all duration-300 ${
      active === id
        ? "text-amber-600"
        : "text-gray-400 hover:text-amber-500"
    }`;

  const iconWrapStyle = (id) =>
    `p-2 rounded-full transition-all duration-300 ${
      active === id
        ? "bg-amber-100 shadow-xl ring-2 ring-amber-500 scale-110"
        : "hover:bg-white/40"
    }`;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[97%] mx-auto px-4 py-2 bg-white rounded-3xl border border-white/20 flex justify-around items-center z-50 transition-all">
      <a
        href="/comming-soon"
        onClick={() => setActive("deals")}
        className={navLinkStyle("deals")}
      >
        <div className={iconWrapStyle("deals")}>
          <Tags size={22} strokeWidth={2} />
        </div>
        <span>Deals</span>
      </a>

      <a
        href="/comming-soon"
        onClick={() => setActive("chat")}
        className={navLinkStyle("chat")}
      >
        <div className={iconWrapStyle("chat")}>
          <MessageCircle size={22} strokeWidth={2} />
        </div>
        <span>Chat</span>
      </a>

      <a
        href="/comming-soon"
        onClick={() => setActive("categories")}
        className={navLinkStyle("categories")}
      >
        <div className={iconWrapStyle("categories")}>
          <BiSolidCategory size={22} />
        </div>
        <span>Categories</span>
      </a>

      <a
        href="/wishlist"
        onClick={() => setActive("wishlist")}
        className={navLinkStyle("wishlist")}
      >
        <div className={iconWrapStyle("wishlist")}>
          <Heart size={22} strokeWidth={2} />
        </div>
        <span>Wishlist</span>
      </a>

      <a
        href="/dashboard/myorder"
        onClick={() => setActive("orders")}
        className={navLinkStyle("orders")}
      >
        <div className={iconWrapStyle("orders")}>
          <ShoppingCart size={22} strokeWidth={2} />
        </div>
        <span>Orders</span>
      </a>
    </nav>
  );
};

export default BottomNav;
