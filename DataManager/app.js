var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');	// cors 옵션 적용

var index = require('./routes/index');
var users = require('./routes/users');
var cats = require('./routes/cats');
var wazuhManager = require('./routes/wazuh/manager');
var wazuhRules = require('./routes/wazuh/rules');
var wazuhAgent = require('./routes/wazuh/agent');
var elastAlert = require('./routes/elastalert');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));  //__dirname 은 현재  app.js  가 위치한 path
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.set('view engine', 'ejs');
다음으로, 템플릿 엔진의 종류와 템플릿 파일의 위치를 정의한다 템플릿 파일의 위치를 path.join(__dirname, 'views') 로 정의 하였는데, __dirname은 현재 수행중인 파일의 위치 즉, app.js가 위치한 위치를 의미하며, path.join을 이용하면, ${현재디렉토리}/views 라는 경로로 지정한 것이다.

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//css 엔진의 종류를 stylus로 지정하고, 엔진이 렌더링할 static 파일들의 위치를 지정한다. 그리고, express에 static 파일의 위치를 지정한다. “./public” 디렉토리로 지정
*/

// 들어오는 http request body가 json 일때도 파싱할 수 있도록 지원한다.
//  app.use(express.json());

//이 밖에도, urlencoded request나 multipart request(파일 업로드)를 지원하려면 아래 부분을 추가하면 된다
//app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/', index);
app.use('/users', users);
app.use('/cats', cats);
app.use('/wazuh/manager', wazuhManager);
app.use('/wazuh/rules', wazuhRules);
app.use('/wazuh/agents', wazuhAgent);
app.use('/ea/', elastAlert);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
