var express = require('express');
var app = express();
var editJsonFile = require("edit-json-file");
var bodyParser = require('body-parser')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var files = {}
var historyFiles = {}
function filesByName(name) {
  if (!files[name]) {
    files[name] = editJsonFile(`${__dirname}/data/${name}.json`, {
      autosave: true
    });
  }
  return files[name]
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
 
app.get('/:db/:path', function(req, res) {
  console.log('get: ' + req.path)
  const file = filesByName(req.params.db)
  const val = file.get(req.params.path)
  res.send(val);
  console.log(val)
});

app.put('/:db/:path', function(req, res) {
  console.log('set: ' + req.path)
  console.log(req.body.data)
  const file = filesByName(req.params.db)
  file.set(req.params.path, req.body.data)
  res.send('done');
});

app.delete('/:db/unset/:path', function(req, res) {
  console.log('unset: ' + req.path)
  const file = filesByName(req.params.db)
  file.unset(req.params.path)
  res.send('done');
});

var port = 8000

app.listen(port);

console.log('Listening on http://localhost:' + port)
