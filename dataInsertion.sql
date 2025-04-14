

INSERT INTO DEPARTMENTS (department_id, department_name, location, phone_number)
VALUES
    ('D001', 'Cyber Forensics Unit', '123 Digital St, NY', '555-1234'),
    ('D002', 'Data Recovery Lab', '456 Tech Ave, CA', '555-5678');

INSERT INTO INVESTIGATOR (investigator_id, invname, email, phone, invrole, department_id, password)
VALUES
    ('I001', 'Alice Johnson', 'alice@dfcms.com', '555-2345', 'investigator', 'D001', '$2b$10$TQ6Mh1CJHWnrOWePIO4BeOrAT60csvfe.lVuwEGroAYFl4VgsZDQe'),
    ('I002', 'Bob Smith', 'bob@dfcms.com', '555-6789', 'dba', 'D002', '$2b$10$IiDaFYLmpgL/Eg.CeIv3x.JMcNOyhuLBQpXQm1I6QZpSeFulacLfa');

INSERT INTO CASES (case_id, title, cdescription, cstatus, date_created, last_updated, assigned_to)
VALUES
    ('C001', 'Ransomware Attack Investigation', 'Investigating a ransomware attack on corporate servers.', 'open', '2024-02-01', '2024-02-10', 'I001'),
    ('C002', 'Insider Threat Data Leak', 'Possible unauthorized data access by an employee.', 'open', '2024-02-05', '2024-02-12', 'I002');


INSERT INTO EVIDENCE (evidence_id, case_id, evidence_type, edescription, file_path, hash_value, collected_by, date_collected)
VALUES
    ('E001', 'C001', 'txt', 'Encrypted ransomware note found on the server.', '/evidence/ransomware_note.txt', 'a3f1b4c7d9e2', 'I001', '2024-02-02'),
    ('E002', 'C002', 'video', 'Security footage of suspect accessing files.', '/evidence/footage.mp4', 'b7d9f2e1c3a4', 'I002', '2024-02-06');


INSERT INTO CHAIN_OF_CUSTODY (chain_id, case_id, evidence_id, investigator_id, department_id, caction, date_time, notes)
VALUES
    ('CH001', 'C001', 'E001', 'I001', 'D001', 'collected', '2024-02-02 10:30:00', 'Initial collection from server.'),
    ('CH002', 'C002', 'E002', 'I002', 'D002', 'transferred', '2024-02-06 14:15:00', 'Sent to forensic lab for analysis.');
