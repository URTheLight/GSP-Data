import { Box, Typography } from "@mui/material";

export function Component(): JSX.Element {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
      <Typography variant="h2" align="center">
        Coming Soon with Country Spotlights and Sentiment Analysis...
      </Typography>
    </Box>
  );
}

Component.displayName = "Download";
