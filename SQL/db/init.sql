CREATE DATABASE IF NOT EXISTS ekco_assessment;

USE ekco_assessment;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    date_of_birth DATE,
    occupation VARCHAR(255),
    gender VARCHAR(10),
    date_added DATE
);