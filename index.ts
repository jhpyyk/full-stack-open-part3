import express from "express"
import cors = require("cors")
import { PersonType } from "./types"
import Person from "./models/person"
import { HydratedDocument } from "mongoose"

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const PORT = process.env.PORT || 3001

app.get('/api/persons', (_request, response) => {
    Person.find({})
        .then(person => {
            response.json(person)
        })
        .catch(err => {
            console.log(err)
        })
})

app.post('/api/persons', (request, response) => {
    try {
        const newPerson = toNewPerson(request.body)

        newPerson.save()
            .then(person => {
                response.json(person)
            })
            .catch(err => {
                response.status(400).send(err)
            })

    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage = ' Error: ' + error.message;
        }
        response.status(400).send(errorMessage);
    }
})

/* app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id == request.params.id)
    if (!person) {
        response.status(404).end()
        return
    }
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const personToDelete = persons.find(person => person.id === request.params.id)
    if (!personToDelete) {
        response.status(404).end()
        return
    }
    persons = persons.filter(person => person.id !== request.params.id)
    response.json(personToDelete)
}) */

/* app.post('/api/persons', (request, response) => {
    try {
        const newPerson = toNewPerson(request.body)
        if (persons.some(person => person.name === newPerson.name)) {
            throw new Error('Name must be unique')
        }
        persons = persons.concat(newPerson)
        response.json(newPerson)
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage = ' Error: ' + error.message;
        }
        response.status(400).send(errorMessage);
    }
}) */

/* app.get('/info', (_request, response) => {
    const info =
        `
            <p>The phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>
        `
    response.send(info)
}) */

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const toNewPerson = (object: unknown): HydratedDocument<PersonType> => {
    if (isPerson(object)) {
        const newPerson: HydratedDocument<PersonType> = new Person({
            name: object.name,
            number: object.number,
        })
        return newPerson
    } else {
        throw new Error('Incorrect data')
    }
}

const isPerson = (object: unknown): object is PersonType => {
    if (!object || typeof object !== 'object') {
        return false
    }
    return (('name' in object && typeof object.name === 'string') &&
        ('number' in object && typeof object.number === 'string')
    )
}