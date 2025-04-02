import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import BasicTable from "../components/Table";
import { Box, Toolbar, Fab } from "@mui/material";
import Sidebar from "../components/Sidebar";
import NewCaseModal from "../components/NewCaseModal";
import AddIcon from "@mui/icons-material/Add";
import BasicButtons from "../components/LoginButton";

// Define an interface for your case data
export interface CaseData {
  case_id: string;
  case_number: number;
  title: string;
  cdescription: string;
  cstatus: string;
  date_created: string;
  last_updated: string;
  assigned_to: string;
}

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const [modalOpen, setModalOpen] = useState(false);
  const [cases, setCases] = useState<CaseData[]>([]);

  // Function to fetch cases from the API
  const fetchCases = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cases");
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  // Fetch cases when the component mounts
  useEffect(() => {
    fetchCases();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Save the new case and refresh the case list
  const handleSaveNewCase = async (newCase: {
    case_id: string;
    title: string;
    cdescription: string;
    cstatus: string;
    assigned_to: string;
  }) => {
    try {
      const response = await fetch("http://localhost:3001/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCase),
      });
      if (!response.ok) {
        throw new Error("Failed to create case");
      }
      // Re-fetch cases after successful insertion
      fetchCases();
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating case:", error);
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
        <Toolbar />
        <div className="logo-container" style={{ position: "absolute", top: 16, right: 16 }}>
          <BasicButtons onClick={() => (window.location.href = "/")} />
        </div>
        <div className="logo-container">
          <h1>Welcome to the dashboard!</h1>
        </div>
        {/* Floating Action Button to open the new case modal */}
        <Fab
          color="secondary"
          aria-label="add"
          onClick={handleOpenModal}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
        <div className="table-container">
          {/* Pass the fetched cases to your table component */}
          <BasicTable rows={cases} />
        </div>
        <NewCaseModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveNewCase}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
