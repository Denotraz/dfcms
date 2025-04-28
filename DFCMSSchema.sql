CREATE TABLE DEPARTMENTS
(
	department_id varchar(10) PRIMARY KEY,
	department_name varchar(255) NOT NULL,
    location varchar(255) NOT NULL,
    phone_number varchar(255)
);

CREATE TABLE INVESTIGATOR
(
	investigator_id varchar(10) PRIMARY KEY,
    invname varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(255) NOT NULL,
    invrole enum('guest', 'investigator', 'dba') NOT NULL,
    department_id varchar(10) NOT NULL,
    password varchar(255) NOT NULL,
    FOREIGN KEY(department_id) REFERENCES departments(department_id)
);

CREATE TABLE CASES
(
	case_id varchar(10) PRIMARY KEY,
    case_number int UNIQUE NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    cdescription text NOT NULL,
    cstatus enum('open','closed') NOT NULL,
    date_created date NOT NULL,
    last_updated date NOT NULL,
    assigned_to varchar(10) NOT NULL,
	FOREIGN KEY(assigned_to) REFERENCES investigator(investigator_id)
);

CREATE TABLE evidence (
    case_id VARCHAR(10) NOT NULL,
    evidence_id VARCHAR(10) NOT NULL,
    evidence_type ENUM('txt', 'img', 'video', 'audio', 'other'),
    edescription TEXT,
    file_path VARCHAR(255),
    hash_value VARCHAR(255),
    collected_by VARCHAR(10),
    date_collected DATE,
    PRIMARY KEY (case_id, evidence_id),
    FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE TABLE CHAIN_OF_CUSTODY (
    chain_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(10) NOT NULL,
    evidence_id VARCHAR(10) NOT NULL,
    investigator_id VARCHAR(10) NOT NULL,
    department_id VARCHAR(10) NOT NULL,
    caction ENUM('collected', 'transferred', 'stored','released') NOT NULL,
    date_time DATETIME NOT NULL,
    notes TEXT,
    FOREIGN KEY (case_id, evidence_id) REFERENCES evidence(case_id, evidence_id),
    FOREIGN KEY (investigator_id) REFERENCES investigator(investigator_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

