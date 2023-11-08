/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { QueryStats, Download } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { usePageEffect } from "../../core/page.js";

export function Component(): JSX.Element {
  usePageEffect({ title: "Global Social Protest" });

  return (
    <Container sx={{ py: "20vh" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h1" align="center">
        Global Social Protest Working Group
      </Typography>

      <Typography sx={{ mb: 4 }} variant="h3" align="center">
        The group is in the process of creating a new database on global social
        unrest from 1851 to today from events reported in the international
        press, including The New York Times and The Guardian, with the goal of
        mapping the spatial-temporal distribution of events and forms of protest
        and grievances. The working group is also using the database to
        systematically compare the current period with past analogous periods of
        widespread global unrest.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gridGap: "1rem",
        }}
      >
        <Button
          variant="outlined"
          size="large"
          href={`../view`}
          children="Explore Data"
          startIcon={<QueryStats />}
        />
        <Button
          variant="outlined"
          size="large"
          href={`../download`}
          children="Download Data"
          startIcon={<Download />}
        />
      </Box>
    </Container>
  );
}

Component.displayName = "Dashboard";
