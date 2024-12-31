import mongoose from "mongoose"
import { User } from "../models/user.madel"
import { user, userPagination, userPaginator } from "../types/user.type"
import { QueryHelper } from "../helper/query.helper"

export const LikeService = {
    toggleLike: async function (user_id: string, targat_id: string): Promise<boolean> {
        const target = await User.findById(targat_id).select("_id").exec()
        if (!target)
            throw new Error("Invlid targat_id")

        const likeTarget = await User.findOne({
            _id: new mongoose.Types.ObjectId(user_id),
            following: { $elemMatch: { $eq: target._id } }
        }).exec()
        if (likeTarget) {
            await User.findByIdAndUpdate(user_id, { $pull: { following: targat_id } })
            await User.findByIdAndUpdate(targat_id, { $pull: { followers: user_id } })
        } else {
            await User.findByIdAndUpdate(user_id, { $addToSet: { following: targat_id } })
            await User.findByIdAndUpdate(targat_id, { $addToSet: { followers: user_id } })
        }
        return true
    },

    getFollowers: async function (user_id: string, pagination: userPagination): Promise<userPaginator> {
        const _query = User.findById(user_id)
            .populate({
                path: "followers",
                match: { $and: QueryHelper.parseUserQuery(pagination) },
                select: '_id username display_name photos introduction interest location gender date_of_birth',
                populate: { path: "photos" }
            })
        const [docs, total] = await Promise.all([
            _query.exec(),
            User.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(user_id) } },
                { $project: { total: { $size: { $ifNull: ["$followers", []] } } } }
            ])
        ])
        pagination.length = total[0].count
        let follower: user[] = []
        if (docs) {
            follower = docs.toUser()['followers'] as user[]
        }
        return {
            pagination: pagination,
            items: follower
        }
    },

    getFollowing: async function (user_id: string, pagination: userPagination): Promise<userPaginator> {
        const _query = User.findById(user_id)
            .populate({
                path: "following",
                match: { $and: QueryHelper.parseUserQuery(pagination) },
                select: '_id username display_name photos introduction interest location gender date_of_birth',
                populate: { path: "photos" }
            })
        const [docs, total] = await Promise.all([
            _query.exec(),
            User.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(user_id) } },
                { $project: { total: { $size: { $ifNull: ["$following", []] } } } }
            ])
        ])
        pagination.length = total[0].count
        let following: user[] = []
        if (docs) {
            // following = docs.following as user[]
            following = docs.toUser()['following'] as user[]
        }
        return {
            pagination: pagination,
            items: following
        }
    },

}