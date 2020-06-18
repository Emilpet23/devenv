const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create - Post request
app.post("/insert", (request, response) => {
  const { navn, beskrivelse, kg, amount, pris, kategori } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewProduct(navn, beskrivelse, kg, amount, pris, kategori);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// Read - Get request
app.get("/getAll", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// Update - Patch request
app.patch("/update", (request, response) => {
  const { id, navn } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.updateProductById(id, navn);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

// Delete - sletter en row ud fra id
app.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

// Lytter til porten, og melder tilbage i terminalen om den kører
app.listen(process.env.PORT, () => console.log("Appen kører"));
