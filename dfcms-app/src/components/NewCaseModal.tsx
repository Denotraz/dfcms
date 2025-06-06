import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import "./NewCaseModal.css";

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
  const [caseId, setCaseId] = useState(defaultData?.case_id || "");
  const [title, setTitle] = useState(defaultData?.title || "");
  const [description, setDescription] = useState(
    defaultData?.cdescription || ""
  );
  const [status, setStatus] = useState(defaultData?.cstatus || "");
  const [assignedTo, setAssignedTo] = useState(defaultData?.assigned_to || "");

  const handleSave = () => {
    if (onSave) {
      onSave({
        case_id: caseId,
        title,
        cdescription: description,
        cstatus: status,
        assigned_to: assignedTo,
      });
    }

    setCaseId("");
    setTitle("");
    setDescription("");
    setStatus("");
    setAssignedTo("");
  };

  return (
    <Dialog open={open} onClose={onClose} className="custom-dialog">
      <DialogTitle className="custom-dialog-title">Create New Case</DialogTitle>
      <DialogContent className="custom-dialog-content">
        <TextField
          autoFocus
          margin="dense"
          label="Case ID"
          type="text"
          fullWidth
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          className="custom-textfield"
        />
        <TextField
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="custom-textfield"
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="custom-textfield"
        />
        <TextField
          margin="dense"
          label="Status"
          type="text"
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="custom-textfield"
        />
        <TextField
          margin="dense"
          label="Assigned To"
          type="text"
          fullWidth
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="custom-textfield"
        />
      </DialogContent>
      <DialogActions className="custom-dialog-actions">
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="success" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewCaseModal;
