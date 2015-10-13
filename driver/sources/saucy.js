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


// This source listens on port 1338 
//
// options = {}, optional, valid keys:
// period = number of milliseconds between steps
function Saucy(grid, options)
{
  options = options || {};
  Saucy.super_.call(this, NAME, grid, options);
  console.log("source object");
  console.log(this);
  console.log("------");

  circles = [];
  
  var server = net.createServer(function(req, res){
    res.writeHead(200, {"Content-Type":"text/plain"});

    // parses the request url
    var theUrl = url.parse( req.url );

    if (theUrl.query) {

      var query_strings = queryString.parse(theUrl.query);

      var mode = 'pixel-xy';
      var x, y, rgb;
      var volume = 0;
      var return_string = '';
      if (query_strings && query_strings["x"]) {  x = query_strings["x"] }
      if (query_strings && query_strings["y"]) {  y = query_strings["y"] }
      if (query_strings && query_strings["rgb"]) { rgb = hexToRgb(query_strings["rgb"]) }
      if (query_strings && query_strings["mode"]) { mode = query_strings["mode"] }
      if (query_strings && query_strings["volume"]) { volume = query_strings["volume"] }

      if (query_strings){
        if (mode == 'pixel-xy'){

          var xy = grid.xy(x);
          console.log('Setting pixel x='+xy.x + 'y='+xy.y + 'rgb=['+rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ']');
          grid.setPixelColor(xy.x, xy.y, rgb);
          return_string = x + " " + y + " " + rgb;
        }
        else if (mode == 'pixel-index'){
          //the index of the pixel is in x
          //xy = grid.xy(x);
          //console.log('Setting pixel x=' + x);
        }
        else if (mode == 'volume'){

          circles.forEach(function(item){
            grid.setColor('0,0,0');
            grid.circleFill(item.x, item.y, item.v);
            item.v -= 1;
            if (item.v <= 0){
              console.log('removing cicle at  x=' + item.x + ' y=' + item.y);
              circles.splice(circles.indexOf(item));
            } else{
              grid.setColor('0,128,0');
              grid.circleFill(item.x, item.y, item.v);
            }
          });

          //the coords are stored as the pixel index in x
          var xy = grid.xy(x);
          if (volume > 5)
            volume = 5
          grid.setColor('0,128,0');
          console.log('creating new circle at x=' + xy.x + ' y=' + xy.y + ' r='+volume);
          grid.circleFill(xy.x, xy.y, volume);
          circles.push({
            'x': xy.x,
            'y': xy.y,
            'v': volume
          });
          //console.log('circle color pre ' + grid.foreColor);
          grid.setColor('0,128,0');
          grid.circleFill(0, 0, 10);

          return_string = xy.x + ' ' + xy.y + ' ' + volume;
        }

        res.end(return_string);
      }
    }
  
  });
  server.listen(port, function (err) {
      console.log("saucy is listening on port %s", port);
  });
}

// Set up inheritance from Source
util.inherits(Saucy, Source);

Saucy.prototype.handleRequest = function(request, response){
  response.writeHead(200, {"Content-Type":"text/plain"});
};

Saucy.prototype.step = function() {
  this.period = 1; 
 
  // We changed the grid
  return true;
};

// Since we don't have any additional options, copy default
Saucy.options_spec = Source.options_spec;

// Export public interface
exports.constructor = Saucy;
exports.name = NAME;
