const express = require("express");
const morgan = require("morgan");

const app = express();

morgan.token("body-data", (request, response) => {
  return request.body ? JSON.stringify(request.body) : "";
});

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] :body-data"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const date = new Date();
  const formatedDate = `${
    date.getMonth() + 1
  } ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const responseBody = `<div><span>Phonebook has info for ${persons.length} people</span><br /><span>${formatedDate}</span></div>`;

  response.send(responseBody);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.random() * 1000000;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (
    persons.find(
      (person) => person.name === body.name || person.number === body.number
    )
  ) {
    response.status(400).json({ error: "Some data already exists" });
  } else if (body.name && body.number) {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);
    response.json(person);
  } else {
    response.status(400).json({ error: "content missing" });
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3005;
app.listen(PORT);

console.log(`App running on port ${PORT}`);
