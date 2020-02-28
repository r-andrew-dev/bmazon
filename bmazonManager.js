const mysql = require('mysql');
const inquirer = require('inquirer');
const inqConfirm = require('inquirer-confirm')

const connection = mysql.createConnection({
    host: 'localhost', port: 3306, user: 'root', password: 'Midnight*1', database: 'bmazon'
});

start()

function start() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId + '\n');
        displayOptions();
    })
};

function displayOptions() {
    inquirer.prompt({
        type: 'list',
        name: 'managerOptions',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory',
            'Add to Inventory', 'Add New Product to Inventory']
    }).then(function (answer) {

        switch (answer.managerOptions) {
            case 'View Products for Sale':
                viewProducts()
                break;
            case 'View Low Inventory':
                viewLowInventory()
                break;
            case 'Add to Inventory':
                addtoInventory();
            case 'Add New Product to Inventory':
                addNewProduct()
                break;
            default: connection.end();

        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.table(results);

    })
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        console.table(results);
    })
}




