import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar, FaCheckCircle, FaShippingFast } from "react-icons/fa";

import boatwatch from "../assets/linkImg/boatwatch.webp";
import projector from "../assets/linkImg/projector.png";
import sonyHeadphone from "../assets/linkImg/sonyheadphone.png";
import samsungtv from "../assets/linkImg/samsungtv.png";
import jblspeaker from "../assets/linkImg/jbl.webp";
import dslr from "../assets/linkImg/dslrc.png";
import oneplusbud from "../assets/linkImg/oneplusbud.webp";

const bestElectronics = [
  { id: 1, img: boatwatch, name: "boAt Smart Watch", price: "₹999", originalPrice: "₹1,427", discount: "30% off", rating: 4.3, delivery: "Free Delivery", availability: "In Stock" },
  { id: 2, img: projector, name: "4K Projector", price: "₹9,999", originalPrice: "₹13,332", discount: "25% off", rating: 4.5, delivery: "Fast Shipping", availability: "Limited Stock" },
  { id: 3, img: sonyHeadphone, name: "Sony WH-1000XM4", price: "₹1,999", originalPrice: "₹3,332", discount: "40% off", rating: 4.8, delivery: "Free Delivery", availability: "In Stock" },
  { id: 4, img: samsungtv, name: "Samsung QLED TV 55”", price: "₹29,999", originalPrice: "₹35,293", discount: "15% off", rating: 4.7, delivery: "Express Shipping", availability: "In Stock" },
  { id: 6, img: jblspeaker, name: "JBL Charge 5 Wireless", price: "₹2,499", originalPrice: "₹3,124", discount: "20% off", rating: 4.4, delivery: "Next Day Delivery", availability: "Limited Stock" },
  { id: 7, img: dslr, name: "Canon EOS R5 Mirrorless", price: "₹39,999", originalPrice: "₹45,454", discount: "12% off", rating: 4.9, delivery: "Secure Packaging", availability: "In Stock" },
  { id: 8, img: oneplusbud, name: "OnePlus Buds Pro 2", price: "₹2,199", originalPrice: "₹2,682", discount: "18% off", rating: 4.5, delivery: "Free Delivery", availability: "In Stock" },
];

// Render rating stars
const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return [
    ...Array(full).fill().map((_, i) => <FaStar key={`f-${i}`} className="text-amber-400 w-4 h-4" />),
    ...(half ? [<FaStarHalfAlt key="h" className="text-amber-400 w-4 h-4" />] : []),
    ...Array(empty).fill().map((_, i) => <FaRegStar key={`e-${i}`} className="text-gray-300 w-4 h-4" />),
  ];
};

// Memoized Product Card with modern UI
const ProductCard = memo(({ item }) => (
  <div className="flex-shrink-0 w-44 sm:w-48 lg:w-52 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
    <div className="relative h-28 lg:h-32 bg-gray-50 flex items-center justify-center p-3">
      {/* Discount Badge */}
      <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
        {item.discount}
      </span>
      <img src={item.img} alt={item.name} className="h-full object-contain transition-transform duration-500 group-hover:scale-110" loading="lazy" />
    </div>

    <div className="px-3 py-2 space-y-1">
      {/* Product Name */}
      <h3 className="font-medium text-gray-900 text-sm line-clamp-2" title={item.name}>{item.name}</h3>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <div className="flex">{renderStars(item.rating)}</div>
        <span className="text-xs text-gray-500">{item.rating.toFixed(1)}</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">{item.price}</span>
        <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
      </div>

      {/* Availability & Delivery */}
      <div className="flex justify-between items-center text-xs pt-1">
        <span className={`flex items-center gap-1 ${item.availability === "In Stock" ? "text-green-600" : "text-amber-600"}`}>
          {item.availability === "In Stock" ? <FaCheckCircle /> : <FaShippingFast />}
          {item.availability}
        </span>
        <span className="text-gray-400 hidden lg:flex">{item.delivery}</span>
      </div>
    </div>
  </div>
));

const TopDisplayHeaderProduct = () => {
  const scrollRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setIsScrolled(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  const scroll = useCallback((dir) => {
    const scrollAmount = dir === "left" ? -340 : 340;
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const ref = scrollRef.current;
    checkScroll();
    ref?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      ref?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <section className="w-full bg-white py-5 px-4 sm:px-6 lg:px-8 mt-4 mb-4 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best of Electronics</h2>
          <p className="text-gray-500 text-sm hidden md:flex mt-1">Premium gadgets curated for tech enthusiasts</p>
        </div>
        <button className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
          View <FiChevronRight className="ml-1 w-5 h-5" />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative">
        {isScrolled && (
          <button onClick={() => scroll("left")} className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
            <FiChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
        {canScrollRight && (
          <button onClick={() => scroll("right")} className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
            <FiChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-0 no-scrollbar snap-x snap-mandatory">
          {bestElectronics.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDisplayHeaderProduct;
