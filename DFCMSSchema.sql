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

CREATE TABLE EVIDENCE
(
	evidence_id varchar(10) PRIMARY KEY,
    case_id varchar(10) NOT NULL,
    evidence_type enum('txt','video','audio','other') NOT NULL,
    edescription text,
    file_path varchar(255) NOT NULL,
    hash_value varchar(255) NOT NULL,
    collected_by varchar(10) NOT NULL,
    date_collected date NOT NULL,
    FOREIGN KEY(collected_by) REFERENCES investigator(investigator_id)
);

CREATE TABLE CHAIN_OF_CUSTODY
(
	chain_id varchar(10) PRIMARY KEY,
    evidence_id varchar(10) NOT NULL,
    investigator_id varchar(10) NOT NULL,
    department_id varchar(10) NOT NULL,
    caction enum('collected', 'transferred', 'stored', 'analyzed', 'released') NOT NULL,
    date_time datetime NOT NULL,
    notes text,
    FOREIGN KEY(evidence_id) REFERENCES evidence(evidence_id),
	FOREIGN KEY(investigator_id) REFERENCES investigator(investigator_id),
    FOREIGN KEY(department_id) REFERENCES departments(department_id)
);


