var path = require('path');
var util = require('util');
var Source = require('../source');
var color_utils = require('../color_utils');
var net = require("http");
var queryString = require( "querystring" );
var url = require('url');

var NAME = path.basename(__filename, '.js'); // Our unique name

var port = 1338;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    console.log('hex ='+ hex);
    return result ? {
        0: parseInt(result[1], 16),
        1: parseInt(result[2], 16),
        2: parseInt(result[3], 16)
    } : null;
}


// This source loops through the color wheel continuously, producing
// a rainbow effect cycling through each pixel.
//
// options = {}, optional, valid keys:
//   period = number of milliseconds between steps
function J_saucy(grid, options)
{
  options = options || {};
  J_saucy.super_.call(this, NAME, grid, options);
  console.log("source object");
  console.log(this);
  console.log("------");
  
  var server = net.createServer(function(req, res){
  	res.writeHead(200, {"Content-Type":"text/plain"});

   	// parses the request url
    var theUrl = url.parse( req.url );

  	if (theUrl.query) {

  		var query_strings = queryString.parse(theUrl.query);

      var mode = 'pixel-xy';
  		var x, y, rgb;
  		if (query_strings && query_strings["x"]) { console.log("x is " + query_strings["x"]); x = query_strings["x"] }
  		if (query_strings && query_strings["y"]) {  y = query_strings["y"] }
  		if (query_strings && query_strings["rgb"]) { rgb = hexToRgb(query_strings["rgb"]) }
      if (query_strings && query_strings["mode"]) { mode = query_strings["mode"] }
  		
  		if (query_strings){
        if (mode == 'pixel-xy'){
          console.log('Setting pixel x='+x + 'y='+y + 'rgb=['+rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ']');
          grid.setPixelColor(x, y, rgb);
        }
        else if (mode == 'pixel-index'){
          //the index of the pixel is in x
          xy = this.grid.xy(x);
          console.log('Setting pixel x=' + )
        } 

        res.end(x + " " + y + " " + rgb);
      }
  	}
	
  });
  server.listen(port, function (err) {
    	console.log("J_saucy is listening on port %s", port);
  });
}

// Set up inheritance from Source
util.inherits(J_saucy, Source);

J_saucy.prototype.handleRequest = function(request, response){
	console.log(request);
	response.writeHead(200, {"Content-Type":"text/plain"});
};

J_saucy.prototype.step = function() {
  this.period = 1; 
 
  // We changed the grid
  return true;
};

// Since we don't have any additional options, copy default
J_saucy.options_spec = Source.options_spec;

// Export public interface
exports.constructor = J_saucy;
exports.name = NAME;
