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
  const { user } = request;

  return response.send(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  if (!title) {
    return response.status(400).send({ error: "Title is required!" });
  }
  if (!deadline) {
    return response.status(400).send({ error: "Deadline is required!" });
  }
  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  // user.todos.every((item) => {
  //   if (item.id === id) {
  //     item.title = title;
  //     item.deadline = new Date(deadline);
  //     return false;
  //   }
  //   return true;
  // });

  const todoToUpdate = user.todos.find((item) => item.id === id);
  todoToUpdate.title = title;
  todoToUpdate.deadline = new Date(deadline);

  return response.status(201).json(todoToUpdate);
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
