import inquirer from "inquirer";
import pg from "pg";
import dotenv from "dotenv";

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "employee_tracker",
  password: "winterbootcamp",
  port: 5432,
});

async function main() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "Add an employee",
        "Update an employee role",
        "View all roles",
        "Add a role",
        "View all departments",
        "Add a department",
        "Exit",
      ],
    },
  ]);

  switch (action) {
    case "View all employees":
      await viewEmployees();
      break;
    case "Add an employee":
      await addEmployee();
      break;
    case "Update an employee role":
      await updateEmployeeRole();
      break;
    case "View all roles":
      await viewRoles();
      break;
    case "Add a role":
      await addRole();
      break;
    case "View all departments":
      await viewDepartments();
      break;
    case "Add a department":
      await addDepartment();
      break;
    case "Exit":
      process.exit();
  }
}

async function viewEmployees() {
  const result = await pool.query("SELECT * FROM employees");
  console.table(result.rows);
  await main();
}

async function addEmployee() {
  try {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the employee's role ID:",
      },
      {
        type: "input",
        name: "managerId",
        message: "Enter the manager's ID (leave blank if none):",
        default: null,
      },
    ]);

    const query = `
      INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [firstName, lastName, roleId, managerId || null]);

    console.log(`Employee ${firstName} ${lastName} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    await main();
  }
}

async function updateEmployeeRole() {
  try {
    const employeesResult = await pool.query(`
      SELECT role_id, CONCAT(first_name, ' ', last_name) AS name FROM employees
    `);
    const employees = employeesResult.rows;

    const rolesResult = await pool.query(`
      SELECT role_id, title FROM roles
    `);
    const roles = rolesResult.rows;

    const { employeeId } = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select the employee whose role you want to update:",
        choices: employees.map((employee) => ({
          name: employee.name,
          value: employee.id,
        })),
      },
    ]);

    const { roleId } = await inquirer.prompt([
      {
        type: "list",
        name: "roleId",
        message: "Select the new role for the employee:",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.role_id,
        })),
      },
    ]);

    await pool.query(
      `
      UPDATE employees
      SET role_id = $1
      WHERE employee_id = $2
    `,
      [roleId, employeeId]
    );

    console.log("Employee role updated successfully!");
  } catch (error) {
    console.error("Error updating employee role:", error);
  } finally {
    await main();
  }
}

async function viewRoles() {
  const result = await pool.query("SELECT * FROM roles");
  console.table(result.rows);
  await main();
}

async function addRole() {
  try {
    const departmentsResult = await pool.query(`
      SELECT department_id, department_name FROM departments
    `);
    const departments = departmentsResult.rows;

    if (departments.length === 0) {
      console.log("No departments available. Please add a department first.");
      return await main();
    }

    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the role title:",
        validate: (input) =>
          input.trim() !== "" ? true : "Role title cannot be empty.",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the role salary:",
        validate: (input) =>
          !isNaN(input) && input > 0
            ? true
            : "Please enter a valid positive number for the salary.",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Select the department for the role:",
        choices: departments.map((dept) => ({
          name: dept.department_name,
          value: dept.department_id,
        })),
      },
    ]);

    await pool.query(
      `
      INSERT INTO roles (title, salary, department_id)
      VALUES ($1, $2, $3)
    `,
      [title, salary, departmentId]
    );

    console.log("Role added successfully!");
  } catch (error) {
    console.error("Error adding role:", error);
  } finally {
    await main();
  }
}

async function viewDepartments() {
  const result = await pool.query("SELECT * FROM departments");
  console.table(result.rows);
  await main();
}

async function addDepartment() {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
        validate: (input) =>
          input.trim() !== "" ? true : "Department name cannot be empty.",
      },
    ]);

    await pool.query(
      `
      INSERT INTO departments (department_name)
      VALUES ($1)
    `,
      [departmentName]
    );

    console.log("Department added successfully!");
  } catch (error) {
    console.error("Error adding department:", error);
  } finally {
    await main();
  }
}

main();
