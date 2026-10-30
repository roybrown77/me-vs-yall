import Typography from "@mui/material/Typography";

export const STANDINGS_REFRESH_NOTICE =
  "Updates daily at 7 a.m. During game days, also at 1, 5, 8 and 11:59 p.m.";

const StandingsRefreshNotice = () => (
  <Typography
    component="p"
    variant="caption"
    sx={{
      color: "text.secondary",
      textAlign: "center",
      mt: 0.5,
      mb: 1,
      px: 1,
      lineHeight: 1.35,
    }}
  >
    {STANDINGS_REFRESH_NOTICE}
  </Typography>
);

export default StandingsRefreshNotice;
