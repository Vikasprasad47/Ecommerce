import { useEffect, useState } from "react";

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    const handleResize = () => { // ✅ Fixed typo (handelResize ➝ handleResize)
        setIsMobile(window.innerWidth < breakpoint);
    }

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [breakpoint]);

    return [isMobile]; // ✅ Return value
};

export default useMobile;
