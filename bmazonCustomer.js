const mysql = require('mysql');
const inquirer = require('inquirer');
const inqConfirm = require('inquirer-confirm')

const connection = mysql.createConnection({
  host: "localhost", port: 3306, user: "root", password: "Midnight*1", database: "bmazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayProducts();
});

const confirm = function () {
  inqConfirm('Would you like to make a purchase?')
  .then(function questions() {
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
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
    ]).then(answers => {
        let chosenProduct;
        for (let i = 0; i < results.length; i++) {
          if (results[i].id === answers.id) {
            chosenProduct = results[i];
          }
        }

        if (chosenProduct.stock_quantity <= parseInt(answer.quantity)) {
          connection.query(
            "UPDATE products SET ? WHERE ?", [
            {
              stock_quantity: (products.stock_quantity - answer.quantity)
            },
            {
              id: chosenProduct
            }
          ],
            function (error) {
              if (error) throw err;
              console.log("Order placed successfully! Your total is: " + (parseInt(chosenProduct.stock_quantity) * parseInt(chosenProduct.price)));
              displayProducts();
            });
        }

        else {

          console.log("I'm sorry. Your product ID was not available in our database or the quantity requested was too high")
          displayProducts();
        }
      });

      })}, function cancelled() {
        console.log('Sorry to hear that. Thanks for stopping by!')
        connection.end()
      })
  };

  function displayProducts() {
    console.log("Welcome to the store! Fetching available products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      for (let i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].id + " | Product: " + res[i].product_name + " | Price: $" + res[i].price + ".00 | Available: " + res[i].stock_quantity +"\n");
      }
      console.log("Welcome to the store! Please scroll up to see all available products. ");
      confirm()
    });
  }

