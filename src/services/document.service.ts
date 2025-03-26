import { DocumentCreationReq, DocumentType } from '../types/document.type'
import PDFCreator from '../utils/document/document-pdf.util'
import DocxCreator from '../utils/document/document-word.util'

class DocumentService {
  async docCreationService(documentData: DocumentCreationReq): Promise<Buffer> {
    if (documentData.documentType === DocumentType.PDF) {
      return PDFCreator.create(documentData)
    } else if (documentData.documentType === DocumentType.DOCX) {
      return DocxCreator.create(documentData)
    }
    throw new Error('Invalid document type')
  }
}

export default new DocumentService()
