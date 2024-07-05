import { BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';

export const validateCref = async (
  cref: string,
  type: 'natural' | 'juridical',
) => {

  const url =
    type === 'natural'
      ? 'https://www.confef.org.br/confefv2/registrados/'
      : 'https://www.confef.org.br/confefv2/registradospj/';

  const cref_includes = cref.replace('/', '%2F');

  const browser = await puppeteer.launch({
    headless: true, // Use headless mode for better performance in production
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necessary for some environments
  });

  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('#customSearchInput');

  const input = await page.$('#customSearchInput');
  await input.type(cref);

  // Capture API request and response
  const [response] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes(cref_includes) && response.status() === 200,
      { timeout: 120000 } // Adjust API response wait timeout
    ),
  ]);

  const data = await response.json();

  if (data.data.length === 0) {
    throw new BadRequestException({ message: 'CREF não encontrado' });
  }

  const normalized_data = type === 'juridical' ?
    {
      name: data.data[0][2],
      company: data.data[0][3],
      state: data.data[0][4],
      city: data.data[0][5],
      address: data.data[0][6],
      neighborhood: data.data[0][7],
      zip: data.data[0][8],
      phone: data.data[0][9],
    } : { // natural
      name: data.data[0][2],
      company: "",
      state: data.data[0][0],
      city: "",
      address: "",
      neighborhood: "",
      zip: "",
      phone: "",
    }

  await browser.close();

  return normalized_data;
};

// DEBUG
// page.on('request', (request) => {
//   if (
//     request
//       .url()
//       .includes(
//         'https://www.confef.org.br/confefv2/includes/api/registrados_pf/ssp.registrados.php',
//       )
//   ) {
//     console.log('Request:', request.url());
//     console.log('Method:', request.method());
//     console.log('Post Data:', request.postData());
//   }
// });
// END DEBUG

// RESPONSE
//{
//  draw: 12,
//  recordsTotal: 536894,
//  recordsFiltered: 1,
//  data: [
//    [
//      'PA',
//      'CREF 004775-G/PA',
//      'ADRIENY BERNARDO DE OLIVEIRA',
//      'CREF18/PA-AP',
//      'Graduado',
//      'LICENCIADO',
//      0,
//      'PA-004775'
//    ]
//  ]
//}
// END RESPONSE
