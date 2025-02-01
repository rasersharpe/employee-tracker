SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;


SELECT 
    employees.first_name || ' ' || employees.last_name AS full_name,
    roles.title, 
    departments.department_name
    m.first_name, ' ', m.last_name AS manager_name
FROM employees
LEFT JOIN roles
ON employees.role_id = roles.role_id
LEFT JOIN departments
ON roles.department_id = departments.department_id;
LEFT JOIN employees m
ON e.manager_id = m.employee_id;