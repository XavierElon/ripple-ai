import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rippleRoutes from './routes/rippleRoutes'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/ripple', rippleRoutes)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong!'
    }
  })
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
