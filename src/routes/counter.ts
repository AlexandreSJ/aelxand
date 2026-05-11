import { Hono } from 'hono'

let counterValue = 0

export const counterRouter = new Hono()

counterRouter.get('/counter', (c) => {
  return c.json({ value: counterValue })
})

counterRouter.post('/counter/increment', (c) => {
  counterValue += 1
  return c.json({ value: counterValue, message: 'Incremented!' })
})
