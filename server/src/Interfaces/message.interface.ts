import mongoose from "mongoose"
import { message } from "../types/message.type"

type messageWithOutID = Omit<message, 'id' | 'sender' | 'recipient'>

export interface IMessageDocument extends mongoose.Document, messageWithOutID {
    sender: mongoose.Types.ObjectId
    recipient: mongoose.Types.ObjectId
    created_at?: Date
    toMessage: () => message
}

export interface IMessageModel extends mongoose.Model<IMessageDocument> {

}