import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  assignGameSlugs,
  detectRouteBase,
  parseNavigationPath,
  withGameSlug,
} from "../utilities/navigationPaths";

export const scrollGameIntoView = (element) => {
  if (!element || typeof window === "undefined") return false;

  const align = () => {
    const header = document.querySelector(
      ".MuiAppBar-positionFixed, .MuiAppBar-positionSticky"
    );
    const headerBottom = header
      ? Math.ceil(header.getBoundingClientRect().bottom)
      : 0;
    const top =
      element.getBoundingClientRect().top + window.scrollY - headerBottom - 8;

    window.scrollTo(0, Math.max(0, top));
  };

  align();
  window.requestAnimationFrame(align);
  return true;
};

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

      return scrollGameIntoView(element);
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
