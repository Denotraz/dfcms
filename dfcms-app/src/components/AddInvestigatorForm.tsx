import React, { useState } from "react";
import "./AddInvestigatorForm.css";

interface Department {
  department_id: string;
}

interface AddInvestigatorFormProps {
  departments: Department[];
  onSubmit: (formData: {
    investigator_id: string;
    invname: string;
    email: string;
    phone: string;
    department_id: string;
    password: string;
    invrole: string;
  }) => void;
}

const AddInvestigatorForm: React.FC<AddInvestigatorFormProps> = ({
  departments,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    investigator_id: "",
    invname: "",
    email: "",
    phone: "",
    department_id: "",
    password: "",
    invrole: "investigator",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="add-investigator-form" onSubmit={handleSubmit}>
      <h6>Create New Investigator</h6>
      <input
        className="add-investigator-field"
        type="text"
        name="investigator_id"
        placeholder="Investigator ID"
        value={formData.investigator_id}
        onChange={handleChange}
      />
      <input
        className="add-investigator-field"
        type="text"
        name="invname"
        placeholder="Name"
        value={formData.invname}
        onChange={handleChange}
      />
      <input
        className="add-investigator-field"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        className="add-investigator-field"
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <select
        className="add-investigator-field"
        name="department_id"
        value={formData.department_id}
        onChange={handleChange}
      >
        <option value="">Select Department</option>
        {departments.map((dep) => (
          <option key={dep.department_id} value={dep.department_id}>
            {dep.department_id}
          </option>
        ))}
      </select>
      <input
        className="add-investigator-field"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <select
        className="add-investigator-field"
        name="invrole"
        value={formData.invrole}
        onChange={handleChange}
      >
        <option value="investigator">Investigator</option>
        <option value="dba">DBA</option>
      </select>
      <button type="submit" className="add-investigator-button">
        Create Investigator
      </button>
    </form>
  );
};

export default AddInvestigatorForm;
