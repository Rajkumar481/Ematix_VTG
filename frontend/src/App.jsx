// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "./index.css";
import theme from "./theme";

// Pages
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Addpatient from "./pages/Addpatient.jsx";
import PatientList from "./pages/PatientList.jsx";
import Login from "./pages/Login.jsx";
import PatientDetailsList from "./pages/Patientdetails.jsx";
import AddPatientDetails from "./pages/Uploadform.jsx";
import PatientImageDetails from "./components/PatientImageDetails.jsx";
import BackupDeleteCards from "./pages/Backup.jsx";
import { toast } from "react-toastify";
import PatientStatusSummary from "./pages/Status.jsx";
import EditPatient from "./pages/EditPatient.jsx";

// Custom 404 Page
const ErrorPage = () => (
  <div className="p-10 text-center text-red-600 text-xl">
    404 - Page Not Found
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    toast.info("Log in successfully");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    toast.info("Log out successfully");
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login onLogin={handleLoginSuccess} />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <Layout onLogout={handleLogout} />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "addpatient", element: <Addpatient /> },
        { path: "details", element: <PatientDetailsList /> },
        { path: "patientlist", element: <PatientList /> },
        { path: "details/:id", element: <PatientImageDetails /> },
        { path: "upload", element: <AddPatientDetails /> },
        { path: "backup", element: <BackupDeleteCards /> },
        { path: "status", element: <PatientStatusSummary /> },
        { path: "edit", element: < EditPatient /> },

        { path: "*", element: <ErrorPage /> },
      ],
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
