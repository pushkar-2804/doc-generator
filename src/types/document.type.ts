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

export interface ExtractedElement {
  text: string | null
  bold: boolean
  italics: boolean
  color: string | null
  fontSize: number
  fontFamily: string
  textAlign: string
  tag: string
}
