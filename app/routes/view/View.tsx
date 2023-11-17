/* Copyright: 2023 Arrighi Center for Global Studies */

import
{
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import
{
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { useCurrentUser } from "../../core/auth.js";
import { usePageEffect } from "../../core/page.js";

type CollectionItem = {
  _id: string;
  Title: string;
  year_old: number;
  DocumentURL: string;
  socialProtestTF: string;
};

type FormData = {
  country: string[];
  region: string;
  searchTerm: string;
  filterBy: string;
  source: string;
  show: string;
  years: number[];
};

const initialFormData: FormData = {
  country: [],
  region: "World",
  years: [ 1792, 2016 ],
  searchTerm: "",
  filterBy: "",
  source: "nyt&guardian",
  show: "time",
};

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bolivia",
  "Borneo",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of Congo",
  "Denmark",
  "Djibouti",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Empire",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Federated States of Micronesia",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guadeloupe",
  "Guatemala",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Korea",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Lithuania",
  "Luxembourg",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Multiple Countries",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "Norway",
  "Not a Country",
  "Oman",
  "Pakistan",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Polynesia",
  "Portugal",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St. Martin",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "The Netherlands",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Uganda",
  "UK",
  "Ukraine",
  "Unclear",
  "United Arab Emirates",
  "Uruguay",
  "USA",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Western Sahara",
  "Yemen",
  "Yugoslavia",
  "Zambia",
  "Zimbabwe",
];

const labelTooltipText = `0 = false positive (no social protest)
1 = true positive (hierarchical social protest)
2 = hard call/uncoded 2 minute rule
5 = domestic hard call/uncoded 5 second rule
9 = horizontal social protest/individual protest`;

const CustomTablePagination = styled( TablePagination )`
  & .${ classes.toolbar } {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${ classes.selectLabel } {
    margin: 0;
  }

  & .${ classes.displayedRows } {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${ classes.spacer } {
    display: none;
  }

  & .${ classes.actions } {
    display: flex;
    gap: 0.25rem;
  }
`;

export function Component (): JSX.Element
{
  usePageEffect( { title: "Global Social Protest" } );
  const [ formData, setFormData ] = useState<FormData>( initialFormData );
  // set method for potentially disabling a field when the other is at use
  const [ isCountrySelected, setIsCountrySelected ] = useState( false );
  const [ isFilterSelected, setIsFilterSelected ] = useState( false );
  const [ collectionData, setCollectionData ] = useState<CollectionItem[]>( [] );
  const [ page, setPage ] = useState( 0 );
  const [ rowsPerPage, setRowsPerPage ] = useState( 5 );
  const tableContainerRef = useRef( null );
  const [ isLoading, setIsLoading ] = useState( true );
  const [ chartInstance, setChartInstance ] = useState<Chart | null>( null );
  const currentUser = useCurrentUser();

  const filteredData = collectionData.filter( ( item ) =>
  {
    // Check for country filter
    let matchesCountry = true;
    if ( formData.country && formData.country.length > 0 )
    {
      matchesCountry = formData.country.some(
        ( country ) =>
          item.locationCountryNew &&
          item.locationCountryNew.includes( country.toUpperCase() ),
      );
    }

    // Initialize matchesSearchTerm to true
    let matchesSearchTerm = true;

    if ( formData.searchTerm )
    {
      const searchTermLower = formData.searchTerm.toLowerCase();
      if ( item.source === "NYT" )
      {
        // For NYT, check both title and abstract
        matchesSearchTerm =
          ( item.Title && item.Title.toLowerCase().includes( searchTermLower ) ) ||
          ( item.Abstract &&
            item.Abstract.toLowerCase().includes( searchTermLower ) );
      } else if ( item.source === "Guardian" )
      {
        // For Guardian, check only title
        matchesSearchTerm =
          item.Title && item.Title.toLowerCase().includes( searchTermLower );
      }
    }

    // Check for year range filter
    const yearInRange =
      item.year_old >= formData.years[ 0 ] && item.year_old <= formData.years[ 1 ];

    // Check for source filter
    let matchesSource = true;
    if ( formData.source === "nyt" )
    {
      matchesSource = item.source === "NYT";
    } else if ( formData.source === "guardian" )
    {
      matchesSource = item.source === "Guardian";
    }
    // If formData.source is 'both' or not set, matchesSource remains true

    // Return true if item passes all filters
    return matchesCountry && matchesSearchTerm && yearInRange && matchesSource;
  } );

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >,
    key: keyof typeof formData,
  ) =>
  {
    let value = event.target.value;

    // Check if the input change is for the years (slider)
    if ( key === "years" && Array.isArray( value ) )
    {
      value = value as number[]; // Cast value to an array of numbers
    } else
    {
      value = value as string | number; // Cast value to string or number for other inputs
    }

    setFormData( ( prevData ) =>
    {
      let updates = {};

      if ( key === "country" )
      {
        updates = { ...prevData, region: "", country: value };
        setIsCountrySelected( true );
      } else if ( key === "region" )
      {
        updates = { ...prevData, country: "", region: value };
        setIsCountrySelected( false );
      } else if ( key === "searchTerm" )
      {
        updates = { ...prevData, filterBy: "", searchTerm: value };
        setIsFilterSelected( true );
      } else if ( key === "filterBy" )
      {
        updates = { ...prevData, searchTerm: "", filterBy: value };
        setIsFilterSelected( true );
      } else
      {
        updates = { ...prevData, [ key ]: value };
      }

      // Reset to first page on change
      setPage( 0 );

      // Return the updated object
      return { ...updates };
    } );
  };

  // Handler for changing the page
  const handleChangePage = ( event: unknown, newPage: number ) =>
  {
    setPage( newPage );
    if ( tableContainerRef.current )
    {
      tableContainerRef.current.scrollTop = 0;
    }
  };

  // Handler for changing the number of rows per page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) =>
  {
    setRowsPerPage( parseInt( event.target.value, 10 ) );
    setPage( 0 );
  };

  useEffect( () =>
  {
    const fetchData = async () =>
    {
      setIsLoading( true );
      try
      {
        const response = await fetch( "http://0.0.0.0:3001/data" );
        const data = await response.json();
        setCollectionData( data );
      } catch ( error )
      {
        console.error( "Error fetching data:", error );
      } finally
      {
        setIsLoading( false );
      }
    };

    fetchData();
  }, [] );

  const renderTable = () =>
  {
    if ( isLoading )
    {
      return (
        <Box
          sx={ {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          } }
        >
          <CircularProgress />
          <Typography style={ { marginTop: 20 } }>
            It may take a while...
          </Typography>
        </Box>
      );
    }
    // Calculate the current page slice of collection data
    const firstRowIndexOfPage = page * rowsPerPage;
    const lastRowIndexOfPage = firstRowIndexOfPage + rowsPerPage;
    const currentRows = filteredData.slice(
      firstRowIndexOfPage,
      lastRowIndexOfPage,
    );
    // Fixed height for the table container
    const fixedTableHeight = "280px";

    return (
      <>
        <Box sx={ { width: "100%" } }>
          {/* Sticky Table Header */ }
          <Box
            sx={ {
              position: "sticky",
              top: 0,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              background: "white",
              padding: "16px",
              zIndex: 1,
            } }
          >
            <Box sx={ { width: "68%", textAlign: "left", fontWeight: "bold" } }>
              Title
            </Box>
            <Box sx={ { width: "17%", textAlign: "right", fontWeight: "bold" } }>
              Year Published
            </Box>
            <Box sx={ { width: "15%", textAlign: "right", fontWeight: "bold" } }>
              Label
              <Tooltip
                title={ <pre>{ labelTooltipText }</pre> }
                placement="top"
                sx={ { typography: "body1" } }
              >
                <IconButton>
                  <HelpOutlineIcon style={ { fontSize: 13 } } />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Scrollable TableBody within TableContainer */ }
          <TableContainer
            ref={ tableContainerRef }
            component={ Paper }
            sx={ { overflow: "auto", height: fixedTableHeight } }
          >
            <Table aria-label="main table" sx={ { tableLayout: "fixed" } }>
              <TableBody>
                { currentRows.map( ( item ) => (
                  <TableRow key={ item._id }>
                    <TableCell component="th" scope="row" sx={ { width: "68%" } }>
                      <a
                        href={ item.DocumentURL }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        { item.Title }
                      </a>
                    </TableCell>
                    <TableCell align="center" sx={ { width: "17%" } }>
                      { item.year_old }
                    </TableCell>
                    <TableCell align="center" sx={ { width: "15%" } }>
                      { item.socialProtestTF }
                    </TableCell>
                  </TableRow>
                ) ) }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <CustomTablePagination
          rowsPerPageOptions={ [ 5, 10, 25 ] }
          colSpan={ 3 }
          count={ filteredData.length }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
          slotProps={ {
            select: {
              "aria-label": "rows per page",
            },
            actions: {
              showFirstButton: true,
              showLastButton: true,
            },
          } }
        />
      </>
    );
  };

  const renderLineChart = () =>
  {
    if ( isLoading )
    {
      return (
        <Box
          sx={ {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          } }
        >
          <CircularProgress />
          <Typography style={ { marginTop: 20 } }>Loading...</Typography>
        </Box>
      );
    }

    // Define a color palette for the chart
    const colorPalette = [
      "rgb(34, 142, 245)",
      "rgb(245, 49, 82)",
      "rgb(0, 170, 0)",
      "rgb(206, 206, 0)",
      "rgb(153, 102, 255)",
      "rgb(178, 235, 242)",
      "rgb(192, 78, 1)",
    ];
    const totalColor = "rgb(162, 162, 162)"; // Distinct color for the total dataset

    // Find the range of years in filteredData
    const years = filteredData.map( ( item ) => item.year_old );
    const minYear = Math.min( ...years );
    const maxYear = Math.max( ...years );

    // Initialize an object with all years and count 0
    const initialCountByYear = {};
    for ( let year = minYear; year <= maxYear; year++ )
    {
      initialCountByYear[ year ] = 0;
    }

    const countByYear = { ...initialCountByYear };

    // Aggregate data by year
    filteredData.forEach( ( item ) =>
    {
      countByYear[ item.year_old ]++;
    } );

    // Handle no country selected case - aggregate for all data
    let datasets = [];
    if ( formData.country.length === 0 )
    {
      datasets.push( {
        label: "Total Articles for the World by Year",
        data: Object.values( countByYear ),
        fill: false,
        // Assign color for the total
      } );
    } else
    {
      // Handle selected countries case
      const initialCountByYearAndCountry = {};
      formData.country.forEach( ( country ) =>
      {
        initialCountByYearAndCountry[ country ] = { ...initialCountByYear };
      } );

      filteredData.forEach( ( item ) =>
      {
        formData.country.forEach( ( country ) =>
        {
          if ( item.locationCountryNew.includes( country.toUpperCase() ) )
          {
            initialCountByYearAndCountry[ country ][ item.year_old ]++;
          }
        } );
      } );

      datasets = formData.country.map( ( country, index ) => ( {
        label: `Articles for ${ country }`,
        data: Object.values( initialCountByYearAndCountry[ country ] ),
        fill: false,
        borderColor: colorPalette[ index % colorPalette.length ], // Assign color from palette
        backgroundColor: colorPalette[ index % colorPalette.length ],
      } ) );

      // Add total data only if more than one country is selected
      if ( formData.country.length > 1 )
      {
        const totalData = Array( maxYear - minYear + 1 ).fill( 0 ); // Initialize totalData array

        for ( let year = minYear; year <= maxYear; year++ )
        {
          formData.country.forEach( ( country ) =>
          {
            if ( initialCountByYearAndCountry[ country ][ year ] )
            {
              totalData[ year - minYear ] +=
                initialCountByYearAndCountry[ country ][ year ];
            }
          } );
        }

        datasets.push( {
          label: "Total Articles",
          data: totalData,
          fill: false,
          borderColor: totalColor, // Assign distinct color for the total dataset
          backgroundColor: totalColor,
        } );
      }
    }

    const chartData = {
      labels: Object.keys( initialCountByYear ).sort(),
      datasets: datasets,
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <div style={ { height: "362px", width: "100%" } }>
        <Line ref={ chartRefCallback } data={ chartData } options={ options } />
      </div>
    );
  };

  const renderHeatMap = () =>
  {
    return (
      <Box
        sx={ {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        } }
      >
        <Typography style={ { marginTop: 20 } }>Under Construction...</Typography>
      </Box>
    );
  };

  const chartRefCallback = ( chart: Chart ) =>
  {
    if ( chart )
    {
      setChartInstance( chart );
    }
  };

  const convertTimeSeriesToCSV = ( filteredData, formData ) =>
  {
    const startYear = formData.years[ 0 ];
    const endYear =
      formData.years[ 1 ] ||
      Math.max( ...filteredData.map( ( item ) => item.year_old ) );

    // Initialize counts for each year for each country
    const initialCountByYearAndCountry = {};
    formData.country.forEach( ( country ) =>
    {
      initialCountByYearAndCountry[ country ] = {};
      for ( let year = startYear; year <= endYear; year++ )
      {
        initialCountByYearAndCountry[ country ][ year ] = 0;
      }
    } );

    // Aggregate data by year for each country
    filteredData.forEach( ( item ) =>
    {
      formData.country.forEach( ( country ) =>
      {
        if ( item.locationCountryNew.includes( country.toUpperCase() ) )
        {
          initialCountByYearAndCountry[ country ][ item.year_old ]++;
        }
      } );
    } );

    // Prepare CSV content
    let csvContent =
      "Year," +
      formData.country.join( "," ) +
      ( formData.country.length > 1 ? ",Total\n" : "\n" );
    for ( let year = startYear; year <= endYear; year++ )
    {
      let row = `${ year }`;
      let total = 0;
      formData.country.forEach( ( country ) =>
      {
        row += `,${ initialCountByYearAndCountry[ country ][ year ] }`;
        total += initialCountByYearAndCountry[ country ][ year ];
      } );
      if ( formData.country.length > 1 )
      {
        row += `,${ total }`;
      }
      csvContent += row + "\n";
    }

    return csvContent;
  };

  const convertToCSV = ( arr: CollectionItem[] ): string =>
  {
    const array = [ Object.keys( arr[ 0 ] ) ].concat( arr as any );
    return array
      .map( ( it: any ) =>
      {
        return Object.values( it ).toString();
      } )
      .join( "\n" );
  };

  const downloadCSV = ( csvString: string, formData: FormData ): void =>
  {
    // Filter out the non-empty values and join them to form a filename
    const nonEmptyValues = Object.values( formData ).filter(
      ( value ) => value && value.toString().trim() !== "",
    );
    const filename = nonEmptyValues.join( "_" ) + ".csv";

    const blob = new Blob( [ csvString ], { type: "text/csv;charset=utf-8;" } );
    const link = document.createElement( "a" );
    const url = URL.createObjectURL( blob );
    link.setAttribute( "href", url );
    link.setAttribute( "download", filename );
    link.style.visibility = "hidden";
    document.body.appendChild( link );
    link.click();
    document.body.removeChild( link );
  };

  if ( currentUser === undefined )
  {
    // Loading state
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  } else if ( currentUser === null )
  {
    // Not logged in state
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <Typography variant="h2" align="center">
          Authorized use only. Please log in.
        </Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={ {
        display: "flex",
        justifyContent: "space-between",
        py: "10vh",
      } }
    >
      {/* Left Box (Control Panel) */ }
      <Paper
        sx={ {
          padding: "16px",
          width: "28%",
          height: "480px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        } }
      >
        <Typography>Choose a Location</Typography>
        <FormControl fullWidth>
          <Autocomplete
            multiple
            onChange={ ( event, newValue ) =>
            {
              // newValue will be an array of selected items
              handleInputChange( { target: { value: newValue } }, "country" );
            } }
            value={ formData.country }
            options={ countries }
            renderInput={ ( params ) => (
              <TextField { ...params } label="Country" variant="filled" />
            ) }
            renderTags={ ( value, getTagProps ) =>
              value.map( ( option, index ) => (
                <Chip
                  variant="outlined"
                  label={ option }
                  size="small"
                  { ...getTagProps( { index } ) }
                  style={ { margin: 2 } } // Adjust chip styling as needed
                />
              ) )
            }
            style={ { marginTop: "8px", height: "65px", overflowY: "auto" } }
          />
        </FormControl>
        <FormControl fullWidth style={ { marginBottom: "10px" } } disabled>
          <InputLabel>Region</InputLabel>
          <Select
            value={ formData.region }
            label="Region"
            onChange={ ( event, newValue ) => handleInputChange( event, "region" ) }
            variant="filled"
          >
            <MenuItem value="World">World</MenuItem>
            <MenuItem value="Africa">Africa</MenuItem>
            <MenuItem value="Arab">Arab States</MenuItem>
            <MenuItem value="Asia">Asia and the Pacific</MenuItem>
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Latin">Latin America</MenuItem>
          </Select>
        </FormControl>

        <Typography style={ { marginBottom: "8px" } }>Add a Filter</Typography>
        <TextField
          label="Search Term"
          fullWidth
          onChange={ ( event, newValue ) => handleInputChange( event, "searchTerm" ) }
          value={ formData.searchTerm }
          style={ { marginBottom: "8px" } }
          variant="filled"
        />
        <FormControl
          fullWidth
          style={ { marginBottom: "10px" } }
          disabled
          variant="standard"
        >
          <TextField
            label="Filter By"
            fullWidth
            onChange={ ( event, newValue ) => handleInputChange( event, "filterBy" ) }
            value={ formData.filterBy }
            style={ { marginBottom: "8px" } }
            variant="filled"
            disabled
          />
        </FormControl>
        <FormControl fullWidth style={ { marginBottom: "8px" } }>
          <InputLabel>Source</InputLabel>
          <Select
            value={ formData.source }
            label="Region"
            onChange={ ( event, newValue ) => handleInputChange( event, "source" ) }
          >
            <MenuItem value="nyt&guardian">NYT & Guardian</MenuItem>
            <MenuItem value="nyt">New York Times</MenuItem>
            <MenuItem value="guardian">The Guardian</MenuItem>
          </Select>
        </FormControl>
        { formData.show === "time" ? (
          <Button
            variant="contained"
            color="primary"
            style={ { marginTop: "12px" } }
            onClick={ () =>
              downloadCSV(
                convertTimeSeriesToCSV( filteredData, formData ),
                formData,
              )
            }
          >
            Download Counts
          </Button>
        ) : formData.show === "detail" ? (
          <Button
            variant="contained"
            color="primary"
            style={ { marginTop: "12px" } }
            onClick={ () => downloadCSV( convertToCSV( filteredData ), formData ) }
          >
            Download Data
          </Button>
        ) : formData.show === "map" ? (
          <Button
            variant="contained"
            color="primary"
            style={ { marginTop: "12px" } }
          >
            Download Map
          </Button>
        ) : null }
      </Paper>
      <Paper
        sx={ {
          padding: "16px",
          width: "70%",
          height: "480px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // This will align children to the start and end of the container
        } }
      >
        <Box
          sx={ {
            display: "flex",
            justifyContent: "center", // This will center the ButtonGroup horizontally
            width: "100%", // Ensures the Box takes full width of the Paper
          } }
        >
          <ButtonGroup
            value={ formData.show }
            exclusive
            onChange={ ( event, newValue ) => handleInputChange( event, "show" ) }
            color="primary"
            aria-label="data display options"
          >
            <Button
              value="time"
              onClick={ () => setFormData( { ...formData, show: "time" } ) }
            >
              Time Series
            </Button>
            <Button
              value="detail"
              onClick={ () => setFormData( { ...formData, show: "detail" } ) }
            >
              Detailed Events
            </Button>
            <Button
              value="map"
              onClick={ () => setFormData( { ...formData, show: "map" } ) }
            >
              Heat Map
            </Button>
          </ButtonGroup>
        </Box>

        {/* Display the content here */ }
        { formData.show === "time"
          ? renderLineChart()
          : formData.show === "detail"
            ? renderTable()
            : formData.show === "map"
              ? renderHeatMap()
              : null }
        <Box
          flexGrow={ 1 }
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Slider
            value={ formData.years }
            onChange={ ( event, newValue ) => handleInputChange( event, "years" ) }
            valueLabelDisplay="auto"
            min={ 1792 }
            max={ 2016 }
            sx={ { width: 300 } }
          />
          <Typography variant="h6" gutterBottom>
            Years
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

Component.displayName = "View";
