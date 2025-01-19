import { Photo } from "./photo"

export interface User {
    id?: string,
    display_name?: string,
    username?: string,
    created_at?: Date,
    updated_at?: Date,
    last_active?: Date,
    introduction?: string,
    interest?: string,
    looking_for?: string,
    location?: string,
    gender?: string,
    age?: string,
    avatar?: string,
    photos?: Photo[]
    photoOftheDay?: string

    //like feature
    followers: User[] | string[],
    following: User[] | string[],
}
