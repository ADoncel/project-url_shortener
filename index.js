require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;
const shortUrl = []

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.route('/api/shorturl/:shortId?').get((req, res) => {
  if (!req.params.shortId) res.send({ error: 'invalid param' })

  let id = parseInt(req.params.shortId);
  let obj = shortUrl.find((item) => item.id === id);
  console.log(obj);

  res.redirect(obj.url)

}).post((req, res) => {
  let url = new URL(req.body.url);
  let short = shortUrl.length + 1;

  dns.lookup(url.hostname, (err) => {
    if (err) res.send({ error: 'invalid url' })
    else {
      shortUrl.push({ id: short, url: req.body.url });

      res.json({
        original_url: req.body.url,
        short_url: short,
      });
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
