var Server = require('karma').Server;

var server = new Server({
  configFile: __dirname + '/../karma.conf.js'
});

server.start();
