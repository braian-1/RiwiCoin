const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // 👈 necesario para usar fetch en Node

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // cámbialo si usas otro usuario
  password: "MiNuevaClave123!", // tu clave
  database: "CryptoRiwi"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Conectado a MySQL");
});

// ---------------------- CRUD USERS ----------------------

// GET todos los usuarios
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: "Error obteniendo usuarios" });
    res.json({ data: results });
  });
});

// POST crear usuario
app.post("/users", (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  db.query(
    "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    [first_name, last_name, email, password, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error creando usuario" });
      res.json({ message: "✅ Usuario creado", id: result.insertId });
    }
  );
});

// ---------------------- CRUD WALLETS ----------------------

app.get("/wallets", (req, res) => {
  db.query("SELECT * FROM wallet", (err, results) => {
    if (err) return res.status(500).json({ error: "Error obteniendo wallets" });
    res.json({ data: results });
  });
});

app.post("/wallets", (req, res) => {
  const { user_id, balance } = req.body;
  db.query(
    "INSERT INTO wallet (user_id, balance) VALUES (?, ?)", 
    [user_id, balance],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error creando wallet" });
      res.json({ message: "✅ Wallet creada", id: result.insertId });
    }
  );
});

// ---------------------- CRUD TRANSACTIONS ----------------------

app.get("/transactions", (req, res) => {
  db.query("SELECT * FROM transactions", (err, results) => {
    if (err) return res.status(500).json({ error: "Error obteniendo transacciones" });
    res.json({ data: results });
  });
});

app.post("/transactions", (req, res) => {
  const { wallet_id, type, amount } = req.body;
  db.query(
    "INSERT INTO transactions (wallet_id, type, amount) VALUES (?, ?, ?)",
    [wallet_id, type, amount],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error creando transacción" });
      res.json({ message: "✅ Transacción registrada", id: result.insertId });
    }
  );
});

// ---------------------- CRUD PRODUCTS ----------------------

app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: "Error obteniendo productos" });
    res.json({ data: results });
  });
});

app.post("/products", (req, res) => {
  const { name, type, cost } = req.body;
  db.query(
    "INSERT INTO products (name, type, cost) VALUES (?, ?, ?)",
    [name, type, cost],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error creando producto" });
      res.json({ message: "✅ Producto agregado", id: result.insertId });
    }
  );
});

// ---------------------- CRYPTO PRICE (CoinGecko API) ----------------------

// Último precio en la DB
app.get("/crypto", (req, res) => {
  db.query("SELECT * FROM crypto_price ORDER BY timestamp DESC LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: "Error obteniendo precio" });
    if (results.length === 0) return res.json({ message: "No hay precios guardados" });
    res.json({ data: results[0] });
  });
});

// Actualizar precio desde CoinGecko y guardar en DB
app.get("/update-btc", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await response.json();
    const price = data.bitcoin.usd;

    db.query(
      "INSERT INTO crypto_price (crypto_name, crypto_price) VALUES (?, ?)", 
      ["Bitcoin", price], 
      (err) => {
        if (err) return res.status(500).json({ error: "Error guardando precio en DB" });
        res.json({ message: "✅ Precio actualizado", price });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo precio desde API" });
  }
});

// ---------------------- SERVER ----------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
