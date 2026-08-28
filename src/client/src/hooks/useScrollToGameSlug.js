import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  assignGameSlugs,
  detectRouteBase,
  parseNavigationPath,
  withGameSlug,
} from "../utilities/navigationPaths";

const useScrollToGameSlug = ({ games = [], enabled = true }) => {
  const location = useLocation();

  useEffect(() => {
    if (!enabled || !games.length) return;

    const routeBase = detectRouteBase(location.pathname);
    const { gameSlug } = parseNavigationPath(location.pathname, routeBase);

    const scrollToSlug = (slug) => {
      if (!slug) return false;

      const element = document.getElementById(slug);
      if (!element) return false;

      element.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };

    if (scrollToSlug(gameSlug)) {
      return;
    }

    const hashSlug = location.hash.startsWith("#") ? location.hash.slice(1) : "";
    if (hashSlug && !hashSlug.startsWith("game-")) {
      const pathWithSlug = withGameSlug(location.pathname, routeBase, hashSlug);
      window.history.replaceState({}, "", pathWithSlug);
      scrollToSlug(hashSlug);
      return;
    }

    const legacyHash = location.hash;
    if (!legacyHash.startsWith("#game-")) {
      return;
    }

    const legacyGameId = legacyHash.slice("#game-".length);
    const slugByGameId = assignGameSlugs(games);
    scrollToSlug(slugByGameId[legacyGameId]);
  }, [enabled, games, location.hash, location.pathname]);
};

export default useScrollToGameSlug;
