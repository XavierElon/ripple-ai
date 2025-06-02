import { Router, Request, Response } from 'express'
import { RippleController } from '../controllers/rippleController'

const router = Router()
const rippleController = new RippleController()

// Generate a new test wallet
router.post('/wallet/generate', (req: Request, res: Response) => rippleController.generateWallet(req, res))

// Fund a test wallet
router.post('/wallet/:address/fund', (req: Request, res: Response) => rippleController.fundWallet(req, res))

// Get wallet information
router.get('/wallet/:address', (req: Request, res: Response) => rippleController.getWalletInfo(req, res))

// Get transaction history
router.get('/wallet/:address/transactions', (req: Request, res: Response) => rippleController.getTransactionHistory(req, res))

export default router
