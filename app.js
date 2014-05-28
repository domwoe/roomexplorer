var express = require('express'),
    http = require('http'),
    app = express(),
    httpServer = http.createServer(app);


app.set('port', 7888);
app.use(express.static(__dirname));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
