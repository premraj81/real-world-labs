const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 4191;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const redirects = {
  "/Contact.html": "/contact.html",
  "/Services.html": "/services.html",
  "/About.html": "/about.html",
  "/References.html": "/references.html",
  "/Disinfectant.html": "/disinfectants.html",
  "/Long-Term-Active-Biocides.html": "/biocides.html",
  "/Biocide.html": "/biocides.html",
  "/Biocides.html": "/biocides.html",
  "/We-Work-For.html": "/clients.html",
};

http
  .createServer((req, res) => {
    let requestPath = decodeURIComponent(req.url.split("?")[0]);
    if (requestPath === "/") requestPath = "/index.html";
    if (redirects[requestPath]) {
      res.writeHead(301, { Location: redirects[requestPath] });
      res.end();
      return;
    }

    const filePath = path.normalize(path.join(root, requestPath));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1");
