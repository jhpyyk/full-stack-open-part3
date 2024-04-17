import mongoose from 'mongoose'
import { PersonType } from '../types'
import dotenv from "dotenv"

dotenv.config()

const url = process.env.MONGODB_URI
if (!url) {
    throw new Error('MONGODB_URI not found')
}

console.log('connecting to', url)
mongoose.connect(url)
    .then(_result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const numberValidator = (num: string) => {
    return /^\d{2,3}-\d{6,7}$/.test(num)
}

const personSchema = new mongoose.Schema<Omit<PersonType, 'id'>>({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    number: {
        type: String,
        required: true,
        validate: { validator: numberValidator }
    },
})

personSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_document, returnedObject) => {
        delete returnedObject._id
    }
})



const Person = mongoose.model<Omit<PersonType, 'id'>>('Person', personSchema)

export default Person