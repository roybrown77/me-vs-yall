import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { leagues } from "../utilities";
import {
  buildGameHeadingText,
  buildGameLinkLabel,
  detectRouteBase,
  parseNavigationPath,
} from "../utilities/navigationPaths";

const DEFAULT_TITLE = "Me vs Yall";
const DEFAULT_DESCRIPTION =
  "The ultimate sports pick'em game. Me vs Yall is a fun and entertaining way to analyze teams and players in the pursuit of correctly guessing who will win.";

const setMetaTag = ({ name, content }) => {
  if (!content) return;

  let tag = document.querySelector(`meta[name="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const formatLeagueLabel = (league) =>
  String(league?.description || league?.name || "Sports").toUpperCase();

const usePageSeo = ({
  enabled = true,
  pageKind = "scores",
  leagueId,
  year,
  week,
  games = [],
  gameSlugById = {},
}) => {
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const league = leagues.find((item) => item.id === leagueId);
    const leagueLabel = formatLeagueLabel(league);
    const weekLabel = week?.displayName || week?.description || week?.name;
    const routeBase = detectRouteBase(location.pathname);
    const { gameSlug } = parseNavigationPath(location.pathname, routeBase);
    const focusedGame = games.find((game) => gameSlugById[game._id] === gameSlug);

    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;

    if (focusedGame) {
      const gameLabel = buildGameLinkLabel(focusedGame);
      const gameHeading = buildGameHeadingText(focusedGame);
      const weekSuffix = weekLabel ? ` ${weekLabel}` : "";

      title = `${gameLabel} Picks | ${leagueLabel}${weekSuffix} | ${DEFAULT_TITLE}`;
      description = `Make your pick for ${gameHeading}. ${leagueLabel}${weekSuffix} scores, spreads, and leader picks on Me vs Yall.`;
    } else if (league && weekLabel && year) {
      if (pageKind === "leaders") {
        title = `${leagueLabel} ${year} ${weekLabel} Leaders | ${DEFAULT_TITLE}`;
        description = `See who is leading ${leagueLabel} ${year} ${weekLabel} on Me vs Yall.`;
      } else {
        title = `${leagueLabel} ${year} ${weekLabel} Scores & Picks | ${DEFAULT_TITLE}`;
        description = `Browse ${leagueLabel} ${year} ${weekLabel} games, make picks, and track live scores on Me vs Yall.`;
      }
    } else if (league) {
      title = `${leagueLabel} Scores & Picks | ${DEFAULT_TITLE}`;
      description = `Browse ${leagueLabel} games, make picks, and track live scores on Me vs Yall.`;
    }

    document.title = title;
    setMetaTag({ name: "description", content: description });
  }, [
    enabled,
    gameSlugById,
    games,
    leagueId,
    location.pathname,
    pageKind,
    week,
    year,
  ]);
};

export default usePageSeo;
