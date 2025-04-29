# Digital Forensics Case Management System (DFCMS)

## Overview
DFCMS is a **web-based case management system** designed for **digital forensics investigations**. It enables secure **case tracking, evidence management, chain of custody tracking, and role-based access control** to protect digital forensic data.

## Features
-  **Role-based access control (RBAC)**
-  **Evidence management with SHA-256 and BCrypt integrity hashing**
-  **Case tracking and automatic updates**
-  **Chain of custody logging for sound legal proceedings**
-  **Investigator workload tracking**
-  **Secure authentication & access restrictions**

## Technologies Used
- **Frontend:** React, HTML, CSS, Bootstrap, Material UI for React
- **Backend:** NodeJS + Express, Multer
- **Database:** MySQL (with MySQL2 driver)
- **Security:** SHA-256 Hashing, Json Web Tokening, BCrypt password hashing, Role Specific rendering, and more

## Current Progress
- Database schema finalized

- Backend API fully implemented (Node.js + Express)
- Frontend developed with React + MUI
- Authentication system implemented (JWT + bcrypt)
- Evidence upload, storage, and integrity verification working
- Chain of custody tracking implemented
- Guest login functionality added
---

### Before You Start (Dependencies)

| Tool | Purpose | Download |
|:-----|:--------|:---------|
| **[Node.js](https://nodejs.org/)** | Runs the backend server and frontend tooling. | [Download Node.js](https://nodejs.org/) |
| **npm** (comes with Node) | Installs project dependencies. | (Installed automatically with Node.js) |
| **[MySQL Server](https://dev.mysql.com/downloads/mysql/)** | Hosts the database locally. | [Download MySQL Server](https://dev.mysql.com/downloads/mysql/) |
| **[MySQL Workbench](https://dev.mysql.com/downloads/workbench/)** (recommended) | GUI for managing the MySQL database easily. | [Download MySQL Workbench](https://dev.mysql.com/downloads/workbench/) |


### Optional Tools
| Tool | Purpose | Download |
|:-----|:--------|:---------|
| **[Visual Studio Code (VSCode)](https://code.visualstudio.com/)** | Code editor for working on the project easily. | [Download VSCode](https://code.visualstudio.com/) |

## Installation Guide
### **1️ Clone the Repository**
```bash
git clone https://github.com/Denotraz/dfcms.git
cd dfcms
```
### **2 Install Backend Dependencies**
```bash
npm install
```
### **3 Install Frontend Dependencies**
```bash
cd .\dfcms-app\
npm install
```
### **4 Set-up MySQL Database**
- Create a new Schema in MySQL Workbench, name it **dfcms**
- Select the new Schema and import the DFCMSSchema.sql script and run it
- Run the dataInsertion.sql script to fill with test data
- Navigate to server.js and at the top, change *host*, *user*, *password* to your respective MySQL server login
### **5 Run the Server**
```bash
cd .\server\
node .\server.js
```
### **5 Run the FrontEnd**
```bash
npm run dev
```
