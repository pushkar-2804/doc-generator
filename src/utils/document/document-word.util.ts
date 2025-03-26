import { Document, Packer, Paragraph, Header, Footer, TextRun } from 'docx'
import {
  DocumentCreationReq,
  ExtractedElement,
} from '../../types/document.type'
import puppeteer from 'puppeteer'
import { PageSizes } from 'pdf-lib'

class DocxCreator {
  async create({
    contentHtml,
    headerHtml,
    footerHtml,
  }: DocumentCreationReq): Promise<Buffer> {
    // Convert HTML content with styling
    const contentParagraphs = await this.createDocxFromHtml(contentHtml)
    const headerContent = await this.createDocxFromHtml(headerHtml)
    const footerContent = await this.createDocxFromHtml(footerHtml)

    // Create document sections
    const sections: any[] = [
      {
        headers: {
          default: new Header({
            children: headerContent,
          }),
        },
        children: contentParagraphs,
        footers: {
          default: new Footer({ children: footerContent }),
        },
      },
    ]

    // Set A4 page size
    const doc = new Document({
      sections: sections.map((section) => ({
        ...section,
        page: {
          size: {
            width: PageSizes.A4,
            height: PageSizes.A4,
          },
        },
      })),
    })

    return Packer.toBuffer(doc)
  }

  private parseColor(color: string | null): string | undefined {
    if (!color) return undefined
    const match = color.match(/\d+/g)
    return match
      ? `#${match.map((x) => Number(x).toString(16).padStart(2, '0')).join('')}`
      : undefined
  }

  private parseAlignment(
    textAlign: string
  ): 'left' | 'center' | 'right' | 'justify' | undefined {
    switch (textAlign) {
      case 'start':
      case 'left':
        return 'left'
      case 'center':
        return 'center'
      case 'end':
      case 'right':
        return 'right'
      case 'justify':
      case 'justify-all':
        return 'justify'
      default:
        return 'left' // Fallback alignment
    }
  }

  async createDocxFromHtml(html: string): Promise<Paragraph[]> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'load' })

    // Extract styles dynamically using Puppeteer
    const extractedData: ExtractedElement[] = await page.evaluate(() => {
      const elements = document.body.children
      const content = []

      for (const element of elements) {
        const styles = window.getComputedStyle(element)
        content.push({
          text: element.textContent,
          bold:
            styles.fontWeight === 'bold' || parseInt(styles.fontWeight) >= 700,
          italics: styles.fontStyle === 'italic',
          color: styles.color,
          fontSize: parseFloat(styles.fontSize) * 2, // Convert px to half-points
          fontFamily: styles.fontFamily,
          textAlign: styles.textAlign,
          tag: element.tagName.toLowerCase(),
        })
      }
      return content
    })

    await browser.close()

    // Convert extracted data into DOCX format
    const paragraphs = extractedData.map((data) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: data.text ?? '',
            bold: data.bold,
            italics: data.italics,
            color: this.parseColor(data.color),
            size: data.fontSize,
            font: data.fontFamily,
          }),
        ],
        alignment:
          this.parseAlignment(data.textAlign) === 'justify'
            ? 'both'
            : (this.parseAlignment(data.textAlign) as
                | 'start'
                | 'center'
                | 'end'
                | 'both'
                | 'mediumKashida'
                | 'distribute'
                | 'numTab'
                | 'highKashida'
                | 'lowKashida'
                | 'thaiDistribute'
                | 'left'
                | 'right'
                | undefined),
      })
    })

    return paragraphs
  }
}

export default new DocxCreator()
