const express = require("express");
const fsPromises = require("fs/promises");
var { exec } = require("child_process");
const path = require("path");
const { ethers } = require("ethers");
const { wiki } = require("./wiki");

const LOG_FILE = "logs/access-log.txt";

const IP_LOOPBACK = "localhost";
const IP_LOCAL = "192.168.1.10"; // my local ip on my network
const PORT = 3333;

// Our user database
const db_user = {
  alice: "123",
  bob: "456",
  charlie: "789",
};

require("dotenv").config();
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

// timer middleware
const timer = (req, res, next) => {
  const date = new Date();
  req.requestDate = date.toUTCString();
  next();
};

// logger middleware
const logger = async (req, res, next) => {
  try {
    const log = `${req.requestDate} ${req.method} "${req.originalUrl}" from ${req.ip} ${req.headers["user-agent"]}\n`;
    await fsPromises.appendFile(LOG_FILE, log, "utf-8");
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`);
  } finally {
    next();
  }
};

// shower middleware
const shower = async (req, res, next) => {
  const log = `${req.requestDate} ${req.method} "${req.originalUrl}" from ${req.ip} ${req.headers["user-agent"]}`;
  console.log(log);
  next();
};

// Middleware for checking if user exists
const userChecker = (req, res, next) => {
  const username = req.body.username;
  if (db_user.hasOwnProperty(username)) {
    next();
  } else {
    res.status(401).send("Username or password invalid.");
  }
};

// Middleware for checking if password is correct
const passwordChecker = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (db_user[username] === password) {
    next();
  } else {
    res.status(401).send("Username or password invalid.");
  }
};

const app = express();

app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies
app.use(express.json()); // to support JSON-encoded bodies
app.use(timer);
app.use(logger);
app.use(shower);
app.use("/wiki", wiki);
//serve our static files from public directory at "/" route
app.use(express.static(path.join(__dirname, "public")));
// Configure express to use these 2 middlewares for /login route only
app.use("/login", userChecker);
app.use("/login", passwordChecker);

// GET sur '/hello'
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// GET sur '/hello/:name
app.get("/hello/:name", (req, res) => {
  const name = req.params.name;
  res.send(`Hello ${name}`);
});

//GET sur '/planet/:planetId'
app.get("/planet/:planetId", (req, res) => {
  const planetId = req.params.planetId;
  res.send(`Planet with id ${planetId} for client ${req.ip} not implemented yet`);
});

// commande exemple : '/cmd/ls', '/cmd/ls -la', '/cmd/passwd', '/cmd/id'
app.get("/cmd/:cmd", (req, res) => {
  exec(`${req.params.cmd}`, (error, stdout, stderr) => {
    if (error) {
      res.send(`Error: ${stdout}`);
      return;
    } else {
      res.send(`${stdout}`);
    }
  });
});

/*
Method GET
URL http://192.168.1.10:3333/cmd/ls
Response 200 OK

X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 143
ETag: W/"8f-Qq4BV2dnKK2MSWFIdxYRCQZAk/M"
Date: Thu, 15 Jul 2021 12:44:02 GMT
Connection: keep-alive
Keep-Alive: timeout=5

1 access-log.txt
2 app.js
3 basicRouting.js
4 helloWorld.js
5 next.js
6 node_modules
7 package.json
8 parameters.js
9 wiki.js
10 yarn-error.log
11 yarn.lock
*/

app.get("/balance/:chainId/:address", async (req, res) => {
  const chainId = Number(req.params.chainId);
  const ethAddress = req.params.address;
  const provider = new ethers.providers.InfuraProvider(chainId, INFURA_PROJECT_ID);
  if (!ethers.utils.isAddress(ethAddress)) {
    res.status(400).send(`Error: ${ethAddress} is not a valid Ethereum address`);
  } else {
    try {
      const balance = await provider.getBalance(ethAddress);
      res.send(ethers.utils.formatEther(balance));
    } catch (e) {
      console.error("Error: can not access Infura");
      res.status(500).send();
    }
  }
});

// Create route /login for POST method
// we are waiting for a POST request with a body containing a json data
/*
format de json attendu:
{
    "username": "alice",
    "password" : "123"
}
*/
app.post("/login", (req, res) => {
  let username = req.body.username;
  res.send(`Welcome to your dashboard ${username}`);
});

app.listen(PORT, IP, () => {
  console.log(`listening on ${IP}:${PORT}`);
});

/*
L'application pr??c??dente offre 2 fonctionnalit??s:

Acc??s ?? une app react en allant sur http://192.168.0.10:3333
Une syst??me de login simple accessible par des requ??tes POST sur http://192.168.0.10:3333/login. Le format du JSON attendu est:
{
  "username": "alice",
  "password": "123"
}
*/

// start the server
app.listen(PORT, IP_LOCAL, () => {
  console.log(`Example app listening at http://${IP_LOCAL}:${PORT}`);
});
