const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).send({ error: "User not found!" });
  }
  request.user = user;

  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  if (!name) {
    return response.status(400).send({ error: "Name is required!" });
  }
  if (!username) {
    return response.status(400).send({ error: "Name is required!" });
  }

  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).send({ error: "User already exists!" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).send(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
