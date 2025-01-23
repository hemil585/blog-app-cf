import { Hono } from 'hono'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '@prisma/client/edge'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { authMiddleware } from './middleware/auth'
import { JWTPayload } from 'hono/utils/jwt/types'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  },
  Variables: {
    prisma: JWTPayload
  }
}>()

app.use('/*', cors())
app.use('*', async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  c.set('prisma', prisma)
  await next()
})
app.use('/api/v1/blog/*', authMiddleware)

app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app