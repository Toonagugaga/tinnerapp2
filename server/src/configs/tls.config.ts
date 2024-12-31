declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string
            MONGO_DBNAME: string
            MONGO_DB_PASSWORD: string
            MONGO_DB_USERNAME: string
            PORT: string
            MODE: string
        }
    }
}

import { file } from "bun"

let _tls = {}
const mode = Bun.env.MODE || `production`

if (mode !== `production`) {
    const cert = file("../ssl/localhost.pem")
    const key = file("../ssl/localhost-key.pem")
    _tls = { cert, key }
}

export const tlsConfig = { ..._tls }
