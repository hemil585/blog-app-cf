import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { createBlogInput, updateBlogInput } from "@hemilpatel/medium-common"
import { encodeBase64 } from "hono/utils/encode"

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string,
        prisma: PrismaClient
    }
}>()


blogRouter.post('/', async (c) => {
    const prisma = c.get('prisma')
    const userId = c.get('userId')
    const body = await c.req.formData()
    const parsedData: Record<string, any> = {}

    for (const key of body.keys()) {
        const match = key.match(/dataObj\[(.*?)\]/)
        if (match && match[1]) {
            const fieldName = match[1]
            parsedData[fieldName] = body.get(key)
        }
    }

    const title = parsedData.title as string
    const content = parsedData.content as string
    const image = parsedData.file as File

    const byteArrayBuffer = await image.arrayBuffer()
    const base64 = encodeBase64(byteArrayBuffer)

    const validation = createBlogInput.safeParse(parsedData)
    if (!validation.success) {
        c.status(409)
        return c.json({
            msg: `${validation.error.issues[0].path[0]
                } ${validation.error.issues[0].message.toLowerCase()}`,
        });
    }

    try {
        const post = await prisma.post.create({
            data: {
                title, content, authorId: userId, image: base64
            }
        })

        return c.json({
            postId: post.id
        })

    } catch (error: any) {
        c.status(400)
        return c.text(error)
    }
})

blogRouter.put('/', async (c) => {
    const prisma = c.get('prisma')
    const body = await c.req.json()
    const { title, content, id } = body

    const validation = updateBlogInput.safeParse(body)
    if (!validation.success) {
        c.status(409)
        return c.json({
            msg: `${validation.error.issues[0].path[0]
                } ${validation.error.issues[0].message.toLowerCase()}`,
        });
    }

    try {
        const post = await prisma.post.update({
            where: {
                id
            },
            data: {
                title, content
            }
        })

        c.status(200)
        return c.json({
            msg: "Updated",
            id: post.id
        })
    } catch (error: any) {
        c.status(400)
        return c.text(error);
    }
})

// pagination 
blogRouter.get('/bulk', async (c) => {
    const prisma = c.get('prisma')

    try {
        const posts = await prisma.post.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                image: true,
                author: {
                    select: {
                        username: true
                    }
                },
                createdAt: true
            }
        })
        c.status(200)
        return c.json(posts)
    } catch (error: any) {
        c.status(400)
        return c.text(error);
    }
})

blogRouter.get('/:id', async (c) => {
    const prisma = c.get('prisma')
    const id = c.req.param('id')

    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        })

        c.status(200)
        return c.json(post)
    } catch (error: any) {
        c.status(400)
        return c.text(error);
    }
})
