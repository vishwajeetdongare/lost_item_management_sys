const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "lost_items_db"
});

db.connect(err => {
    if (err) {
        console.error("DB Error:", err);
        return;
    }
    console.log("MySQL Connected ✅");
});

// Add item
app.post("/add-item", (req, res) => {
    const { name, description, location, date, contact } = req.body;

    const sql = "INSERT INTO items (name, description, location, date, contact) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [name, description, location, date, contact], (err, result) => {
        if (err) {
            console.error("Insert Error:", err);
            return res.status(500).send("Error");
        }

        res.send("Item Added ✅");
    });
});

// Get items
app.get("/items", (req, res) => {
    db.query("SELECT * FROM items", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching items");
        }
        res.json(result);
    });
});

// ✅ DELETE (ONLY ONCE)
app.delete("/delete-item/:id", (req, res) => {
    const id = req.params.id;

    console.log("Deleting from DB:", id);

    db.query("DELETE FROM items WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Delete Error:", err);
            return res.status(500).send("Error deleting");
        }

        // Check if item existed
        if (result.affectedRows === 0) {
            return res.status(404).send("Item not found");
        }

        res.send("Deleted ✅");
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});