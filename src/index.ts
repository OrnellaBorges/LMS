import express from "express";

const app = express();
const port = 3002;

const employees = [
  { id: "e1", name: "Alice Martin", role: "employee" },
  { id: "e2", name: "Bob Dupont", role: "employee" },
  { id: "e3", name: "Sophie Leroy", role: "employee" },
  { id: "e4", name: "Carole Merlin", role: "employee" },
  { id: "e5", name: "Jean Valjean", role: "employee" },
  { id: "e6", name: "Martin Fourcade", role: "employee" }
];
const managers = [
  { id: "m1", name: "Jean Dupuis", role: "manager" },
  { id: "m2", name: "Marie Curie", role: "manager" }
];
const leaveRequests = [
  {
    id: "1",
    employeeId: "e1",
    managersId: "m1",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    status: "pending",
    comment: "Besoin de repos",
    managerComment: null
  },
  {
    id: "2",
    employeeId: "e2",
    managersId: "m2",
    startDate: "2025-04-15",
    endDate: "2025-04-18",
    status: "approved",
    comment: "Vacances en famille",
    managerComment: "Profitez bien !"
  },
  {
    id: "2",
    employeeId: "e3",
    managersId: "m1",
    startDate: "2025-04-20",
    endDate: "2025-04-21",
    status: "rejected",
    comment: "Week-end prolongé",
    managerComment: "Trop de demandes à cette période"
  }
];

app.get("/", (req, res) => {
  res.send("Bienvenue sur ton backend 🎉");
});

app.get("/leaveRequests", (req, res) => {
  res.json(leaveRequests);
});

app.listen(port, () => {
  console.log("Hello World!");
  console.log(`Serveur lancé sur http://localhost:${port}`);
});