DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

\c employee_tracker;

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY NOT NULL,
    department_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id)
        REFERENCES departments (department_id)
        ON DELETE SET NULL
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    FOREIGN KEY (role_id)
        REFERENCES roles (role_id)
        ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
        REFERENCES employees (employee_id)
        ON DELETE SET NULL
);