import mongoose from "mongoose"
import { user } from "../types/user.type"
import { _register } from "../types/register.type"
import { register } from "../types/account.type"

type userWithOutID = Omit<user, 'id'>

export interface IUserDocument extends mongoose.Document, userWithOutID {
    password_hash: string

    verifyPassword: (password: string) => Promise<boolean>
    toUser: () => user
}

export interface Iusermodel extends mongoose.Model<IUserDocument> {
    createUser: (registerData: register) => Promise<IUserDocument>
}