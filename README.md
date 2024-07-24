# PDF Generator

A simple Node.js API to generate PDFs from HTML templates using Puppeteer and Mustache. This project is containerized using Docker and can be easily set up and run locally.

## Prerequisites

- Docker
- Docker Compose
- Node.js and npm (if running outside Docker)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pdf-generator.git
cd pdf-generator
```
### 2. Run Tests

To run the tests, ensure you have all dependencies installed and execute:

```bash
npm install
npm test
```
### 3.  Build and Run with Docker Compose

To build and run the application using Docker Compose, execute:

```bash
docker-compose up --build
```

### 4.  API Usage
Endpoint: POST /generate-pdf
This endpoint generates a PDF from an HTML template URL and JSON data.

Request
- URL: /generate-pdf
- Method: POST
- Headers: Content-Type: application/json
- Body:
```json
{
  "templateUrl": "https://example.com/template.html",
  "jsonData": {
    "name": "John Doe",
    "date": "2024-07-24"
  }
}
```
- Response
- - Content-Type: application/pdf
- - Body: PDF binary data

- Example: You can use curl to test the endpoint:

```bash
curl -X POST http://localhost:3000/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
        "templateUrl": "https://example.com/template.html",
        "jsonData": {
          "name": "John Doe",
          "date": "2024-07-24"
        }
      }' --output result.pdf
```

### 4.Notes
- Ensure the template URL provided is accessible and returns valid HTML.
- Modify the JSON data according to the placeholders in your HTML template.
- The application uses Puppeteer to render the HTML and generate the PDF, which might require additional dependencies when running in different environments.
