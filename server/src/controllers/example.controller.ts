import Elysia, { t } from "elysia"

export const Example = new Elysia()
    .get("/home", () => "how wa", {
        detail: {
            tags: ["example"],
            summary: "get helllo world",
            description: "agu ga ga"
        }
    })
    .post("/about", ({ body }) => {
        return {

            id: 'xxx',
            massage: 'hello' + body.name
        }
    }, {
        body: t.Object({
            name: t.String()
        }), detail: {
            tags: ["example"],
            summary: "get hello world",
            description: "agu ga ga"
        }
    })