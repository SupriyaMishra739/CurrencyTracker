const fetch = require("node-fetch");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const FIXER_API_KEY = "iyBcYsmR7u6SYUjgcHmfU6AVzdTE6ilm"; // ← Replace with your key

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Serve index.html
  if (pathname === "/" || pathname === "/index.html") {
    const file = fs.readFileSync("index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(file);

    // Serve style.css
  } else if (pathname === "/style.css") {
    const file = fs.readFileSync("style.css");
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(file);

    // Handle API request
  } else if (pathname === "/api") {
    const base = parsedUrl.searchParams.get("base") || "USD";
    try {
      const response = await fetch(
        `https://api.apilayer.com/fixer/latest?base=${base}`,
        {
          headers: { apikey: FIXER_API_KEY },
        }
      );
      const data = await response.json();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch data" }));
    }

    // 404 for other routes
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
