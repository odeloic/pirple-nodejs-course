/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder
var config = require('./config')
 // Configure the server to respond to all requests with a string
var server = http.createServer(function(req,res){

  // Parse the url
  var parsedUrl = url.parse(req.url, true);
  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // get headers queryStringObject
  var headers = req.headers
  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the payload if any
  var decoder = new StringDecoder('utf-8')
  var buffer = ''
  req.on('data', function(data) {
    buffer += decoder.write(data)
  })

  req.on('end', function() {
    buffer += decoder.end()

    // choose the handler for this request
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    }
    // Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200
      payload = typeof(payload) == 'object' ? payload : {}

      // conver payload to a string
      var payloadString = JSON.stringify(payload)

      // Return the response to client
      res.setHeader('content-type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)

      // Log the request path
      console.log('Request received with this response: ', statusCode,payloadString)
    })
  })
});

// Start the server
server.listen(config.port,function(){
  console.log(`The server is listening on port ${config.port} in ${config.envName} mode`);
});


// Defining request handlers
var handlers = {};
handlers.sample = function(data, callback) {
  callback(406, {'name': 'Sample Handler'})
}

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404)
}

// Defining router
var router = {
  'sample': handlers.sample
}