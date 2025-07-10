CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_added DATE NOT NULL
);