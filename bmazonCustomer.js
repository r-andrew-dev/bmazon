const mysql = require('mysql');
const inquirer = require('inquirer');
const inqConfirm = require('inquirer-confirm')

const connection = mysql.createConnection({
  host: "localhost",port: 3306,user: "root",password: "Midnight*1",database: "bmazon"
});

const confirm = function() {inqConfirm('Would you like to make a purchase?')
  .then(function questions() {

    inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Please enter the ID # of the item you would like to purchase.',
        validate: function (value) {
          // regEx exp to validate input is a 1 - 3 digit number. Would need to be modified if over 999 products in database.
          let pass = value.match(/^\d{1,3}$/);
  
          if (pass) {
            return true;
          }
          return 'Please enter a valid product ID number up to 999 using digits 0-9.'
  
        }
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How many of this item would you like to purchase?',
        validate: function (value) {
          // regEx exp to validate input is a 1-3 digit number. Would need to be updated if 
          // any product had more than 999 in stock. 
          let pass = value.match(/^\d{1,3}$/);
  
          if (pass) {
            return true;
          }
          return 'Please enter a valid product quantity up to 999 as a number using digits 0-9.'
        }
  
      },
    ]
    )
    
  }, function cancelled() {
    console.log('Sorry to hear that. Thanks for stopping by!')
    connection.end()
  }
  )};

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayProducts();
});

function displayProducts() {
  console.log("Welcome to the store! Fetching available products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (let i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].id + " | Product: " + res[i].product_name + " | Price: $" + res[i].price + ".00 |\n");
    }
    console.log("Welcome to the store! Please scroll up to see all available products. ");
    confirm()
  });
}

// function askCustomer() {

//   inquirer.prompt(questions)
//     .then(answers => {
//       console.log(JSON.stringify(answers, null, ' '));
//     })
// }