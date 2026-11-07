const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const app = express();
app.use(express.urlencoded({ extended: true }));

const db = new DatabaseSync("shop.db");
db.exec(`CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY,
  name TEXT,
  price INTEGER,
  qty INTEGER
)`);

let count = db.prepare("SELECT COUNT(*) as c FROM items").get().c;
if (count === 0) {
  const insert = db.prepare("INSERT INTO items (name, price, qty) VALUES (?, ?, ?)");
  insert.run("Chai", 100, 3);
  insert.run("Biscuit", 50, 2);
  insert.run("Cake", 200, 1);
}

app.get("/", (req, res) => {
  const items = db.prepare("SELECT * FROM items").all();
  let grandTotal = 0;
  let rows = "";
  for (let i = 0; i < items.length; i++) {
    let total = items[i].price * items[i].qty;
    grandTotal += total;
    rows += `<tr><td>${items[i].name}</td><td>${total}</td><td><a href="/delete/${items[i].id}" style="color:red;">Delete</a></td></tr>`;
  }
  let discount = grandTotal > 350 ? 50 : 0;
  let finalBill = grandTotal - discount;
  res.send(`<!DOCTYPE html><html><head><style>body{font-family:Arial;margin:40px;}h1{color:green;}table{border-collapse:collapse;width:60%;}th{background:green;color:white;padding:10px;}td{border:1px solid #ccc;padding:10px;}button{background:green;color:white;padding:10px;}</style></head><body><h1>My Shop Bill</h1><table><tr><th>Item</th><th>Total</th><th>Action</th></tr>${rows}</table><h3>Grand Total: ${grandTotal}</h3><p>Discount: ${discount}</p><h3>Final Bill: ${finalBill}</h3><hr><h2>Add New Item</h2><form action="/add-item" method="POST"><input name="name" placeholder="Item name"><input name="price" placeholder="Price"><input name="qty" placeholder="Qty"><button>Add Item</button></form></body></html>`);
});

app.get("/items", (req, res) => {
  res.json(db.prepare("SELECT * FROM items").all());
});

app.post("/add-item", (req, res) => {
  db.prepare("INSERT INTO items (name, price, qty) VALUES (?, ?, ?)").run(req.body.name, Number(req.body.price), Number(req.body.qty));
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  db.prepare("DELETE FROM items WHERE id = ?").run(req.params.id);
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server chal raha hai: http://localhost:" + PORT);
});

