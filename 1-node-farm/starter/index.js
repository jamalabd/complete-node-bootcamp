const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules.js/replaceTemplate');

///////////////////////////////////////////////////////////////////////////
///////// FILES

// blocking synchronous whay
// const text = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(text);
//
// const textOut = `This is what we know about avocados: ${text}. \nCreated on: ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File has been written');

// non-blocking synchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//   console.log(data);
// })
//
// console.log('Will read file')

///////////////////////////////////////////////////////////////////////////
///////// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT__CARDS%}', cardsHtml);
    // console.log(cardsHtml);

    res.end(output);

    // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    console.log(query['id']);
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API Page
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // ERROR Page
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
    });
    res.end('<h1>Page Note found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening on port 8000');
});
