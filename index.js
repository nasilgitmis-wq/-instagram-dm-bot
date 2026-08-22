const http = require("http");

const PORT = process.env.PORT || 10000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gaye123";

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Meta webhook doğrulaması
  if (req.method === "GET" && url.pathname === "/webhook") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook doğrulandı!");
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end(challenge);
    }

    res.writeHead(403);
    return res.end("Verification failed");
  }

  // Instagram'dan gelen veriler
  if (req.method === "POST" && url.pathname === "/webhook") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log("Instagram'dan gelen veri:", JSON.stringify(data, null, 2));
      } catch (error) {
        console.log("JSON hatası:", error.message);
      }

      res.writeHead(200);
      res.end("EVENT_RECEIVED");
    });

    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Instagram DM Bot is running!");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
