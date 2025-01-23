import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from "@hemilpatel/medium-common";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string,
        prisma: PrismaClient
    }
}>()

userRouter.post('/signup', async (c) => {
    const prisma = c.get('prisma')

    const body = await c.req.json()
    const { username, email, password } = body

    const validation = signupInput.safeParse(body)
    if (!validation.success) {
        c.status(409)
        return c.json({
            msg: `${validation.error.issues[0].path[0]
                } ${validation.error.issues[0].message.toLowerCase()}`,
        });
    }

    try {
        const emailExists = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (emailExists) throw new Error("An account with this email already exists. Please choose a different one.")

        const usernameExists = await prisma.user.findUnique({
            where: {
                username
            }
        });
        if (usernameExists) throw new Error("An account with this username already exists. Please choose a different one.")

        const user = await prisma.user.create({
            data: {
                username, email, password
            }
        })

        const token = await sign({ id: user.id }, c.env.JWT_SECRET)

        c.status(201)
        return c.json({
            msg: "Signed up successfully!",
            token
        })

    } catch (error: any) {
        c.status(400)
        return c.text(error)
    }


})

userRouter.post('/signin', async (c) => {
    const prisma = c.get('prisma')
    const body = await c.req.json()

    const validation = signinInput.safeParse(body)
    if (!validation.success) {
        c.status(409)
        return c.json({
            msg: `${validation.error.issues[0].path[0]
                } ${validation.error.issues[0].message.toLowerCase()}`,
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (user) {
            if (body.password !== user.password) throw new Error("Incorrect password.")

            const token = await sign(user, c.env.JWT_SECRET)

            c.status(200)
            return c.json({
                msg: "Logged in successfully!",
                token
            })
        }
        throw new Error('User not found.')

    } catch (error: any) {
        c.status(401)
        return c.json({
            msg: error.message
        })
    }
})


