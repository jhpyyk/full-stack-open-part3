import express from "express"

const app = express()
app.use(express.json())

const PORT = 3001

const persons = [
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