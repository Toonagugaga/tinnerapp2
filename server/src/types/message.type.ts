import Elysia, { Static, t } from "elysia"
import { _pagination, CreatePagination } from "./pagination.type"

const _message = t.Object({
    id: t.Optional(t.String()),
    sender: t.String(),
    recipient: t.String(),
    content: t.String(),
    created_at: t.Optional(t.Date()),
    read_at: t.Optional(t.Date()),
    sender_delete: t.Optional(t.Boolean()),
    recipient_delete: t.Optional(t.Boolean()),
})

export const _messagePaginator = CreatePagination(_message, _pagination)
export type MessagePaginator = Static<typeof _messagePaginator>
export type message = Static<typeof _message>

export const MessageDto = new Elysia().model({
    pagination: t.Optional(_pagination),

    message: _messagePaginator
})