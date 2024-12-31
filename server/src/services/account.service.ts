import { error } from "elysia"
import { User } from "../models/user.madel"
import { login, register } from "../types/account.type"
import { user } from "../types/user.type"
import { _register } from "../types/register.type"

export const Accountservices = {
    login: async function (loginData: login): Promise<user> {
        const user = await User.findOne({ username: loginData.username })
            .populate("photos")

            .populate({
                path: "following",
                select: "_id"
            })
            .populate({
                path: "followers",
                select: "_id"
            })

            .exec()
        if (!user)
            throw new Error("User does not exist")
        const verifyPassword = await user.verifyPassword(loginData.password)
        if (!verifyPassword)
            throw new Error("Password is incorrect")
        return user.toUser()
    },
    createNewUser: async function (registerData: register): Promise<user> {
        const user = await User.findOne({ username: registerData.username }).exec()
        if (user)
            throw new Error(`${registerData.username} already exists`)
        const newUser = await User.createUser(registerData)
        return newUser.toUser()
    }
}