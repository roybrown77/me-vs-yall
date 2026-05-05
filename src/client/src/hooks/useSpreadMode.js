import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const useSpreadMode = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const spreadMode = searchParams.get("spreadMode") === "true";

  const setSpreadModeParam = useCallback(
    (enabled) => {
      const next = new URLSearchParams(window.location.search);
      next.set("spreadMode", enabled ? "true" : "false");
      setSearchParams(next, { replace: true });
    },
    [setSearchParams]
  );

  const enableSpreadMode = useCallback(() => {
    setSpreadModeParam(true);
  }, [setSpreadModeParam]);

  const disableSpreadMode = useCallback(() => {
    setSpreadModeParam(false);
  }, [setSpreadModeParam]);

  return {
    spreadMode,
    enableSpreadMode,
    disableSpreadMode,
  };
};

export default useSpreadMode;
