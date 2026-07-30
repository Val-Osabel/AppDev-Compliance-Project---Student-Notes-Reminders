CREATE DATABASE compliance_db;
USE compliance_db;

CREATE TABLE tasks (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
category VARCHAR(100) NOT NULL,
status ENUM('pending', 'completed') DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample records (REQUIRED)
INSERT INTO tasks (title, category, status) VALUES
('Finish homework', 'School', 'pending'),
('Workout', 'Personal', 'completed'),
('Project meeting', 'Work', 'pending');