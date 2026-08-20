import { useCallback, useEffect, useState } from "react";

import { getSlimUx, setSlimUx } from "../utilities/slimUx";

const getInitialValue = () => getSlimUx() === "1";

const useSlimUx = () => {
  const [slimMode, setSlimModeState] = useState(getInitialValue);

  const enableSlimMode = useCallback(() => {
    setSlimUx("1");
    setSlimModeState(true);
  }, []);

  const disableSlimMode = useCallback(() => {
    setSlimUx("0");
    setSlimModeState(false);
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== "slimUxToggle") return;
      setSlimModeState(getInitialValue());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    slimMode,
    enableSlimMode,
    disableSlimMode,
  };
};

export default useSlimUx;
