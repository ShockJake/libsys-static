const http = require('http');
const fs = require('fs')
const path = require('path')

const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
    if (req.url === ('/') || !req.url.includes('.')) {
        matchPage(req.url, res);
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

function matchPage(url, response) {
    
    if (url === '/') {
        const pagePath = path.join(__dirname, 'public', 'index.html')
        readPage('index', pagePath, response)
    } else {
        console.log('URL: ' + url)
        const pageName = url.substr(1)
        const pagePath = path.join(__dirname, 'public', 'pages/' + pageName + '.html')

        console.log('Page name - ' + pageName + ' matched path: ' + pagePath)
        readPage(pageName, pagePath, response)

    }
}

function readPage(pageName, pagePath,  response) {
    fs.readFile(pagePath, "UTF-8", (err, html) => {
        console.log('Reading page: ' + pageName);
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
    readPage('error_page', __dirname + '/public/pages/error_page.html', response)
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
