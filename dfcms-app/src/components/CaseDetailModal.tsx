import React, { useEffect, useState } from "react";
import "./CaseDetailModal.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { CaseData } from "../pages/Dashboard";

interface Evidence {
  evidence_id: string;
  evidence_type: string;
  edescription: string;
  file_path: string;
  hash_value: string;
  date_collected: string;
  collected_by: string;
}

interface CaseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  selectedCase: CaseData | null;
  userRole: string;
}

const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  open,
  onClose,
  selectedCase,
  userRole,
}) => {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [evidenceId, setEvidenceId] = useState("");

  useEffect(() => {
    const fetchEvidence = async () => {
      if (selectedCase) {
        setLoading(true);
        try {
          const res = await fetch(
            `http://localhost:3001/api/evidence/${selectedCase.case_id}`
          );
          const data = await res.json();
          setEvidence(data);
        } catch (err) {
          console.error("Error fetching evidence:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (open) fetchEvidence();
  }, [open, selectedCase]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !selectedFile) return;

    const storedUser = localStorage.getItem("user");
    const collected_by = storedUser ? JSON.parse(storedUser).id : "";

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("evidence_id", evidenceId);
    formData.append("case_id", selectedCase.case_id);
    formData.append("edescription", description);
    formData.append("evidence_type", type);
    formData.append("collected_by", collected_by);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3001/api/upload-evidence", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowUploadForm(false);
        setDescription("");
        setType("");
        setEvidenceId("");
        setSelectedFile(null);
        const updatedEvidence = await fetch(
          `http://localhost:3001/api/evidence/${selectedCase.case_id}`
        ).then((res) => res.json());
        setEvidence(updatedEvidence);
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (err) {
      console.error("Error uploading evidence:", err);
    }
  };

  if (!selectedCase) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="custom-dialog"
    >
      <DialogTitle className="custom-dialog-title">
        Case Details: {selectedCase.title}
      </DialogTitle>
      <DialogContent dividers className="custom-dialog-content">
        <Typography variant="subtitle1">
          Case ID: {selectedCase.case_id}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : evidence.length === 0 ? (
          <Typography>No evidence found.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Evidence ID</TableCell>
                  <TableCell>File Path</TableCell>
                  <TableCell>Hash</TableCell>
                  <TableCell>Date Collected</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {evidence.map((item) => (
                  <TableRow key={item.evidence_id}>
                    <TableCell>{item.evidence_id}</TableCell>
                    <TableCell>{item.file_path}</TableCell>
                    <TableCell>{item.hash_value}</TableCell>
                    <TableCell>
                      {new Date(item.date_collected).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.evidence_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showUploadForm && (
          <Box component="form" onSubmit={handleUpload} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Evidence ID"
              value={evidenceId}
              onChange={(e) => setEvidenceId(e.target.value)}
              className="custom-textfield"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="custom-textfield"
            />
            <FormControl
              fullWidth
              margin="normal"
              className="custom-form-control"
            >
              <InputLabel>Evidence Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Evidence Type"
              >
                <MenuItem value="txt">Text</MenuItem>
                <MenuItem value="img">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <input
              type="file"
              accept="*/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ margin: "1rem 0" }}
            />
            <Button type="submit" variant="contained" color="success">
              Upload
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions className="custom-dialog-actions">
        {(userRole === "investigator" || userRole === "dba") && (
          <Button
            onClick={() => setShowUploadForm(true)}
            color="primary"
            variant="contained"
          >
            Add Evidence
          </Button>
        )}
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CaseDetailsModal;
