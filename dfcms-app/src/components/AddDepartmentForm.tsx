import React, { useState } from "react";
import "./AddDepartmentForm.css";

const AddDepartmentForm: React.FC = () => {
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [location, setLocation] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  const handleCreateDepartment = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3001/api/create-department",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            department_id: departmentId,
            department_name: departmentName,
            location: location,
            phone_number: phone_number,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create department.");
      }

      alert("Department created successfully!");

      setDepartmentId("");
      setDepartmentName("");
      setLocation("");
      setPhoneNumber("");
      
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error occurred");
    }
  };

  return (
    <div className="add-department-form">
      <h6>Add New Department</h6>
      <input
        type="text"
        className="add-department-field"
        placeholder="Department ID"
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
      />
      <input
        type="text"
        className="add-department-field"
        placeholder="Department Name"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
      />
      <input
        type="text"
        className="add-department-field"
        placeholder="Department Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        className="add-department-field"
        placeholder="Department Phone Number"
        value={phone_number}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button
        onClick={handleCreateDepartment}
        className="add-department-button"
      >
        Create Department
      </button>
    </div>
  );
};

export default AddDepartmentForm;
