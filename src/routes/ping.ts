import { Hono } from 'hono'

export const pingRouter = new Hono()

pingRouter.get('/ping', (c) => {
  return c.json({ message: 'pong' })
})
