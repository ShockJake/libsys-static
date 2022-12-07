const http = require('http');
const fs = require('fs')
const path = require('path')

const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
    if (req.url === '/') {
        readPage('./public/index.html', res);
    } else if (req.url.endsWith('.html')) {
        const pagePath = path.join(__dirname, 'public', req.url)
        readPage(pagePath, res);
    } else if (req.url.match("\.css$")) {
        const cssPath = path.join(__dirname, 'public', req.url);
        const fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);

    } else if (req.url.match("\.png$")) {
        const imagePath = path.join(__dirname, 'public', req.url);
        const fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    } else if (req.url.match("\.svg$")) {
        const svgPath = path.join(__dirname, 'public', req.url);
        const fileStream = fs.createReadStream(svgPath);
        res.writeHead(200, {"Content-Type": "image/svg+xml"})
        fileStream.pipe(res)
    } else if (req.url.match("\.jpg$")) {
        const jpgPath = path.join(__dirname, 'public', req.url);
        const fileStream = fs.createReadStream(jpgPath);
        res.writeHead(200, {"Content-Type": "image/jpeg"})
        fileStream.pipe(res)
    } else {
        badResponse(res)
    }
});

function readPage(page_name, response) {
    fs.readFile(page_name, "UTF-8", (err, html) => {
        console.log('Reading page: ' + page_name);
        if (err) {
            console.error(err)
            badResponse(response)
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(html);
        }
    });
}

function badResponse(response) {
    response.writeHead(404, {"Content-Type": "text/html"});
    response.end("Something went wrong");
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});