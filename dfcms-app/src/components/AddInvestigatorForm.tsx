// src/components/AddInvestigatorForm.tsx

import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

interface Department {
  department_id: string;
  department_name: string;
}

const AddInvestigatorForm: React.FC = () => {
  const [investigatorId, setInvestigatorId] = useState("");
  const [invName, setInvName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [password, setPassword] = useState("");
  const [invRole, setInvRole] = useState("investigator"); // default
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch department list when the form loads
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/departments");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3001/api/create-investigator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            investigator_id: investigatorId,
            invname: invName,
            email,
            phone,
            department_id: department,
            password,
            invrole: invRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create investigator.");
      }

      alert("Investigator created successfully!");
      // Reset fields
      setInvestigatorId("");
      setInvName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setPassword("");
      setInvRole("investigator");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error occurred");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}
    >
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        label="Investigator ID"
        value={investigatorId}
        onChange={(e) => setInvestigatorId(e.target.value)}
        required
      />
      <TextField
        label="Name"
        value={invName}
        onChange={(e) => setInvName(e.target.value)}
        required
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
      />
      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Department Select */}
      <FormControl fullWidth required>
        <InputLabel id="department-select-label">Department</InputLabel>
        <Select
          labelId="department-select-label"
          value={department}
          label="Department"
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dept) => (
            <MenuItem key={dept.department_id} value={dept.department_id}>
              {dept.department_name} ({dept.department_id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Role"
        value={invRole}
        onChange={(e) => setInvRole(e.target.value)}
        helperText="Enter 'investigator' or 'dba'"
        required
      />

      <Button type="submit" variant="contained" color="primary">
        Create Investigator
      </Button>
    </Box>
  );
};

export default AddInvestigatorForm;
