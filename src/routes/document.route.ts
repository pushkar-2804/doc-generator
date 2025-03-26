import express from 'express'
import DocumentController from '../controllers/document.controller'
import { validateRequest } from '../middlewares/validateReq.middleware'

const router = express.Router()

router.post(
  '/create-doc',
  validateRequest,
  DocumentController.docCreationController
)

export default router
