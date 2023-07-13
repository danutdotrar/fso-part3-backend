const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

const personsLength = persons.length;
const date = new Date();

app.get("/api/info", (request, response) => {
    response.send(
        `<p>Phonebook has info for ${personsLength} people</p> <p>The date is:${date}</p>`
    );
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

const generateId = () => {
    const id = Math.floor(Math.random() * 10000);
    console.log(id);
    return id;
};

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "the name is missing",
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: "the number is missing",
        });
    }

    const checkIfExists = persons
        .map((person) => person.name)
        .includes(body.name);

    if (checkIfExists) {
        return response.status(400).json({ error: "the name already exists" });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };

    console.log(request.body);

    persons = persons.concat(person);
    response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
