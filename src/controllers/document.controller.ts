import { NextFunction, Request, Response } from 'express'
import DocumentService from '../services/document.service'

class DocumentController {
  async docCreationController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { contentHtml, headerHtml, footerHtml, documentType, watermark } =
        req.body
      const file = await DocumentService.docCreationService({
        contentHtml,
        headerHtml,
        footerHtml,
        documentType,
        watermark,
      })
      const fileName = documentType === 'pdf' ? 'new-doc.pdf' : 'new-doc.docx'
      const contentType =
        documentType === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filenam="${fileName}"`,
      })
      res.send(file)
    } catch (error) {
      next(error)
    }
  }
}

export default new DocumentController()
