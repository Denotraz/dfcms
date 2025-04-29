const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Ensure bcrypt is installed
const jwt = require("jsonwebtoken");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "evidence/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Enable CORS for cross-origin requests
app.use(cors());
// Enable JSON body parsing
app.use(express.json());

// serve evidence files properly:
app.use("/evidence", express.static(path.join(__dirname, "evidence")));

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "CHANGE_ME", // Replace with your MySQL host
  user: "CHANGE_ME", // Replace with your MySQL username
  password: "CHANGE_ME", // Replace with your MySQL password
  database: "dfcms", // Replace with your database name
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provicded" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });

    req.user = decoded;
    next();
  });
}

app.get("/download-evidence/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send("File not found");
    }
  });
});

app.post("/api/create-investigator", verifyToken, (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "dba") {
    return res.status(403).json({ error: "Permission denied" });
  }

  const {
    investigator_id,
    invname,
    email,
    phone,
    invrole,
    department_id,
    password,
  } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Bcrypt error:", err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    const query = `
      INSERT INTO investigator (investigator_id, invname, email, phone, invrole, department_id, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      query,
      [investigator_id, invname, email, phone, invrole, department_id, hash],
      (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true });
      }
    );
  });
});

app.post("/api/create-department", verifyToken, (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "dba") {
    return res.status(403).json({ error: "Permission denied" });
  }

  const { department_id, department_name, location, phone_number } = req.body;

  const query = `
    INSERT INTO departments (department_id, department_name, location, phone_number)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    query,
    [department_id, department_name, location, phone_number],
    (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    }
  );
});

app.get("/api/departments", (req, res) => {
  const query = "SELECT department_id, department_name FROM departments";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
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
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.post("/api/cases", verifyToken, (req, res) => {
  console.log("Decoded JWT:", req.user);
  const userRole = req.user.role;

  if (userRole !== "investigator" && userRole !== "dba") {
    return res.status(403).json({ error: "Permission denied" });
  }
  // Destructure the fields that are expected from the request body.
  const { case_id, title, cdescription, cstatus, assigned_to } = req.body;

  // Validate that all fields are provided (you can adjust as needed)
  if (!case_id || !title || !cdescription || !cstatus || !assigned_to) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    INSERT INTO cases (case_id, title, cdescription, cstatus, date_created, last_updated, assigned_to)
    VALUES (?, ?, ?, ?, CURDATE(), CURDATE(), ?)
  `;

  connection.query(
    query,
    [case_id, title, cdescription, cstatus, assigned_to],
    (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true, insertedId: results.insertId });
    }
  );
});

app.get("/api/evidence/:case_id", (req, res) => {
  const case_id = req.params.case_id;

  const query = "SELECT * FROM evidence WHERE case_id = ?";
  connection.query(query, [case_id], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/api/verify-evidence/:case_id/:evidence_id", (req, res) => {
  const { case_id, evidence_id } = req.params;

  const query = `
    SELECT file_path, hash_value FROM evidence
    WHERE case_id = ? AND evidence_id = ?
  `;

  connection.query(query, [case_id, evidence_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Evidence not found" });
    }

    const { file_path, hash_value } = results[0];

    try {
      const fileBuffer = fs.readFileSync(file_path);
      const currentHash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      const isMatch = currentHash === hash_value;
      return res.json({
        match: isMatch,
        storedHash: hash_value,
        currentHash,
        message: isMatch
          ? "Evidence is intact."
          : "WARNING: Evidence may have been tampered with!",
      });
    } catch (fileErr) {
      console.error("File read error:", fileErr);
      return res.status(500).json({ error: "Failed to read evidence file." });
    }
  });
});

app.post(
  "/api/upload-evidence",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    const { case_id, evidence_id, evidence_type, edescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = file.path;
    const collected_by = req.user.id; // From JWT
    const department_id = req.user.department_id; // From JWT

    try {
      // Generate hash
      const fileBuffer = fs.readFileSync(filePath);
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

      // Insert into Evidence table
      const evidenceQuery = `
      INSERT INTO evidence (case_id, evidence_id, evidence_type, edescription, file_path, hash_value, collected_by, date_collected)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

      await new Promise((resolve, reject) => {
        connection.query(
          evidenceQuery,
          [
            case_id,
            evidence_id,
            evidence_type,
            edescription,
            filePath,
            hash,
            collected_by,
          ],
          (error, results) => {
            if (error) {
              console.error("Error inserting into evidence:", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      // Insert into Chain of Custody (chain_id auto handled)
      const custodyQuery = `
      INSERT INTO chain_of_custody (case_id, evidence_id, investigator_id, department_id, caction, date_time, notes)
      VALUES (?, ?, ?, ?, 'collected', NOW(), ?)
    `;

      await new Promise((resolve, reject) => {
        connection.query(
          custodyQuery,
          [
            case_id,
            evidence_id,
            collected_by,
            department_id,
            "Initial evidence collection.",
          ],
          (error, results) => {
            if (error) {
              console.error("Error inserting into chain of custody:", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      res.json({
        success: true,
        message: "Evidence and chain of custody recorded successfully.",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Server error during evidence upload." });
    }
  }
);

app.post("/api/release-evidence", verifyToken, (req, res) => {
  const { case_id, evidence_id } = req.body;
  const user = req.user;

  const guestInvestigatorId = "guest";
  const guestDepartmentId = "D001";

  const investigator_id = user.role === "guest" ? guestInvestigatorId : user.id;
  const department_id =
    user.role === "guest" ? guestDepartmentId : user.department_id;
  const notes =
    user.role === "guest"
      ? "Evidence released to guest."
      : "Evidence released by investigator.";

  const query = `
    INSERT INTO chain_of_custody (case_id, evidence_id, investigator_id, department_id, caction, date_time, notes)
    VALUES (?, ?, ?, ?, 'released', NOW(), 'evidence released')
  `;

  connection.query(
    query,
    [case_id, evidence_id, investigator_id, department_id, notes],
    (error, results) => {
      if (error) {
        console.error(
          "Error inserting into chain of custody (release):",
          error
        );
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    }
  );
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
        const user = {
          id: results[0].investigator_id,
          name: results[0].invname,
          email: results[0].email,
          role: results[0].invrole,
          department_id: results[0].department_id,
        };

        const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
        // Passwords match; authentication successful
        return res.json({ success: true, user, token });
      } else {
        // Passwords do not match
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    });
  });
});

app.post("/api/login-guest", (req, res) => {
  const guestUser = {
    id: "guest",
    name: "Guest",
    role: "guest",
    department_id: "D001",
  };
  const token = jwt.sign(guestUser, JWT_SECRET, { expiresIn: "1h" });
  return res.json({ success: true, user: guestUser, token });
});

// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
