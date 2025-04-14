import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface NewCaseModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (newCase: {
    case_id: string;
    title: string;
    cdescription: string;
    cstatus: string;
    assigned_to: string;
  }) => void;
  readOnly?: boolean;
  defaultData?: {
    case_id: string;
    title: string;
    cdescription: string;
    cstatus: string;
    assigned_to: string;
  };
}

const NewCaseModal: React.FC<NewCaseModalProps> = ({
  open,
  onClose,
  onSave,
  defaultData,
}) => {
  // Local state for the form fields
  const [caseId, setCaseId] = useState(defaultData?.case_id || "");
  const [title, setTitle] = useState(defaultData?.title || "");
  const [description, setDescription] = useState(defaultData?.cdescription || "");
  const [status, setStatus] = useState(defaultData?.cstatus || "");
  const [assignedTo, setAssignedTo] = useState(defaultData?.assigned_to || "");

  const handleSave = () => {
    const newCase = {
      case_id: caseId,
      title,
      cdescription: description,
      cstatus: status,
      assigned_to: assignedTo,
    };
    onSave
      ? newCase
      : // Optionally clear fields after save:
        setCaseId("");
    setTitle("");
    setDescription("");
    setStatus("");
    setAssignedTo("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Case</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          color="success"
          margin="dense"
          label="Case ID"
          type="text"
          fullWidth
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Status"
          type="text"
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Assigned To"
          type="text"
          fullWidth
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewCaseModal;
