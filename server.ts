import express, { Request, Response } from 'express'
import errorHandler from './src/middlewares/errorHandler.middleware'
import DocRouter from './src/routes/document.route'

const app = express()
const PORT = process.env.PORT || 8000
const prefix = '/api'
const version1 = '/v1'

app.use(express.json())
app.use(errorHandler)

app.use(`${prefix}${version1}/doc`, DocRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello mili from doc generator')
})
app.listen(PORT, () => {
  console.log('Server started on port', PORT)
})
