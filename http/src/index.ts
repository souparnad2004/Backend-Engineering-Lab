import http from "node:http";
import type { ServerResponse } from "node:http";

const server = http.createServer((req, res: ServerResponse) => {
  console.log(req.url);
  console.log(req.method);

  console.log(req.headers);
  console.log(req.httpVersion);
  console.log(req.socket);

  res.setHeader("Content-Type", "text/plain");
  sendJSON(res, 200, {
    message: "Success",
  });
  res.end("Hello from node js server");
});

function sendJSON(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    "content-type": "application/json",
  });

  res.end(JSON.stringify(data));
}

async function readJSON(req, maxBytes = 1_000_000) {
  let size = 0;
  const chunks = [];

  for await (const chunk of req) {
    size += chunk.length;

    if (size > maxBytes) {
      const error = new Error("Request body too large");
      error.statusCode = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("Invalid JSON");
    error.statusCode = 400;
    throw error;
  }
}

server.listen(3000, () => {
  console.log("Server started on port 3000");
});

//Important Response Methods

// res.writeHead()
// res.setHeader()
// res.getHeader()
// res.removeHeader()

// res.write()
// res.end()

// res.flushHeaders()
// res.addTrailers()

/* 
Code Meaning

200	OK
201	Created
204	No Content
301	Moved Permanently
302	Found
304	Not Modified
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
405	Method Not Allowed
409	Conflict
413	Content Too Large
415	Unsupported Media Type
429	Too Many Requests
500	Internal Server Error
503	Service Unavailable
*/
