import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { pingRouter } from './routes/ping'
import { counterRouter } from './routes/counter'

const app = new Hono().basePath('/api')

app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.route('/', pingRouter)
app.route('/', counterRouter)

export default app
