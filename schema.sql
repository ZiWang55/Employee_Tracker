-- CREATING OUR DATABASE --
DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- DEPARTMENT TABLE ----
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30)
);

-- DEPARTMENT TABLE ----
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR (30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

-- EMPLOYEE ROLE TABLE ----
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

-- Department seeds
INSERT INTO
    department (name) VALUE ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

-- Employee role seeds
INSERT INTO
    role (title, salary, department_id) VALUE (
        "Lead Engineer",
        150000,
        2
    ),
    ("Legal Team Lead", 250000, 4),
    ("Accountant", 125000, 3),
    ("Sales Lead", 100000, 1),
    ("Salesperson", 8000, 1),
    ("Software Engineer", 120000, 2),
    ("Lawyer", 190000, 4);

-- Employee seeds
INSERT INTO
    employee (first_name, last_name, manager_id, role_id) VALUE(
        "Jeffery",
        "Hoseman",
        null,
        1
    ),
    ("Jason", "Lao", null, 3),
    ("Tiff", "Melby", 1, 4),
    ("Mia", "Lam", null, 2),
    ("Mercedes", "Johnson", 4, 5),
    ("Jack", "Wong", 2, 7);

-- Selecting
SELECT
    *
FROM
    department;

SELECT
    *
FROM
    role;

SELECT
    *
FROM
    employee;