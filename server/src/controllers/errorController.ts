import { error } from "elysia"
import Elysia, { t } from "elysia"

export const ErrorController = new Elysia({
    prefix: '/api/error',
    tags: ['Error']
})
    .get('/:code', ({ params }) => {
        return error(params.code)
    }, {
        params: t.Object({ code: t.Number() }),
    })