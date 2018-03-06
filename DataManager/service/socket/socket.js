var cfg = require('../../conf/config.json');
var app = require('http').createServer(handler)
var io = require('socket.io').listen(app)
var fs = require('fs')


app.listen(cfg.listenPort);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
      if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
  });
}

// socke.io를 활성화 하고 외부 클라이언트의 접속 을 기다린다.
io.sockets.on('connection', function (socket) {
  
  // 접속한 대상에게 Data(Json 형태의 { hello: 'world'})를 전송한다.
  socket.emit('news', { hello: 'world' });  
  
  // 명령 혹은 data를 받기 위해 대기한다. 
  // 'my other event'라는 데이터를 받게되면 함수내용을 수행한다.
  socket.on('my other event', function (data) {
      console.log(data);
  });
});




