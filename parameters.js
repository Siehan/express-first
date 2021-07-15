// import de express
const express = require("express");

// definition de notre app
const app = express();

const IP_LOOPBACK = "localhost";
const IP_LOCAL = "192.168.1.10"; // my local ip on my network
const PORT = 3333; //3000 le port d'écoute de notre serveur

// a route with parameters userId & BookId
// GET /users/11/books/13
app.get("/users/:userId/books/:bookId", (req, res) => {
  res.send(`Book with id ${req.params.bookId} for user with id ${req.params.userId}`);
});

//GET sur '/planet/:planetId'
app.get("/planet/:planetId", (req, res) => {
  const planetId = req.params.planetId;
  // lecture sur la base de données
  // const results = query vers un serveur sql
  // res.send(results);
  res.send(`Planet with id ${planetId} for client ${req.ip} not implemented yet`);
});

/*
Method GET
Response 200 OK
URL http://localhost:3333/planet/:planetId"
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 60
ETag: W/"3c-lojD4/QDyaRXalMIS63bxd41Iuo"
Date: Thu, 15 Jul 2021 11:22:16 GMT
Connection: keep-alive
Keep-Alive: timeout=5

1 Planet with id :planetId" for client ::1 not implemented yet
*/

// GET sur '/hello/:name'
app.get("/hello/:name", (req, res) => {
  const name = req.params.name;
  res.send(`Hello ${name}`);
});

/*
Method GET
URL http://localhost:3333/hello/:Sylvie
Response 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 13
ETag: W/"d-W//VRT+auDnZfsbclSgo+t81Tfs"
Date: Thu, 15 Jul 2021 11:33:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5
1 Hello :Sylvie
*/

// start the server
app.listen(PORT, IP_LOCAL, () => {
  console.log(`Example app listening at http://${IP_LOCAL}:${PORT}`);
});
