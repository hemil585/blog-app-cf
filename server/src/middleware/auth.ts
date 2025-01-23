import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
    const authorizationHeader = c.req.header('Authorization') || ""
    const token = authorizationHeader.split(' ')[1]

    if (!authorizationHeader) {
        c.status(403)
        return c.json({
            error: "Unauthorized."
        })
    }

    try {
        const user = await verify(token, c.env.JWT_SECRET)
        if (user) {
            c.set('userId', user.id)
            await next()
        }
    } catch (e) {
        c.status(403)
        return c.json({
            error: "token is invalid or has expired. Please log in again"
        })
    }

}