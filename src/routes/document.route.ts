import express from 'express'
import DocumentController from '../controllers/document.controller'
const router = express.Router()

router.post('/create-doc', DocumentController.docCreationController)

export default router
