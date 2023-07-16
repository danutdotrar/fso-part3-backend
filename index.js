require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

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
    Person.find({}).then((person) => response.json(person));
});

const personsLength = Person.length;
const date = new Date();

app.get("/api/info", (request, response) => {
    response.send(
        `<p>Phonebook has info for ${personsLength} people</p> <p>The date is:${date}</p>`
    );
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then((note) => {
        response.json(note);
    });
});

app.delete("/api/persons/:id", (request, response) => {
    // const id = Number(request.params.id);
    // persons = persons.filter((person) => person.id !== id);

    Person.findByIdAndRemove(request.params.id)
        .then((result) => response.status(204).end())
        .catch((error) => next(error));
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

    // const checkIfExists = Person.map((person) => person.name).includes(
    //     body.name
    // );
    // if (checkIfExists) {
    //     return response.status(400).json({ error: "the name already exists" });
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    console.log(request.body);

    person.save().then((savedPerson) => response.json(savedPerson));

    // persons = persons.concat(person);
    // response.json(person);
});

const errorHandling = (error, request, response, next) => {
    console.log(error);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

app.use(errorHandling);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
