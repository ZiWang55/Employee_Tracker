//Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "fireman",
  database: "employee_trackerDB",
});

//Connection id
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
  startPrompt();
});

//Initial Prompt
function startPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "View All Employees?",
          "View All Employees By Roles?",
          "View All Employees By Department?",
          "Update Employee",
          "Add Employee?",
          "Add Role?",
          "Add Department?",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case "View All Employees?":
          viewAllEmployees();
          break;

        case "View All Employees By Roles?":
          viewAllRoles();
          break;

        case "View All Employees By Department?":
          viewAllDepartments();
          break;

        case "Add Employee?":
          AddEmployee();
          break;

        case "Update Employee?":
          updateEmployee();
          break;

        case "Add Role?":
          addRole();
          break;

        case "Add Department?":
          addDepartment();
          break;
      }
    });
}

//View all emplyees
function viewAllEmployees() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//View all roles
function viewAllRoles() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//View all employees by departments
function viewAllDepartments() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//Select role title for add employee
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}
//Select manager for addd employee
var managerArr = [];
function selectManager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name);
      }
    }
  );
  return managersArr;
}
//Add employee
function AddEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "enter their first name",
      },
      {
        name: "lastname",
        type: "input",
        message: "enter their last name",
      },
      {
        name: "role",
        type: "list",
        message: "what is their role?",
        choices: selectRole(),
      },
      {
        name: "choice",
        type: "rawlist",
        message: "who is their manager",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1;
      var mangerId = selectManager().indexOf(val.choice) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId,
        },
        function (err) {
          if (err) throw err;
          console.table(val);
          startPrompt();
        }
      );
    });
}
//Update employee
function updateEmployee() {
  connection.query(
    "SELECT employee.last_name, role.title FROm employee JOIN role On employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the employee's last name?",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the employee's new title?",
            choices: selectRole(),
          },
        ])
        .then(function (val) {
          var roleId = selectRole().indexOf(val.role) + 1;
          connection.query(
            "UPDATE employee SET WHERE ?",
            {
              last_name: val.lastName,
            },
            {
              role_id: roleId,
            },
            function (err) {
              if (err) throw err;
              console.table(val);
              startPrompt();
            }
          );
        });
    }
  );
}
