CREATE DATABASE bmazon;

USE bmazon;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(200) NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("water bottle", "sporting goods", 16.00, 300), ("12in Cast Iron Skillet", "cookware", 20.00, 200),
        ("PS5", "electronics", 2000.00, 3), ("Dove Dark Chocolate", "food", 10.00, 50), ("Moulin Rouge DVD", "electronics", 22.00, 18),
        ("Baby Bear Chair", "Home&Decor", 30.00, 23), ("Duplos", "Toys", 13.00, 600), ("Upright Piano", "Instruments", 3,500, 6),
        ("Flower Pot", "Home&Garden", 14.00, 300), ("Purple Steering Wheel Cover", "automotive", 26.00, 67);




