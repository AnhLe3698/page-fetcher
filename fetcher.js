'use strict';

// Command line arguments
let commandArgs = process.argv.slice(2);

const net = require('net');
const fs = require('fs');

let hostInfo;

//Trimming host infro into a good format
if (commandArgs[0].indexOf("http://www.") === 0) {
  hostInfo = commandArgs[0].trim();
  hostInfo = commandArgs[0].slice(11);
  console.log(hostInfo);
  if (hostInfo.indexOf("/") !== - 1) {
    hostInfo = hostInfo.slice(0, hostInfo.indexOf("/"));
    console.log(hostInfo);
  }
}


let filePath = commandArgs[1];

const conn = net.createConnection({
  //host: 'example.edu',
  host: hostInfo,
  port: 80
});


conn.setEncoding('utf8');

conn.on('connect', () => {
  console.log(`Connected to server!`);
  // conn.write(`GET /index.html`);
  conn.write(`GET / HTTP/1.1\r\n`);
  conn.write(`Host: ${hostInfo}\r\n`);
  conn.write(`\r\n`);
});

//Writing the data into the filepath
conn.on('data', (data) => {
  console.log(data);
  fs.writeFile(filePath, data, err => {
    if (err) {
      console.error(err);
    }
    console.log("file written into successfully");
  });
  conn.end();
});
