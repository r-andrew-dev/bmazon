const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost', port: 3306, user: 'root', password: 'Midnight*1', database: 'bmazon'
});

const prompt = inquirer.createPromptModule();

start()

function cancelled() {
    console.log('Thanks for stopping by!')
    connection.end()
}

function start() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId + '\n');
        displayOptions();
    })
};

function displayOptions() {
    prompt({
        type: 'list',
        name: 'supervisorOptions',
        message: 'What would you like to do?',
        choices: ['View Product Sales by Department', 'Create New Department', 'EXIT']
    }).then(function (answer) {

        switch (answer.supervisorOptions) {
            case 'View Product Sales by Department':
                viewProductSales()
                break;
            case 'Create New Department':
                createNewDepartment()
                break;
            default:
                cancelled();
        }
    })
}

function viewProductSales() {
    let query = "SELECT d.dept_id, d.department_name, d.over_head_costs, "
    query += "SUM(p.product_sales) AS dept_sales, SUM(p.product_sales) - over_head_costs AS total_profit FROM products p "
    query += "JOIN departments d ON p.department_name = d.department_name "
    query += "GROUP BY d.dept_id, d.department_name ORDER BY total_profit DESC;"
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.table(results);
        displayOptions();
    })
}

function createNewDepartment() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err
        prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Please enter the name for the department to create.',
                validate: function (value) {
                    if (isNaN(value) === true) {
                        return true;
                    }
                    return 'Please enter a valid department name.';
                }
            },
            {
                type: 'number',
                name: 'overHeadCosts',
                message: 'What is the overhead cost for this department?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return 'Please enter a valid overhead cost using digits 0-9.';
                }
            },]).then(function (answer) {

                let newDepartment = answer.departmentName
                let newOverHead = answer.overHeadCosts
                connection.query(
                    "INSERT INTO departments SET ?",
                    {
                        department_name: newDepartment,
                        over_head_costs: newOverHead,
                    },
                    function (err, results) {
                        if (err) throw err;
                        console.log("Department " + newDepartment + " has been added sucessfully with over head cost of $" + newOverHead + ".") 
                    })
            })
    })

}
