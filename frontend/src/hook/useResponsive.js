import { useEffect, useState } from "react";

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState([0, 0]);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", updateScreenSize);
    updateScreenSize();

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return {
    width: screenSize[0],
    height: screenSize[1],
    isMobile: screenSize[0] < 500,
    isTablet: screenSize[0] >= 500 && screenSize[0] < 800,
    isDesktop: screenSize[0] >= 800,
  };
};

export default useResponsive;
