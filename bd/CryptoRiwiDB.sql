CREATE DATABASE CryptoRiwi;
USE CryptoRiwi;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE wallet (
    wallet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(18, 8) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    type ENUM('deposit', 'withdrawal', 'purchase', 'reward', 'transfer', 'exchange') NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallet(wallet_id) ON DELETE CASCADE
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('course', 'ebook', 'subscription', 'event', 'merchandise', 'service') NOT NULL,
    cost DECIMAL(18, 8) NOT NULL
);

CREATE TABLE exchanges (
    exchange_id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    product_id INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallet(wallet_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE crypto_price(
    cryptoPrice_id INT AUTO_INCREMENT PRIMARY KEY,
    crypto_name VARCHAR(100) NOT NULL,
    crypto_price DECIMAL(18, 8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Jose', 'Monsalve', 'jose@mail.com', '1035854944x', 'admin');

INSERT INTO wallet (user_id, balance) VALUES (1, 99999999.99);

INSERT INTO transactions (wallet_id, type, amount) VALUES (1, 'reward', 9999999999.99);

INSERT INTO products (name, type, cost) VALUES ('Python Full Course', 'course', 100000);

INSERT INTO exchanges (wallet_id, product_id) VALUES (1, 1);

INSERT INTO crypto_price (crypto_name, crypto_price) VALUES ('Riwicoin', 1000000000);
