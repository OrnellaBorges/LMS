//import express from "express";
import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";


const db = new sqlite3.Database('./lms_db.sqlite');


// Initialisation d'Express
const app = express();
const port = 3002;

// Middleware pour parser le body en JSON
app.use(express.json());

type LeaveRequest = {
  id: string;
  employeeId: string;
  managersId: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected"; // Status of the leave request (e.g., "pending", "approved", "rejected")
  comment: string;
  managerComment: string | null;
};

type Employee = {
  id: string; // Unique identifier for the employee
  name: string; // Name of the employee
  role: string; // Role of the employee (e.g., "employee", "manager")
};
type Manager = {
  id: string; // Unique identifier for the manager
  name: string; // Name of the manager
  role: string; // Role of the manager (e.g., "manager")
};


const employees: Employee[] = [
  { id: "e1", name: "Alice Martin", role: "employee" },
  { id: "e2", name: "Bob Dupont", role: "employee" },
  { id: "e3", name: "Sophie Leroy", role: "employee" },
  { id: "e4", name: "Carole Merlin", role: "employee" },
  { id: "e5", name: "Jean Valjean", role: "employee" },
  { id: "e6", name: "Hello World", role: "employee" },
  { id: "e7", name: "Martin Fourcade", role: "employee" }
];
const managers: Manager[] = [
  { id: "m1", name: "Jean Dupuis", role: "manager" },
  { id: "m2", name: "Marie Curie", role: "manager" }
];


const leaveRequests: LeaveRequest[] = [
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

app.get("/table", (req, res) => {
  // Créer la table si elle n'existe pas
  db.run(`
    CREATE TABLE IF NOT EXISTS leaveRequests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId INTEGER NOT NULL,
      fullName TEXT NOT NULL,
      managerId INTEGER NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      comment TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erreur de création de la table :', err);
      res.status(500).send("Erreur lors de la création de la table.");
    } else {
      console.log('Table leaveRequests créée avec les champs complets.');
      res.send("✅ Table leaveRequests créée (ou déjà existante).");
    }
  });
});

// Get all leave requests
app.get("/leaveRequests", (req, res) => {
  res.json(leaveRequests);
});

app.get("/leaveRequests2", (req, res) => {
  //db.all("", ()=>{})
  db.all("SELECT * FROM leaveRequests ", (err, rows) => {
    res.json(rows)
  });
});



// Get all employees
app.get("/allEmployees", (req, res) => {
  res.json(employees);
});

// Get all managers
app.get("/allManagers", (req, res) => {
  res.json(managers);
});

/// Create a new leave request
app.post("/newLeaveRequest", (req, res) => {
  const { employeeId, managersId, startDate, endDate, comment } = req.body;

  const newLeaveRequest: LeaveRequest = {
    id: `${leaveRequests.length + 1}`,
    employeeId,
    managersId,
    startDate,
    endDate,
    status: "pending",
    comment,
    managerComment: null
  };

  leaveRequests.push(newLeaveRequest);
  res.status(201).json(newLeaveRequest);
});

/// Create a new leave request
app.post("/newLeaveRequest2", (req, res) => {
  console.log("Requête reçue :", req.body);
  const { employeeId, fullName, managerId, startDate, endDate, comment } = req.body;
  db.run("INSERT INTO leaveRequests(employeeId, fullName, managerId, startDate, endDate, comment) VALUES (?, ?, ?, ?, ?, ?)", [employeeId, fullName, managerId, startDate, endDate, comment], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error inserting data into the database.");
    } else {
      res.send("OK, request successful!");
    }
  });

});




// Route pour mettre à jour une demande de congé
//  PATCH => modif partielle != PUT remplacement complet
app.patch("/leaveRequests/:id", (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, comment } = req.body;

  const request = leaveRequests.find((req) => req.id === id);
  if (!request) {
    return res.status(404).json({ error: "Demande non trouvée." });
  }

  if (startDate) request.startDate = startDate;
  if (endDate) request.endDate = endDate;
  if (comment) request.comment = comment;

  res.json(request);
});

// Route pour supprimer une demande de congé
app.delete("/leaveRequests/:id", (req, res) => {
  const { id } = req.params;

  const index = leaveRequests.findIndex((req) => req.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Demande non trouvée." });
  }

  const deleted = leaveRequests.splice(index, 1);
  res.status(200).json({ message: "Demande supprimée", deleted });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log("Hello World!");
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

//Get recent leave requests




// Get leave request by ID

// Approve a leave request by ID
// Reject a leave request by ID
// Get leave requests by employee ID
// Get leave requests by manager ID
// Get leave requests by status
// Get leave requests by date range
// Get leave requests by employee ID and status
// Get leave requests by manager ID and status
// Get leave requests by employee ID and date range
// Get leave requests by manager ID and date range
// Get leave requests by employee ID and manager ID
// Get leave requests by employee ID and manager ID and status

