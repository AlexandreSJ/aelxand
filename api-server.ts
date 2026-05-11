import { serve } from '@hono/node-server'
import app from './src/index'

const port = Number(process.env.PORT) || 3000

serve({ port, fetch: app.fetch }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`)
})
