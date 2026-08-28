import { useCallback, useEffect, useRef } from "react";

const useNavigationRequestAbort = () => {
  const abortControllerRef = useRef(null);

  const beginNavigationRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  }, []);

  const abortNavigationRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  useEffect(() => abortNavigationRequest, [abortNavigationRequest]);

  return {
    beginNavigationRequest,
    abortNavigationRequest,
  };
};

export default useNavigationRequestAbort;
