import express from "express"

const app = express()
app.use(express.json())

const PORT = 3001

let persons = [
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
    if (!persons.some(person => person.id === request.params.id)) {
        response.status(404).end()
        return
    }

    persons = persons.filter(person => person.id !== request.params.id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    person.id = generateId()
    persons = persons.concat(person)
    response.json(person)
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