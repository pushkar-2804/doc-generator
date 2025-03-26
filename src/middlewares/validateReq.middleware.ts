import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { DocumentType } from '../types/document.type'

const schema = Joi.object({
  contentHtml: Joi.string().required(),
  headerHtml: Joi.string().required(),
  footerHtml: Joi.string().required(),
  documentType: Joi.string()
    .valid(...Object.values(DocumentType))
    .required(),
  watermark: Joi.string().optional(),
})

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message)
    res.status(400).json({ errors: errorMessages })
    return
  }
  next()
}
