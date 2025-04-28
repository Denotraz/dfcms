import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddInvestigatorForm from "../components/AddInvestigatorForm";
import AddDepartmentForm from "../components/AddDepartmentForm";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const drawerWidth = 240;
  const [departments, setDepartments] = useState<{ department_id: string }[]>([]);

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

    fetchDepartments();
    document.title = "DFCMS / Admin Dashboard";
  }, []);

  const fetchDepartments = async () => {
    const res = await fetch("http://localhost:3001/api/departments");
    const data = await res.json();
    setDepartments(data);
  };

  const handleCreateInvestigator = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/create-investigator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create investigator.");
      }

      alert("Investigator created successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error occurred");
    }
  };

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
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <AddInvestigatorForm departments={departments} onSubmit={handleCreateInvestigator} />
        <AddDepartmentForm />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
