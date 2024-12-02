import express from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import bodyParser from 'body-parser';
import mustache from 'mustache';
import cors from 'cors'; // Import the cors middleware

const app = express();
const port = 3111;

app.use(cors()); // Use the cors middleware
app.use(bodyParser.json());

app.post('/generate-pdf', async (req, res) => {
  const { templateUrl, jsonData } = req.body;

  try {
    // Check if the template URL exists
    const response = await axios.get(templateUrl);
    const htmlTemplate = response.data;

    // Render the HTML with Mustache
    let renderedHtml;
    try {
      renderedHtml = mustache.render(htmlTemplate, jsonData);
    } catch (renderError) {
      console.error('Error rendering template:', renderError);
      return res.status(500).send('Error rendering template');
    }

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(renderedHtml);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true, // Enable headers and footers
      headerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; padding: 10px;">
          
        </div>`, // Customize your header content here
      footerTemplate: `
        <div style="font-size: 12px; text-align: right; width: 100%; padding: 10px; font-size: 10px;">
          <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`, // This will display page numbers
      margin: {
        top: '20px', // Adjust margin for header
        bottom: '70px', // Adjust margin for footer
        left: '20px',
        right: '20px',
      },
    });

    await browser.close();

    // Send PDF as response
    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (error.response && error.response.status === 404) {
      res.status(404).send('Template URL not found');
    } else {
      res.status(500).send('Error generating PDF');
    }
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app, server };
