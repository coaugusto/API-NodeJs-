const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Number of requests: ${numberOfRequests}`);

  return next();
}
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const idExists = projects.find(p => p.id == id);
  if (!idExists) {
    return res.status(400).json({ error: "Projeto does not exists" });
  }
  res.params = idExists;
  return next();
}

server.get("/projects", logRequests, (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  const { id } = req.params;
  return res.json(projects.id);
});

server.post("/projects", logRequests, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    task: []
  };
  projects.push(project);
  return res.json(project);
});

//Inserir Tasks

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
