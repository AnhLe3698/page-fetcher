'use strict';

// Command line arguments
let commandArgs = process.argv.slice(2);

const net = require('net');
const fs = require('fs');

let hostInfo;


const connect = function() {
  // Trimming host infro into a good format
  if (commandArgs[0].indexOf("http://www.") === 0) {
    hostInfo = commandArgs[0].trim();
    hostInfo = commandArgs[0].slice(11);
    if (hostInfo.indexOf("/") !== - 1) {
      hostInfo = hostInfo.slice(0, hostInfo.indexOf("/"));
    }
  } else {
    console.log("invalid link");
    return false;
  }
  
  let filePath = commandArgs[1];
  // Checking if the file path is valid.
  if (filePath.indexOf('./') !== 0) {
    console.log("invalid filepath");
    return false;
  }
  
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
    if (fs.existsSync(filePath)) {
      console.log("File already exists and will be overwritten");
    }
    fs.writeFile(filePath, data, err => {
      if (err) {
        console.error(err);
      }
      console.log(`Downloaded and saved ${data.length} bytes to ${filePath}`);
    });
    conn.end();
  });

  return conn;
};

connect();

// node fetcher.js http://www.google.com/ ./index.html
// node fetcher.js http://www.example.edu/ ./index.html

