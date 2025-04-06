console.log("Hello World!");
import express from "express";

const app = express();
const port = 3002;

app.get("/", (req, res) => {
  res.send("Bienvenue sur ton backend 🎉");
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});