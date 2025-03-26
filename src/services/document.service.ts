import { DocumentCreationReq, DocumentType } from '../types/document.type'
import PDFCreator from '../utils/document/document-pdf.util'

class DocumentService {
  async docCreationService(documentData: DocumentCreationReq): Promise<Buffer> {
    if (documentData.documentType === DocumentType.PDF) {
      return PDFCreator.create(documentData)
    }
    throw new Error('Invalid document type')
  }
}

export default new DocumentService()
