import mongoose from 'mongoose';
import { PersonType } from './types';

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://jhpyyk:${password}@cluster0.jbyexvh.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema<Omit<PersonType, 'id'>>({
    name: { type: String, required: true },
    number: { type: String, required: true },
})

const Person = mongoose.model<Omit<PersonType, 'id'>>('Person', personSchema)

const addPerson = async () => {
    await mongoose.connect(url);

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    await person.save().then(result => {
        console.log(`Added ${result.name} ${result.number} to phonebook`)
    })
    await mongoose.disconnect()
}

const getPersons = async () => {
    await mongoose.connect(url);

    await Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
    })
    await mongoose.disconnect()
}

if (process.argv.length === 3) {
    getPersons().catch(err => console.log(err))
} else if (process.argv.length === 5) {
    addPerson().catch(err => console.log(err))
} else {
    console.log(`The script needs 0 or 2 arguments. The number of arguments was ${process.argv.length - 3}`)
}