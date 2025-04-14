import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import BasicTable from "../components/Table";
import { Box, Toolbar, Fab } from "@mui/material";
import Sidebar from "../components/Sidebar";
import NewCaseModal from "../components/NewCaseModal";
import AddIcon from "@mui/icons-material/Add";
import BasicButtons from "../components/LogoutButton";
import { logout } from "../utils/auth";
import EvidenceModal from "../components/CaseDetailModal";

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
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const drawerWidth = 240;
  const [modalOpen, setModalOpen] = useState(false);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      document.title = ` DFCMS / Dashboard / ${parsedUser.role.charAt(0).toUpperCase() + parsedUser.role.slice(1)}`;
    } else {
      document.title = "DFCMS / Dashboard / Guest";
    }
  }, []);

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

  const handleCaseRowClick = (caseItem: CaseData) => {
    setSelectedCase(caseItem);
    setEvidenceModalOpen(true);
  }

  // Fetch cases when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }
    const user = JSON.parse(storedUser);
    setUserName(user.name);
    setUserRole(user.role);

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
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        <div className="logo-container">
          <h1>Welcome, {userName}</h1>
        </div>
        {/* Floating Action Button to open the new case modal */}
        {(userRole == 'investigator' || userRole == 'dba') && (
        <Fab
          color="secondary"
          aria-label="add"
          onClick={handleOpenModal}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
        )}
        <div className="table-container">
          {/* Pass the fetched cases to your table component */}
          <BasicTable rows={cases} onRowClick={handleCaseRowClick} />
        </div>
        <NewCaseModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveNewCase}
        />
        <EvidenceModal
          open={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
          selectedCase={selectedCase}
          userRole = {userRole}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
