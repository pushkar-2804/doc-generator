import { DocumentCreationReq } from '../../types/document.type'
import puppeteer from 'puppeteer'
import { PDFDocument } from 'pdf-lib'

class PDFCreator {
  async create({
    contentHtml,
    headerHtml,
    footerHtml,
    watermark,
  }: DocumentCreationReq): Promise<Buffer> {
    const HTML = `
      <html>
      <head>
        <style>
          @page { margin: 100px 50px; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: transparent; 
          }
          .watermark { 
            position: fixed; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%) rotate(-45deg); 
            opacity: 0.15; 
            font-size: 5rem; 
            z-index: -1; 
            pointer-events: none; 
          }
        </style>
      </head>
      <body>
        ${watermark ? `<div class="watermark">${watermark}</div>` : ''}
        <main>${contentHtml}</main>
      </body>
    </html>
    `

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(HTML, { waitUntil: 'load' })
    const pdfBuffer = await page.pdf({
      printBackground: true,
      format: 'A4',
      margin: { top: '100px', bottom: '100px', left: '50px', right: '50px' },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="
        width: 800px; height: 100px;
        margin: 0; padding: 0;
          display: flex; justify-content: center; align-items: center;
            font-size: 2rem; font-weight: bold; text-align: center;
            background-color: transparent;
        ">${headerHtml}</div>
      `,
      footerTemplate: `
        <div></div>
      `,
    })
    if (!footerHtml) {
      await browser.close()
      return Buffer.from(pdfBuffer)
    }

    const footerImageBuffer = await this.generateFooterImage(footerHtml)
    if (!footerImageBuffer) {
      return Buffer.from(pdfBuffer)
    }
    await browser.close()

    // Add footer on the last page using pdf-lib
    const modifiedPdfBuffer = await this.addFooterToLastPage(
      Buffer.from(pdfBuffer),
      footerImageBuffer
    )
    return modifiedPdfBuffer
  }

  private async generateFooterImage(footerHtml: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()

    const width = 800
    const height = 100
    await page.setViewport({ width, height })

    await page.setContent(`
      <html>
      <head>
        <style>
          body { 
            margin: 0; padding: 0; width: ${width}px; height: ${height}px;
            display: flex; justify-content: center; align-items: center;
            font-size: 2rem; font-weight: bold; text-align: center;
            background-color: transparent;
          }
        </style>
      </head>
      <body>${footerHtml}</body>
      </html>
    `)

    const element = await page.$('body')
    if (!element) throw new Error('Footer HTML was not properly processed')

    const footerImageBuffer = await element.screenshot({
      type: 'png',
      omitBackground: true,
    })

    await browser.close()
    return Buffer.from(footerImageBuffer)
  }

  private async addFooterToLastPage(
    pdfBuffer: Buffer,
    footerImageBuffer: Buffer
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const lastPage = pdfDoc.getPages().pop()

    if (lastPage) {
      const { width } = lastPage.getSize()
      const footerImage = await pdfDoc.embedPng(footerImageBuffer)

      const imageWidth = width * 0.9
      const aspectRatio = footerImage.width / footerImage.height
      const imageHeight = imageWidth / aspectRatio

      lastPage.drawImage(footerImage, {
        x: (width - imageWidth) / 2,
        y: 10,
        width: imageWidth,
        height: imageHeight,
      })
    }

    return Buffer.from(await pdfDoc.save())
  }
}

export default new PDFCreator()
