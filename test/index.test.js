import request from 'supertest';
import nock from 'nock';
import { app, server } from '../index.js'; // Ensure the correct path to your index.js

describe('POST /generate-pdf', () => {
  afterAll(() => {
    server.close(); // Close the server after all tests
    nock.cleanAll(); // Ensure nock clean up
  });

  it('should return 404 if template URL is not found', async () => {
    nock('https://nonexistenturl.com')
      .get('/template.html')
      .reply(404);

    const response = await request(app)
      .post('/generate-pdf')
      .send({
        templateUrl: 'https://nonexistenturl.com/template.html',
        jsonData: {
          name: 'John Doe',
          date: '2024-07-24'
        }
      });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Template URL not found');
  });

  it('should return 500 if there is an error rendering the template', async () => {
    nock('https://example.com')
      .get('/template.html')
      .reply(200, '{{#invalid}}');

    const response = await request(app)
      .post('/generate-pdf')
      .send({
        templateUrl: 'https://example.com/template.html',
        jsonData: {
          name: 'John Doe',
          date: '2024-07-24'
        }
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error rendering template');
  });

  it('should successfully generate a PDF', async () => {
    nock('https://example.com')
      .get('/template.html')
      .reply(200, '<html><body><h1>{{name}}</h1><p>{{date}}</p></body></html>');

    const response = await request(app)
      .post('/generate-pdf')
      .send({
        templateUrl: 'https://example.com/template.html',
        jsonData: {
          name: 'John Doe',
          date: '2024-07-24'
        }
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.body).toBeInstanceOf(Buffer);
  });
});
