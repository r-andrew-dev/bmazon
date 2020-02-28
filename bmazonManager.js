const mysql = require('mysql');
const inquirer = require('inquirer');
const inqConfirm = require('inquirer-confirm')

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
        name: 'managerOptions',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory',
            'Add to Inventory', 'Add New Product to Inventory', 'EXIT']
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
            // case 'Add New Product to Inventory':
            //     addNewProduct()
            //     break;
            default: connection.end();

        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.table(results);
        displayOptions();

    })
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        console.table(results);
        displayOptions();
    })
}

function addtoInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err
        prompt([
            {
                type: 'number',
                name: 'id',
                message: 'Please enter the ID # of the item you would like to add inventory for.',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return 'Please enter a valid product ID number using digits 0-9.';
                }
            },
            {
                type: 'number',
                name: 'quantity',
                message: 'How many to add to inventory?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return 'Please enter a valid product ID number using digits 0-9.';
                }
            },]).then(function (answer) {
                let chosenProduct;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].id === answer.id) {
                        chosenProduct = results[i].id;
                    }
                }
                if(answer.quantity > 0) {
                    console.log(answer.quantity)
                    console.log(chosenProduct.stock_quantity)
                let newInventory = chosenProduct.stock_quantity + answer.quantity
                console.log("made it here")
                console.log(newInventory);
                connection.query(
                    "UPDATE products SET ? WHERE?", [
                    {
                        stock_quantity: newInventory
                    },
                    {
                        id: chosenProduct.id
                    }
                ],
                    function (error) {
                        if (error) throw err;
                        console.log(chosenProduct.product_name + "stock_quantity has been updated to: " + newInventory)
                        displayOptions();
                    });
                }

                else {

                    console.log("I'm sorry. The ID you entered is either not in our database or the quantity you entered is invalid.")
                    displayOptions();
                  }
                })
            
              })
            }


