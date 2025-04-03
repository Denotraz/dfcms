const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Ensure bcrypt is installed

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());
// Enable JSON body parsing
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "Hailstorm99!", // Replace with your MySQL password
  database: "dfcms", // Replace with your database name
});

app.get("/api/test-db", (req, res) => {
  connection.query("SELECT 1 AS test", (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Database connection successful", data: results });
  });
});

// Simple test endpoint
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});


app.get("/api/cases", (req, res) => {
    const query = "select * from cases";
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});


app.post('/api/cases', (req, res) => {
  // Destructure the fields that are expected from the request body.
  const { case_id, title, cdescription, cstatus, assigned_to } = req.body;

  // Validate that all fields are provided (you can adjust as needed)
  if (!case_id || !title || !cdescription || !cstatus || !assigned_to) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `
    INSERT INTO cases (case_id, title, cdescription, cstatus, date_created, last_updated, assigned_to)
    VALUES (?, ?, ?, ?, CURDATE(), CURDATE(), ?)
  `;

  connection.query(query, [case_id, title, cdescription, cstatus, assigned_to], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, insertedId: results.insertId });
  });
});

// Login endpoint using bcrypt for password comparison
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Query the database for the user with the given email
  const query = "SELECT * FROM investigator WHERE email = ?";
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      // No user found with that email
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Retrieve the stored hash for the user
    const storedHash = results[0].password;

    // Compare the provided password with the stored bcrypt hash
    bcrypt.compare(password, storedHash, (err, match) => {
      if (err) {
        console.error("Bcrypt error:", err);
        return res.status(500).json({ error: "Error during authentication" });
      }

      if (match) {
        // Passwords match; authentication successful
        return res.json({ success: true, user: results[0] });
      } else {
        // Passwords do not match
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    });
  });
});

// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});