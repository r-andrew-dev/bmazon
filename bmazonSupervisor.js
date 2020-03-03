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
    let query = "SELECT products.department_name, departments.over_head_costs, products.product_sales, "
    query += "COUNT(products.product_sales) AS product_sales "
    query += "FROM departments INNER JOIN products ON products.department_name = departments.department_name "
    query += "GROUP BY department_name"
    connection.query(query, function(err, results) {
        if (err) throw err;
        console.table(results);
    })
}