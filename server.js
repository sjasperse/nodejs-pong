var express = require('express');
var app = express();
var serverName = require('os').hostname();
var process = require('process');

function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function(){
    next();
  });
}

app.use(rawBody);

app.all('\*', async (req, res) => {
  var responseDelay = req.get('response-delay');
  if (responseDelay) {
    await new Promise((resolve, reject) => {
      setTimeout(resolve, parseInt(responseDelay));
    });
  }

  var response = '';

  response += req.method + ' ' + req.protocol + '://' + req.get('host') + req.originalUrl + '\n';

  for (var name in req.headers)
  {
    response += name + ': ' + req.headers[name] + '\n';
  }

  response += '\n\n' + req.rawBody;

  var status = 200;

  if (req.query.respondwithstatus) {
    status = parseInt(req.query.respondwithstatus);
  }

  res.status(status).send('<pre>Received by ' + serverName + '\n\n' + response + '</pre>');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

process.on('SIGTERM', function () {
  server.close(function () {
    process.exit(0);
  });
});
