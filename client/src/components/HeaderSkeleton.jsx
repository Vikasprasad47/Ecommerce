// import React from "react";

// const HeaderSkeleton = () => {
//   return (
//     <header className="w-full sticky top-0 z-50 shadow-lg bg-white">
//       <div className="bg-gradient-to-b from-amber-300 via-amber-200 to-white">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           {/* Logo skeleton */}
//           <div className="w-[120px] h-8 bg-gray-100 rounded animate-pulse"></div>

//           {/* Search bar skeleton */}
//           <div className="hidden md:flex flex-1 justify-center mx-6 max-w-2xl">
//             <div className="w-full h-10 bg-gray-100 rounded animate-pulse"></div>
//           </div>

//           {/* Right section skeleton (user + cart) */}
//           <div className="flex items-center gap-5">
//             <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
//             <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
//             <div className="hidden lg:flex w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile skeleton */}
//       <div className="md:hidden w-full px-3 py-2 flex items-center justify-between gap-2 border-t border-gray-200 shadow-md">
//         <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
//         <div className="flex-1">
//           <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default HeaderSkeleton;


import React from "react";

/**
 * HeaderSkeleton
 * ------------------------------------------------------------
 * Modern shimmer skeleton for e-commerce headers.
 * Includes self-contained keyframes (no Tailwind config edits needed).
 * ------------------------------------------------------------
 */

const HeaderSkeleton = () => {
  return (
    <>
      {/* Inline shimmer keyframes (self-contained) */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <div className="bg-gradient-to-b from-amber-300 via-amber-200 to-white">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
            {/* Logo shimmer */}
            <div className="relative h-8 w-[120px] overflow-hidden rounded-md bg-gray-200/50">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>

            {/* Search bar shimmer */}
            <div className="hidden md:flex flex-1 justify-center mx-6 max-w-2xl">
              <div className="relative h-10 w-full overflow-hidden rounded-xl bg-gray-200/50">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
              </div>
            </div>

            {/* Action icons shimmer */}
            <div className="flex items-center gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`relative h-8 w-8 overflow-hidden rounded-full bg-gray-200/20 ${
                    i === 2 ? "hidden lg:block" : ""
                  }`}
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile shimmer search bar */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 shadow-sm md:hidden">
          <div className="relative h-6 w-6 overflow-hidden rounded bg-gray-300/50">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
          </div>
          <div className="flex-1">
            <div className="relative h-10 w-full overflow-hidden rounded-md bg-gray-300/50">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderSkeleton;
