import React, { memo } from 'react';
import img1 from "../assets/linkImg/1.png";
import img2 from "../assets/linkImg/2.png";
import img3 from "../assets/linkImg/3.png";
import img4 from "../assets/linkImg/4.png";
import img5 from "../assets/linkImg/5.png";
import img6 from "../assets/linkImg/6.png";
import img7 from "../assets/linkImg/7.png";
import img8 from "../assets/linkImg/8.png";
import img9 from "../assets/linkImg/9.png";

const categories = [
  { img: img1, name: "Grocery" },
  { img: img2, name: "Electronics" },
  { img: img3, name: "Fashion" },
  { img: img4, name: "Phones" },
  { img: img5, name: "Homes & Furniture" },
  { img: img6, name: "Health & Beauty" },
  { img: img7, name: "Toys & More" },
  { img: img8, name: "Appliances" },
  { img: img9, name: "Stationery" },
];

// Memoized Category Card
const CategoryItem = memo(({ category }) => (
  <div
    className="flex flex-col items-center w-24 hover:scale-105 transition-transform cursor-pointer hover:text-blue-600 snap-start"
    title={category.name}
  >
    <div className="h-20 w-20 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center">
      <img
        src={category.img}
        alt={category.name}
        className="h-full w-full object-contain transition-transform duration-300 hover:scale-110"
        loading="lazy"
      />
    </div>
    <h1 className="text-[14px] font-medium text-center mt-2 truncate max-w-[110px]">
      {category.name}
    </h1>
  </div>
));

const HeaderCategory = () => {
  return (
    <div className="relative mt-3 px-2 rounded-2xl bg-white shadow-sm">
      {/* Gradient overlay for edges */}
      <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-white pointer-events-none z-10" />
      <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white pointer-events-none z-10" />

      {/* Categories Scroll */}
      <div className="flex items-center gap-6 overflow-x-auto px-2 py-3 scrollbar-hide snap-x snap-mandatory">
        {categories.map((category, index) => (
          <CategoryItem key={index} category={category} />
        ))}
      </div>
    </div>
  );
};

export default HeaderCategory;
