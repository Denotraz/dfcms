import React from "react";
import "./Table.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CaseData } from "../pages/Dashboard";

interface BasicTableProps {
  rows: CaseData[];
  onRowClick: (row: CaseData) => void;
}

const BasicTable: React.FC<BasicTableProps> = ({ rows, onRowClick }) => {
  return (
    <TableContainer component={Paper} className="custom-table-container">
      <Table>
        <TableHead className="custom-table-head">
          <TableRow>
            <TableCell>Case ID</TableCell>
            <TableCell align="right">Case Number</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Date Created</TableCell>
            <TableCell align="right">Last Updated</TableCell>
            <TableCell align="right">Assigned To</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.case_id}
              onClick={() => onRowClick(row)}
              className="custom-table-row"
            >
              <TableCell>{row.case_id}</TableCell>
              <TableCell align="right">{row.case_number}</TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.cdescription}</TableCell>
              <TableCell align="right">{row.cstatus}</TableCell>
              <TableCell align="right">
                {new Date(row.date_created).toDateString()}
              </TableCell>
              <TableCell align="right">
                {new Date(row.last_updated).toDateString()}
              </TableCell>
              <TableCell align="right">{row.assigned_to}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
