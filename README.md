# Document Generation Service

This project is a backend service for generating PDF and DOCX documents from HTML input using Node.js and Express.

## 📦 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/pushkar-2804/doc-generator
   cd doc-generator
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run start
   ```

## 🚀 Features
- Generate PDF and DOCX files from HTML input
- Supports headers and footers
- Input validation using Joi
- Error handling for invalid requests
- **Watermark support for PDF**
- **Footer only on the last page for PDF**
- **DOCX always includes footer on all pages**

## 📌 Dependencies

### **Production Dependencies**
- `puppeteer`: Headless Chromium browser for rendering HTML to PDFs.
- `docx`: Library for generating DOCX documents.
- `express`: Web framework for handling API requests.
- `pdf-lib`: Library for creating and modifying PDF documents.
- `@types/jsdom`: Type definitions for JSDOM, used for parsing HTML content.
- `joi`: Schema validation library for request validation.


### **Development Dependencies**
- `@types/express`: Type definitions for Express.js.
- `@types/node`: Type definitions for Node.js.
- `typescript`: TypeScript compiler for type safety.

## 📡 API Endpoints
This service follows a versioned API structure to ensure backward compatibility.

### Current API Version: v1  

All endpoints are prefixed with /api/v1/.

### **POST /api/v1/doc/create-doc**
#### Request Body:
```json
{
  "contentHtml": "<p>Your document content</p>",
  "headerHtml": "<div style='text-align:center; font-size: 12px;'>My Company Header</div>",
   "footerHtml": "<div style='text-align:center; font-size: 12px;'>Page Footer - Confidential</div>",
    "documentType": "pdf",// or "docx",
    "watermark": "DRAFT"
}
```
#### Response:
- Returns the generated PDF or DOCX file as a downloadable attachment.

## 🛠 Error Handling
- Invalid document type will return a `400 Bad Request`.

## 🔍 Evaluation Criteria
### Correct handling of different scenarios:
#### ✅ PDF Generation Support:
- Content HTML
- Header HTML
- Footer HTML
- **Watermark Support** (Bonus Task)
- **Footer only on the last page** (Bonus Task)
#### ✅ DOCX Generation Support:
- Content HTML
- Header HTML
- Footer HTML (always on all pages)
#### ✅ Additional Considerations:
- Error handling and validation


## 🎥 Deliverables
- A working GitHub repository.
- Clear setup instructions.
- A demonstration video of the API in action.



---

[Screencast from 2025-03-27 01-30-00.webm](https://github.com/user-attachments/assets/e2b9a4e1-a6b5-431c-885e-d700de17b051)
