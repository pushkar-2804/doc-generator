import express, { Request, Response } from 'express'
import errorHandler from './src/middlewares/errorHandler.middleware'

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(errorHandler)
app.get('/', (req: Request, res: Response) => {
  res.send('Hello mili from doc generator')
})
app.listen(PORT, () => {
  console.log('Server started on port', PORT)
})
