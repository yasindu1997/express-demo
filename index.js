// index.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON bodies

// In-memory "database"
let items = [];
let nextId = 1;

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// Create (POST /items)
app.post("/items", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Field 'name' (string) is required" });
  }
  const item = { id: nextId++, name };
  items.push(item);
  res.status(201).json(item);
});

// Read all (GET /items)
app.get("/items", (req, res) => {
  res.json(items);
});

// Read one (GET /items/:id)
app.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// Update (PUT /items/:id)
app.put("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Field 'name' (string) is required" });
  }
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });

  items[idx] = { ...items[idx], name };
  res.json(items[idx]);
});

// Delete (DELETE /items/:id)
app.delete("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });

  const [removed] = items.splice(idx, 1);
  res.json(removed);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
