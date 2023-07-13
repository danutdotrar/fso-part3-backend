const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

// Process command-line arguments
const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://phonebook-fso:${password}@cluster1.crqlkbm.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number,
});

const Person = mongoose.model("Person", personSchema);

if (password && name && phoneNumber) {
    const person = new Person({
        name,
        phoneNumber,
    });

    person.save().then(() => {
        console.log(`added ${name} and number ${phoneNumber} to the phonebook`);
    });
} else if (password) {
    Person.find({}).then((persons) => {
        persons.map((person) => {
            console.log(person.name, person.phoneNumber);
            mongoose.connection.close();
        });
    });
}
