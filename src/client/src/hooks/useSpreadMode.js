import { useCallback, useEffect, useState } from "react";

import { getSpreadMode, setSpreadMode } from "../utilities/spreadMode";

const getInitialValue = () => getSpreadMode() === "1";

const useSpreadMode = () => {
  const [spreadMode, setSpreadModeState] = useState(getInitialValue);

  const enableSpreadMode = useCallback(() => {
    setSpreadMode("1");
    setSpreadModeState(true);
  }, []);

  const disableSpreadMode = useCallback(() => {
    setSpreadMode("0");
    setSpreadModeState(false);
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== "spreadModeToggle") return;
      setSpreadModeState(getInitialValue());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    spreadMode,
    enableSpreadMode,
    disableSpreadMode,
  };
};

export default useSpreadMode;
