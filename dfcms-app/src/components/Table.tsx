import React from "react";
import "./Table.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CaseData } from "../pages/Dashboard"; // Adjust path if needed

interface BasicTableProps {
  rows: CaseData[];
}

const BasicTable: React.FC<BasicTableProps> = ({ rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: "#454545", color: "white" }}>
              case_id
            </TableCell>
            <TableCell
              align="right"
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              case_number
            </TableCell>
            <TableCell
              align="right"
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              case_title
            </TableCell>
            <TableCell
              align="right"
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              description
            </TableCell>
            <TableCell
              align="right"
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              status
            </TableCell>
            <TableCell
              align="right"
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              date_created
            </TableCell>
            <TableCell
              align="right"
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              last_updated
            </TableCell>
            <TableCell
              align="right"
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              assigned_to
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.case_id}>
              <TableCell
                component="th"
                scope="row"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {row.case_id}
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {row.case_number}
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {row.title}
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {row.cdescription}
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {row.cstatus}
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {new Date(row.date_created).toDateString()}
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {new Date(row.last_updated).toDateString()}
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#737373", color: "white" }}
              >
                {row.assigned_to}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
