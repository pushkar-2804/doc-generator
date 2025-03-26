import { DocumentCreationReq } from '../../types/document.type'
import puppeteer from 'puppeteer'

class PDFCreator {
  async create({
    contentHtml,
    headerHtml,
    footerHtml,
    documentType,
    watermark,
  }: DocumentCreationReq): Promise<Buffer> {
    const HTML = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; }
          header { text-align: center; position: fixed; top: 0; width: 100%; padding: 10px; }
          footer { text-align: center; position: fixed; bottom: 0; width: 100%; padding: 10px; }
          main { margin-top: 100px; margin-bottom: 100px; }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.15;
            font-size: 50px;
            z-index: -1;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <header>${headerHtml}</header>
        ${watermark ? `<div class="watermark">${watermark}</div>` : ''}
        <main>${contentHtml}</main>
        <footer>${footerHtml}</footer>
      </body>
      </html>
    `

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these flags
    })
    const page = await browser.newPage()
    await page.setContent(HTML, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      printBackground: true,
      format: 'A4',
      margin: { top: '100px', bottom: '100px', left: '100px', right: '100px' },
    })
    browser.close()
    return Buffer.from(pdf)
  }
}

export default new PDFCreator()
