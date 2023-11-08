import { Button, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";

const equations = [
  { label: "y = x", equation: (x) => x },
  { label: "y = x^2", equation: (x) => x ** 2 },
  { label: "y = ln(x)", equation: (x) => Math.log(x) },
];

export function Component(): JSX.Element {
  const [selectedEquation, setSelectedEquation] = useState(equations[0]);

  const data = [...Array(6).keys()].map((x) => ({
    x: x * 10,
    y: selectedEquation.equation(x * 10),
  }));

  render () {
  return (
    <Container>
      <Typography variant="h4" align="center">
        Line Chart
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        {equations.map((eq) => (
          <Grid item key={eq.label}>
            <Button
              variant={eq === selectedEquation ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedEquation(eq)}
            >
              {eq.label}
            </Button>
          </Grid>
        ))}
      </Grid>
      {/*
      <LineChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          label={{ value: "X", position: "insideBottomRight", offset: 0 }}
        />
        <YAxis label={{ value: "Y", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="y"
          name={selectedEquation.label}
          stroke="#8884d8"
        />
      </LineChart>
        */}
    </Container>
  );}
}

Component.displayName = "Download";
