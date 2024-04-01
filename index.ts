import express from "express"
import cors = require("cors")
import { PersonType } from "./types"

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3001

let persons: PersonType[] = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    },
]

app.get('/api/persons', (_request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
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
})

app.post('/api/persons', (request, response) => {
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
})

app.get('/info', (_request, response) => {
    const info =
        `
            <p>The phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>
        `
    response.send(info)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const generateId = (): string => {
    const id = Math.floor(Math.random() * 10000000)
    return id.toString()
}

const toNewPerson = (object: unknown): PersonType => {
    if (isPersonWithoutId(object)) {
        const newPerson = {
            name: object.name,
            number: object.number,
            id: generateId()
        }
        return newPerson
    } else {
        throw new Error('Incorrect data')
    }
}

const isPersonWithoutId = (object: unknown): object is Omit<PersonType, 'id'> => {
    if (!object || typeof object !== 'object') {
        return false
    }
    return (('name' in object && typeof object.name === 'string') &&
        ('number' in object && typeof object.number === 'string')
    )
}