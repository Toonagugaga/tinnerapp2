import { connect } from "bun"
import mongoose from "mongoose"

const username = Bun.env.MONGO_DB_USERNAME || 'your-username'
const password = Bun.env.MONGO_DB_PASSWORD || 'your-password'
const db_name = Bun.env.MONGO_DBNAME || 'TinnerAPP'

const uri = `mongodb+srv://${username}:${password}@cluster0.phb4q.mongodb.net/?retryWrites=true&w=majority&appName=${db_name}`

export const MongoDB = {
    connect: async () => {     ///function() or =>
        try {
            await mongoose.connect(uri)
            console.log('-----MongoDB Conneted -----')
        } catch (error) {
            console.error('----- MongoDB Connetion error -----')
            console.error(error)
        }
    }
}