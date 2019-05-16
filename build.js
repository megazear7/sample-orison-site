const path = require('path');
const proxy = require('express-http-proxy');
const { OrisonGenerator, OrisonServer, OrisonStaticServer } = require('orison');
require('dotenv').config();

if (process.argv.includes('build')) {
  new OrisonGenerator({ rootPath: process.cwd() }).build();
} else if (process.argv.includes('serve')) {
  const server = new OrisonServer({ rootPath: process.cwd() });
  server.app.use('/.netlify/functions/', proxy('http://localhost:9000/.netlify/functions/'));
  server.start();
} else if (process.argv.includes('static')) {
  new OrisonStaticServer({ rootPath: process.cwd() }).start();
}
