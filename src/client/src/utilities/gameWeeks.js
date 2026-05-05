import queryString from "query-string";

import { callApi } from "./http";

export const fetchGameWeeks = async ({ leagueId, year, ...extraQuery }) => {
  const gameWeeksQuery = { leagueId, year, ...extraQuery };

  const weeks = await callApi({
    method: "GET",
    endpoint: `/api/gamemanagement/gameweeks?${queryString.stringify(
      gameWeeksQuery
    )}`,
  });

  return weeks;
};
