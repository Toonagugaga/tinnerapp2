import { Elysia, t } from "elysia"
import { Example } from "./controllers/example.controller"
import { swaggerConfig } from "./configs/swagger.configs"
import { tlsConfig } from "./configs/tls.config"
import { cors } from '@elysiajs/cors'
import { MongoDB } from "./configs/database.config"
import { jwtConfig } from "./configs/jwt.config"
import { AccountController } from "./controllers/account.controller"
import { UserController } from "./controllers/user.controller"
import staticPlugin from "@elysiajs/static"
import { PhotoController } from "./controllers/photo.controller"
import { LikeController } from "./controllers/like.controler"
import { ErrorController } from "./controllers/errorController"
import { MessageController } from "./controllers/message.controller"
MongoDB.connect()
const app = new Elysia()
  .use(ErrorController)
  .use(cors())
  .use(AccountController)
  .use(jwtConfig)
  .use(swaggerConfig)
  .use(LikeController)
  .use(MessageController)
  // .use(Example)
  .use(UserController)
  .use(staticPlugin({
    assets: "public/uploads",
    prefix: "img"
  }))
  .use(PhotoController)
  //   .listen({
  //     port: Bun.env.PORT || 8000,
  //     tls: tlsConfig
  //   })

  // console.log(
  //   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  // )
  .listen({
    port: Bun.env.PORT || 8000,
    tls: tlsConfig
  })

let protocol = 'http'
if ('cert' in tlsConfig)
  protocol = 'https'
console.log(`🦊 Elysia is running at ${protocol}://${app.server?.hostname}:${app.server?.port}`)


