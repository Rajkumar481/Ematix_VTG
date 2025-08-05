import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  Modal,
  List,
  ListItem,
  ListItemText,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Container,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CalendarToday,
  People,
  LocationOn,
  Phone,
  Schedule,
  LocalPharmacy,
  DirectionsRun,
  LocalShipping,
  Dashboard as DashboardIcon,
  FilterList,
  Clear,
  Search,
  DateRange,
  Filter,
  CalendarViewDaySharp,
  X,
  Person,
  PhoneAndroid,
  Map,
  CalendarTodaySharp,
  ClearAll,
  Delete,
  MedicationOutlined,
} from "@mui/icons-material";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [patientData, setPatientData] = useState([]);
  const [allPatientData, setAllPatientData] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    address: "",
    nextVisitDate: null,
    startDate: null,
    endDate: null,
  });

  const fetchData = async (date) => {
    try {
      const response = await axios.get("http://localhost:5000/api/details");

      // Filter based on nextVisit date (not time)
      const filtered = response.data.filter((entry) => {
        const visitDate = dayjs(entry.nextVisit);
        return visitDate.isSame(date, "day");
      });

      setAllPatientData(response.data);
      applyFilters(filtered, filters);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const applyFilters = (data, currentFilters) => {
    let filtered = [...data];

    // Apply name filter
    if (currentFilters.name) {
      filtered = filtered.filter((entry) =>
        entry.patient?.name
          ?.toLowerCase()
          .includes(currentFilters.name.toLowerCase())
      );
    }

    // Apply phone filter
    if (currentFilters.phone) {
      filtered = filtered.filter((entry) =>
        entry.patient?.phone?.includes(currentFilters.phone)
      );
    }

    // Apply address filter
    if (currentFilters.address) {
      filtered = filtered.filter((entry) =>
        entry.patient?.address
          ?.toLowerCase()
          .includes(currentFilters.address.toLowerCase())
      );
    }

    // Apply diagnosis filter
    if (currentFilters.diagnosis) {
      filtered = filtered.filter((entry) =>
        entry.patient?.diagnosis?.some((d) =>
          d.toLowerCase().includes(currentFilters.diagnosis.toLowerCase())
        )
      );
    }

    // Apply next visit date filter
    if (currentFilters.nextVisitDate) {
      filtered = filtered.filter((entry) => {
        const visitDate = dayjs(entry.nextVisit);
        return visitDate.isSame(currentFilters.nextVisitDate, "day");
      });
    }

    // Apply date range filter
    if (currentFilters.startDate && currentFilters.endDate) {
      filtered = filtered.filter((entry) => {
        const visitDate = dayjs(entry.nextVisit);
        return (
          visitDate.isAfter(currentFilters.startDate.subtract(1, "day")) &&
          visitDate.isBefore(currentFilters.endDate.add(1, "day"))
        );
      });
    }

    setPatientData(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Get base data for selected date
    const baseData = allPatientData.filter((entry) => {
      const visitDate = dayjs(entry.nextVisit);
      return visitDate.isSame(selectedDate, "day");
    });

    applyFilters(baseData, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      name: "",
      phone: "",
      address: "",
      nextVisitDate: null,
      startDate: null,
      endDate: null,
    };
    setFilters(clearedFilters);

    // Reset to base data for selected date
    const baseData = allPatientData.filter((entry) => {
      const visitDate = dayjs(entry.nextVisit);
      return visitDate.isSame(selectedDate, "day");
    });

    setPatientData(baseData);
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  // Group data by mode
  const groupedByMode = {
    branch: [],
    clinic: [],
    courier: [],
  };

  patientData.forEach((entry) => {
    const mode = entry.mode;
    if (groupedByMode[mode]) {
      groupedByMode[mode].push(entry);
    }
  });

  // Count and dynamically sort columns by how many entries each mode has
  const modeCounts = {
    branch: groupedByMode.branch.length,
    clinic: groupedByMode.clinic.length,
    courier: groupedByMode.courier.length,
  };

  const sortedModes = Object.entries(modeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([mode]) => mode);

  const maxRows = Math.max(...Object.values(modeCounts));

  const getModeIcon = (mode) => {
    switch (mode) {
      case "branch":
        return <People />;
      case "clinic":
        return <DirectionsRun />;
      case "courier":
        return <LocalShipping />;
      default:
        return <People />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case "branch":
        return theme.palette.primary.main;
      case "clinic":
        return theme.palette.success.main;
      case "courier":
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getModeColorVariant = (mode) => {
    switch (mode) {
      case "branch":
        return "primary";
      case "clinic":
        return "success";
      case "courier":
        return "secondary";
      default:
        return "default";
    }
  };

  const scheduleData = {
    Monday: ["Tharamangalam", "Elampillai", "Mecheri"],
    Wednesday: ["Valapadi", "Attur"],
    Friday: ["Andalur Gate", "Namakkal"],
    Sunday: ["Arur", "Tharumapuri"],
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, bgcolor: "grey.50", minHeight: "100vh" }}>
        {/* Header */}
        {/* <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
          borderBottom: ` 1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: "rgba(255,255,255,0.2)" }}>
            <DashboardIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 600, color: "white" }}
            >
              Patient Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Manage and view patient appointments
            </Typography>
          </Box>
        </Toolbar>
      </AppBar> */}
        {/* Summary Cards */}

        <Grid item xs={12} md={6} sx={{pl:4,}}>
          <Card
            elevation={2}
            sx={(theme) => ({
              
              // background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
              background: "linear-gradient(135deg, #b2e8e3 0%, #a8e5dd 100%)",

              border: `1px solid ${theme.palette.primary.main}33`, // or use alpha utility explicitly
              borderRadius: 2,
              
            })}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "text.primary", fontWeight: 600 }}
              >
                Selected Date
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {selectedDate.format("dddd, MMMM D, YYYY")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <People color="primary" />
                <Typography variant="body1" color="text.secondary">
                  {patientData.length} Total Patients
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
            mt: 5,
            pl:4,
          }}
        >
          {sortedModes.map((mode) => (
            <Grid item xs={12} md={4} key={mode}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: 267,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getModeColor(mode),
                        width: 56,
                        height: 56,
                      }}
                    >
                      {getModeIcon(mode)}
                    </Avatar>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                      >
                        {modeCounts[mode]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patients
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "capitalize",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    {mode}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={maxRows > 0 ? (modeCounts[mode] / maxRows) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(getModeColor(mode), 0.1),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getModeColor(mode),
                        borderRadius: 4,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Calendar Section */}
          <Card
            elevation={3}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: "hidden",
             
              // background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
              // background: "linear-gradient(180deg, #0f766e 0%, #134e4a 100%)",
            }}
          >
            <Box
              sx={{
                // background: "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "white",
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={() => setOpen(true)}
              >
                <CalendarToday />
                Select Date
              </Typography>

              <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                  {/* Close button */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      Place Visit Schedule
                    </Typography>
                    <IconButton onClick={() => setOpen(false)} size="small">
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <List>
                    {Object.entries(scheduleData).map(([day, places]) => (
                      <ListItem
                        key={day}
                        alignItems="flex-start"
                        disableGutters
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {day}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body1" fontWeight="medium">
                              {places.join(", ")}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Modal>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={4} alignItems="center" style={{justifyContent:"space-around"}}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        "& .MuiDateCalendar-root": {
                          width: "100%",
                          maxWidth: "none",
                        },
                      }}
                    >
                      <DateCalendar
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        sx={{
                          "& .MuiPickersDay-root": {
                            borderRadius: 2,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          },
                          "& .Mui-selected": {
                            background:
                             "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)!important",
                            color: "white !important",
                          },
                        }}
                      />
                    </Paper>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    elevation={2}
                    sx={{
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      border: ` 1px solid ${alpha(
                        theme.palette.grey[300],
                        0.5
                      )}`,
                    }}
                  >
                    {/* <Box
                      sx={{
                        background:
                          "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                        color: "white",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <FilterList />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Filters
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={clearFilters}
                        sx={{
                          color: "white",
                          borderColor: "rgba(255,255,255,0.5)",
                          "&:hover": {
                            borderColor: "white",
                            bgcolor: "rgba(255,255,255,0.1)",
                          },
                        }}
                        startIcon={<Clear />}
                      >
                        Clear
                      </Button>
                    </Box> */}

                    <CardContent sx={{ p: 3, gap: 15, width: "500px" }}>
                      <Grid container spacing={2}>
                        {/* <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Patient Name"
                            variant="outlined"
                            size="small"
                            value={filters.name}
                            onChange={(e) =>
                              handleFilterChange("name", e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <People color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                width: 200,
                              },
                            }}
                          />
                        </Grid> */}

                        {/* <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            size="small"
                            value={filters.phone}
                            onChange={(e) =>
                              handleFilterChange("phone", e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone color="success" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                width: 200,
                              },
                            }}
                          />
                        </Grid> */}

                        {/* <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address"
                            variant="outlined"
                            size="small"
                            value={filters.address}
                            onChange={(e) =>
                              handleFilterChange("address", e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOn color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                width: 200,
                              },
                            }}
                          />
                        </Grid> */}

                        {/* <Grid item xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Next Visit Date"
                              value={filters.nextVisitDate}
                              onChange={(newValue) =>
                                handleFilterChange("nextVisitDate", newValue)
                              }
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Schedule color="secondary" />
                                      </InputAdornment>
                                    ),
                                  },
                                  sx: {
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid> */}

                        {/* <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Start Date"
                              value={filters.startDate}
                              onChange={(newValue) =>
                                handleFilterChange("startDate", newValue)
                              }
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <DateRange color="info" />
                                      </InputAdornment>
                                    ),
                                  },
                                  sx: {
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid> */}

                        {/* <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="End Date"
                              value={filters.endDate}
                              onChange={(newValue) =>
                                handleFilterChange("endDate", newValue)
                              }
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <DateRange color="info" />
                                      </InputAdornment>
                                    ),
                                  },
                                  sx: {
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid> */}

                        {/* <Grid item xs={12}>
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              borderRadius: 2,
                              border: `1px solid ${alpha(
                                theme.palette.info.main,
                                0.2
                              )}`,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="info.main"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              Active Filters:
                            </Typography>
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {Object.entries(filters).map(([key, value]) => {
                                if (value && value !== "") {
                                  return (
                                    <Chip
                                      key={key}
                                      label={`${key}: ${
                                        dayjs.isDayjs(value)
                                          ? value.format("MMM DD, YYYY")
                                          : value
                                      }`}
                                      size="small"
                                      color="info"
                                      variant="outlined"
                                      onDelete={() =>
                                        handleFilterChange(
                                          key,
                                          key.includes("Date") ? null : ""
                                        )
                                      }
                                    />
                                  );
                                }
                                return null;
                              })}
                              {Object.values(filters).every(
                                (v) => !v || v === ""
                              ) && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontStyle: "italic" }}
                                >
                                  No active filters
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid> */}

                        <div
                          style={{ width: "100%" }}
                          className="bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filters
                              </h3>
                              <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                              >
                                {/* <X className="w-4 h-4" /> */}
                                <Delete className="w-4 h-4" />
                                Clear
                              </button>
                            </div>

                            <div className="space-y-4">
                              {/* Name Filter */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Patient Name
                                </label>
                                <div className="relative">
                                  <Person className="w-5 h-5 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={filters.name}
                                    onChange={(e) =>
                                      handleFilterChange("name", e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter patient name"
                                  />
                                </div>
                              </div>

                              {/* Phone Filter */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Phone Number
                                </label>
                                <div className="relative">
                                  <PhoneAndroid className="w-5 h-5 text-green-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={filters.phone}
                                    onChange={(e) =>
                                      handleFilterChange(
                                        "phone",
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter phone number"
                                  />
                                </div>
                              </div>

                              {/* Diagnosis Filter */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Diagnosis
                                </label>
                                <div className="relative">
                                  <MedicationOutlined className="w-5 h-5 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={filters.diagnosis}
                                    onChange={(e) =>
                                      handleFilterChange(
                                        "diagnosis",
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter diagnosis"
                                  />
                                </div>
                              </div>
                              {/* Address Filter */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Address
                                </label>
                                <div className="relative">
                                  <Map className="w-5 h-5 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={filters.address}
                                    onChange={(e) =>
                                      handleFilterChange(
                                        "address",
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter address"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Table Section */}
          <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box
              sx={{
                // bgcolor: "grey.50",
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                borderBottom:` 1px solid ${theme.palette.divider}`,
                p: 2,
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <People />
                Patient Details
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        letterSpacing: 1,
                      }}
                    >
                      S.No
                    </TableCell>
                    {sortedModes.map((mode) => (
                      <TableCell
                        key={mode}
                        sx={{
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          letterSpacing: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {getModeIcon(mode)}
                          <Typography
                            variant="inherit"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {mode}
                          </Typography>
                          <Chip
                            label={modeCounts[mode]}
                            size="small"
                            color={getModeColorVariant(mode)}
                            sx={{ minWidth: 24, height: 20 }}
                          />
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: maxRows }).map((_, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                        "&:nth-of-type(even)": {
                          bgcolor: alpha(theme.palette.grey[50], 0.5),
                        },
                      }}
                    >
                      <TableCell sx={{ bgcolor: "grey.50" }}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 32,
                            height: 32,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </TableCell>
                      {sortedModes.map((mode) => {
                        const patient = groupedByMode[mode][index];
                        return (
                          <TableCell key={mode}>
                            {patient ? (
                              <Card
                                variant="outlined"
                                onClick={() =>
                                  navigate("/upload", {
                                    state: { patient: patient },
                                  })
                                }
                                sx={{
                                  p: 2,
                                  bgcolor: alpha(theme.palette.grey[50], 0.8),
                                  border: `1px solid ${alpha(
                                    getModeColor(mode),
                                    0.2
                                  )}`,
                                  borderRadius: 2,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: alpha(getModeColor(mode), 0.05),
                                    borderColor: alpha(getModeColor(mode), 0.3),
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <People
                                    sx={{ color: "primary.main", fontSize: 16 }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {patient.patient?.name || "N/A"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <Phone
                                    sx={{ color: "success.main", fontSize: 16 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {patient.patient?.phone || "N/A"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <LocationOn
                                    sx={{ color: "success.main", fontSize: 16 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {patient.patient?.address || "N/A"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <LocalPharmacy
                                    sx={{
                                      color: "secondary.main",
                                      fontSize: 16,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Remain:{" "}
                                    {patient.patient?.pendingDays || "N/A"}
                                  </Typography>
                                </Box>
                              </Card>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: 80,
                                  color: "text.disabled",
                                }}
                              >
                                <Typography variant="h4">-</Typography>
                              </Box>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {maxRows === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={sortedModes.length + 1}
                        sx={{ py: 8, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            sx={{ width: 64, height: 64, bgcolor: "grey.100" }}
                          >
                            <People sx={{ fontSize: 32, color: "grey.400" }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              gutterBottom
                            >
                              No patients scheduled
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                              No patient data available for the selected date.
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;