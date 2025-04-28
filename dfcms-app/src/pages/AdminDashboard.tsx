// src/pages/AdminDashboard.tsx

import React, { useEffect } from "react";
import { Box, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BasicButtons from "../components/LogoutButton";
import { logout } from "../utils/auth";
import AddInvestigatorForm from "../components/AddInvestigatorForm";
import "./Dashboard.css";

const AdminDashboard: React.FC = () => {
  const drawerWidth = 240;
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== "dba") {
        navigate("/");
      }
    } else {
      navigate("/");
    }

    document.title = "DFCMS / Admin Dashboard";
  }, []);

  return (
    <Box className="box" sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar />
        <div
          className="logo-container"
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          <BasicButtons
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          />
        </div>

        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Typography variant="h6" gutterBottom>
          Create New Investigator
        </Typography>

        {/* Insert the new component here */}
        <AddInvestigatorForm />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
