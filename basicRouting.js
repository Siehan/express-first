// import de express
const express = require("express");

// definition de notre app
const app = express();

const IP_LOOPBACK = "localhost";
const IP_LOCAL = "192.168.1.10"; // my local ip on my network
const PORT = 3333; //3000 le port d'écoute de notre serveur

// GET sur la racine
app.get("/", (req, res) => {
  //nous recupérons l'ip source de la requête
  res.send(`Welcome ${req.ip} to my first express app.`);
});

// POST sur la racine
app.post("/", (req, res) => {
  res.send("Sorry we don't post requests yet.");
});

// GET sur '/hello'
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// http://192.168.1.10:3333/hello = Hello World!

// GET sur '/hello/sofiane'
app.get("/hello/sofiane", (req, res) => {
  res.send("Hello Sofiane!");
}); // http://192.168.1.10:3333/hello/sofiane = Hello Sofiane!

// GET sur '/hello/franck'
app.get("/hello/franck", (req, res) => {
  res.send("Hello Franck!");
}); // http://192.168.1.10:3333/hello/franck = Hello Franck!

// advanced path handling
// string patterns
// On peut aussi utiliser des string patterns pour le path de notre route:

// route path match acd and abcd
app.get("/ab?cd", (req, res) => {
  res.send("ab?cd");
}); //192.168.1.10:3333/abcd =  Response = ab?cd

// route path match abcd, abbcd, abbbcd, and so on.
http: app.get("/ab+cd", (req, res) => {
  res.send("ab+cd");
}); // http://192.168.1.10:3333/abbbcd =  Response = 1 ab+cd

// route path will match abcd, abxcd, abRANDOMcd, ab123cd,
// and so on.
app.get("/ab*cd", (req, res) => {
  res.send("ab*cd");
}); // http://192.168.1.10:3333/abRANDOMcd = Response = 1 ab*cd

// This route path will match /abe and /abcde.
app.get("/ab(cd)?e", (req, res) => {
  res.send("ab(cd)?e");
}); // http://192.168.1.10:3333/abcde = Response = 1 ab(cd)?e

// This route path will match anything with an “a” in it.
app.get(/a/, (req, res) => {
  res.send("/a/");
}); // http://192.168.1.10:3333/a = Response = 1 /a/

// This route path will match butterfly and dragonfly,
// but not butterflyman, dragonflyman, and so on.
app.get(/.*fly$/, (req, res) => {
  res.send("/.*fly$/");
}); // http://192.168.1.10:3333/butterfly = Response = /.*fly$/
// http://192.168.1.10:3333/dragonfly = Response = /a/ dragonfly NE FONCTIONNE PAS

// start the server
app.listen(PORT, IP_LOCAL, () => {
  console.log(`Example app listening at http://${IP_LOCAL}:${PORT}`);
});

/*
Method : GET
URL : http://192.168.1.10:3333
Response 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 45
ETag: W/"2d-Os7YU5aQI9CoeF1OFWZBZT9fC3c"
Date: Thu, 15 Jul 2021 08:38:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

1 Welcome 192.168.1.10 to my first express app.


Method : POST
URL : http://192.168.1.10:3333
Response 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 33
ETag: W/"21-gIJQXDEdYuRo9ZL9ZNwjfEh6TJQ"
Date: Thu, 15 Jul 2021 08:41:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5

1 Sorry we don't post requests yet.
*/
