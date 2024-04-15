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
    const newPerson = toNewPerson(request.body)
    if (!newPerson) {
        response.status(400).end()
        return
    }

    newPerson.save()
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            response.status(400).send(error)
        })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const toNewPerson = (object: unknown): HydratedDocument<PersonType> | undefined => {
    if (isPerson(object)) {
        const newPerson: HydratedDocument<PersonType> = new Person({
            name: object.name,
            number: object.number,
        })
        return newPerson
    } else {
        return undefined
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