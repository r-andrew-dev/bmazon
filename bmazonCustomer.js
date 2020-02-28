const mysql = require('mysql');
const inquirer = require('inquirer');
const inqConfirm = require('inquirer-confirm')

const connection = mysql.createConnection({
  host: "localhost", port: 3306, user: "root", password: "Midnight*1", database: "bmazon"
});

function start() {
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayProducts();
})
}

start();

function confirm() {
  inqConfirm({
        question: 'Would you like to make a purchase?',
        default: false

  }).then(questions, productsAgain)
  }

function cancelled() {
  console.log( 'Thanks for stopping by!')
  connection.end()
}

function productsAgain() {
inqConfirm("Would you like to see our products again?")
.then(displayProducts, cancelled) 
}

function questions() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err 
  inquirer.prompt([
    {
      type: 'number',
      name: 'id',
      message: 'Please enter the ID # of the item you would like to purchase.',
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return 'Please enter a valid product ID number using digits 0-9.';
      }
    },
    {
      type: 'number',
      name: 'quantity',
      message: 'How many of this item would you like to purchase?',
      default: 0,
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return 'Please enter a valid product quantity using digits 0-9.';
      }
    },
  ]).then(function (answer) {
      let chosenProduct;
      for (let i = 0; i < results.length; i++) {
        if (results[i].id === answer.id) {
          chosenProduct = results[i];
        }
      }
        if (chosenProduct.stock_quantity >= answer.quantity) {
          let newQuantity = chosenProduct.stock_quantity - answer.quantity
        connection.query(
          "UPDATE products SET ? WHERE ?", [
          {
            stock_quantity: newQuantity
          },
          {
            id: chosenProduct.id
          }
        ],
          function (error) {
            if (error) throw err;
            console.log("Order placed successfully! Thank you for your order. Your total is: $" + (parseInt(answer.quantity) * parseInt(chosenProduct.price)));
            inqConfirm("Would you like to see our products again?")
            .then(displayProducts, cancelled)      
          });
      }

      else {

        console.log("I'm sorry. Your product ID was not available in our database or the quantity requested was too high")
        displayProducts();
      }
    })

  })
}

function displayProducts() {
    console.log("Welcome! Fetching available products...\n");
    connection.query("SELECT * FROM products", function (err, results) {
      if (err) throw err;
      // Log all results of the SELECT statement
      for (let i = 0; i < results.length; i++) {
        console.log("ID: " + results[i].id + " | Product: " + results[i].product_name + " | Price: $" + results[i].price + ".00 | Available: " + results[i].stock_quantity +"\n");
      }
      console.log("Salutations! Please scroll up to see all available products. ");
      confirm()
    });
  }

