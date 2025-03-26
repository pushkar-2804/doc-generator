export enum DocumentType {
  PDF = 'pdf',
  DOCX = 'docx',
}
export interface DocumentCreationReq {
  contentHtml: string
  headerHtml: string
  footerHtml: string
  documentType: DocumentType
  watermark?: string
}
