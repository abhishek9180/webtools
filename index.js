var express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const Terser = require("terser");
const CleanCSS = require('clean-css');
const beautify = require('beautify');
const minify = require('html-minifier')

const terserOption = require("./terser-option");
const cleancssOption = require("./cleancss-option");

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('content-type', 'application/json');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  // Pass to next layer of middleware
  next();
});

// API
app.post('/minify-js', (req, res) => {
  console.log(typeof(req.body.text_content))
  //Minify some code
  terserOption.options.output.beautify = false;
  result = Terser.minify(req.body.text_content+"", terserOption);
  if (result.error) {
    res.end(result.error);
  }
  res.end(result.code);
});

//TBD: Getting error
app.post('/minify-css', (req, res) => {
  //Minify some code
  new CleanCSS(cleancssOption.options).minify(req.body.text_content, function (error, output) {
    // `output` is the same as in the synchronous call above
    if (error) {
      res.end(error);
    }
    res.end(output);
  });
});

app.post('/minify-html', (req, res) => {
  console.log(req.body.text_content);
  //Minify some code
  minify.html(req.body.text_content, function (error, data) {
    if (error)
      return console.error(error.message);
    res.send(data);
  });

  res.send("Error");
});

app.post('/beautify-html', (req, res) => {
  console.log(req.body.text_content);
  //Minify some code
  data = beautify(req.body.text_content, { format: 'html' })
  res.send(data);
});

app.post('/beautify-css', (req, res) => {
  console.log(req.body.text_content);
  //Minify some code
  data = beautify(req.body.text_content, { format: 'css' })
  res.send(data);
});

app.post('/beautify-js', (req, res) => {
  console.log(req.body.text_content);
  //Minify some code
  /* data = beautify(req.body.text_content, {format: 'js'})
  res.send(data); */
  result = Terser.minify(req.body.text_content, terserOption.options);
  if (result.error) {
    res.end(result.error);
  }
  res.end(result.code);
});

app.get('*', function (req, res) {

  res.send("Not Found");
});

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app