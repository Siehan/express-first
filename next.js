const express = require("express");
const fsPromises = require("fs/promises");
const app = express();

const path = require("path");
var { exec } = require("child_process");
const { ethers } = require("ethers");
const { wiki } = require("./wiki");

const LOG_FILE = "access-log.txt";

const IP_LOOPBACK = "localhost";
const IP_LOCAL = "192.168.1.10"; // my local ip on my network
const PORT = 3333;

require("dotenv").config();
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const provider = new ethers.providers.InfuraProvider("rinkeby", INFURA_PROJECT_ID);

// async file logger
const logger = async (req, res, next) => {
  try {
    const date = new Date();
    const log = `${date.toUTCString()} ${req.method} "${req.originalUrl}" from ${req.ip} ${
      req.headers["user-agent"]
    }\n`;
    await fsPromises.appendFile(LOG_FILE, log, "utf-8");
    next();
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`);
    res.status(500).send();
  }
};

// show on console
const shower = async (req, res, next) => {
  const date = new Date();
  const log = `${date.toUTCString()} ${req.method} "${req.originalUrl}" from ${req.ip} ${req.headers["user-agent"]}`;
  console.log(log);
  next();
};

app.use(logger);
app.use(shower);
app.use("/wiki", wiki);

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

app.get("/balance/:chainId/:address", async (req, res) => {
  const chainId = Number(req.params.chainId);
  const ethAddress = req.params.address;
  const provider = new ethers.providers.InfuraProvider(chainId);
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

// start the server
app.listen(PORT, IP_LOCAL, () => {
  console.log(`Example app listening at http://${IP_LOCAL}:${PORT}`);
});
