/* Copyright: 2023 Arrighi Center for Global Studies */
/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import React, { useState } from "react";
import { usePageEffect } from "../../core/page.js";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
  TextField,
} from "@mui/material";

interface FormData {
  country: string;
  region: string;
  searchTerm: string;
  filterBy: string;
  source: string;
  show: string;
  years: number[];
}

const initialFormData: FormData = {
  country: "World",
  region: "",
  searchTerm: "",
  filterBy: "",
  source: "both",
  show: "chart",
  years: [1850, 2014],
};

export function Component(): JSX.Element {
  usePageEffect({ title: "Global Social Protest" });
  const [formData, setFormData] = useState<FormData>(initialFormData);
  // set method for potentially disabling a field when the other is at use
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [keyProp, setKeyProp] = useState(0);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>,
    key: keyof typeof formData,
  ) => {
    const value = event.target.value as string | number;

    if (key === "years") {
      // Ensure years is an array of two numbers
      setFormData((prevData) => ({
        ...prevData,
        years: Array.isArray(value) ? value : prevData.years,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }

    if (key === "country") {
      // If a country is selected, clear the region field
      setFormData((prevData) => ({ ...prevData, region: "" }));
      setIsCountrySelected(true);
    } else if (key === "region") {
      // If a region is selected, clear the country field
      setFormData((prevData) => ({ ...prevData, country: "" }));
      setIsCountrySelected(false);
    }

    if (key === "searchTerm") {
      // If a country is selected, clear the region field
      setFormData((prevData) => ({ ...prevData, filterBy: "" }));
      setIsFilterSelected(true);
    } else if (key === "filterBy") {
      // If a region is selected, clear the country field
      setFormData((prevData) => ({ ...prevData, searchTerm: "" }));
      setIsFilterSelected(true);
    }

    // Increment the keyProp to trigger remounting of LineChart
    setKeyProp((prevKey) => prevKey + 1);
  };

  const handleYearsChange = (event: Event, newValue: number | number[]) => {
    setFormData((prevData) => ({
      ...prevData,
      years: newValue as number[],
    }));
  };

  const handleSubmit = () => {
    // Call the useForm function here with formData
    // For now, we'll just log the formData
    console.log(formData);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: "10vh",
      }}
    >
      {/* Left Box (Control Panel) */}
      <Paper
        sx={{
          padding: "16px",
          width: "28%",
          height: "480px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography style={{ marginBottom: "10px" }}>
          Choose a Location
        </Typography>
        <TextField
          label="Country"
          fullWidth
          onChange={(e) => handleInputChange(e, "country")}
          value={formData.country}
          style={{ marginBottom: "8px" }}
        />
        <FormControl fullWidth style={{ marginBottom: "10px" }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={formData.region}
            label="Region"
            onChange={(e) => handleInputChange(e, "region")}
          >
            <MenuItem value="Africa">Africa</MenuItem>
            <MenuItem value="Arab">Arab States</MenuItem>
            <MenuItem value="Asia">Asia and the Pacific</MenuItem>
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Latin">Latin America</MenuItem>
          </Select>
        </FormControl>

        <Typography>Add a Filter</Typography>
        <Typography variant="h6" style={{ marginBottom: "10px" }}>
          (Optional)
        </Typography>
        <TextField
          label="Search Term"
          fullWidth
          onChange={(e) => handleInputChange(e, "searchTerm")}
          value={formData.searchTerm}
          style={{ marginBottom: "8px" }}
        />
        <TextField
          label="Filter By"
          fullWidth
          onChange={(e) => handleInputChange(e, "filterBy")}
          value={formData.filterBy}
          style={{ marginBottom: "8px" }}
        />
        <FormControl fullWidth style={{ marginBottom: "8px" }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={formData.source}
            label="Region"
            onChange={(e) => handleInputChange(e, "source")}
          >
            <MenuItem value="both">NYT & Guardian</MenuItem>
            <MenuItem value="nyt">New York Times</MenuItem>
            <MenuItem value="guardian">The Guardian</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Show
        </Button>
      </Paper>
      <Paper
        sx={{
          padding: "16px",
          width: "70%",
          height: "480px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Display the content here */}
        <ButtonGroup
          value={formData.show}
          variant="outlined"
          color="primary"
          aria-label="outlined button group"
          onChange={(e) => handleInputChange(e, "show")}
        >
          <Button value="chart">Time Series</Button>
          <Button value="map">Heat Map</Button>
          <Button value="events">Detailed Events</Button>
        </ButtonGroup>

        {/*{formData.country && formData.years.length === 2 && (
          <LineChart FormData={formData} />
        )}*/}

        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Slider
            value={formData.years}
            onChange={handleYearsChange}
            valueLabelDisplay="auto"
            min={1850}
            max={2014}
            sx={{ width: 300 }}
          />
          <Typography gutterBottom>Years</Typography>
        </Box>
      </Paper>
    </Container>
  );
}

Component.displayName = "View";
