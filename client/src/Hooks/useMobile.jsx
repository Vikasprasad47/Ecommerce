// import { useEffect, useState } from "react";

// const useMobile = (breakpoint = 768) => {
//     const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

//     const handleResize = () => { // ✅ Fixed typo (handelResize ➝ handleResize)
//         setIsMobile(window.innerWidth < breakpoint);
//     }

//     useEffect(() => {
//         handleResize();
//         window.addEventListener("resize", handleResize);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//         };
//     }, [breakpoint]);

//     return [isMobile]; // ✅ Return value
// };

// export default useMobile;


import { useEffect, useState } from "react";

const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }
    return false; // default for SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile; // return boolean directly
};

export default useMobile;
