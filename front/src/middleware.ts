import { signIn } from "next-auth/react"

export {default} from "next-auth/middleware"

export const config = {
    pages : {
        signIn : '/login'
    },
    matcher : [
        '/((?!login|register|home|mail-verification).*)'
    ]
}