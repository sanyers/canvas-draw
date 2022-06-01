var express = require('express'); //web框架
const history = require('connect-history-api-fallback');
var app = express();
app.use(history());
app.use('/canvas-draw', express.static('dist'));
app.use('/', express.static('dist'));
const config = {
  port: 8086,
};
app.listen(config.port);
console.log('http listening on ' + config.port);
