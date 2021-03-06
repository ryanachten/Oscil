// Gzip and brotli config inspired by: https://lawrencewhiteside.com/writing/article/webpack-beyond-the-basics/optimizing-asset-files-with-compression

const express = require('express');
const expressStaticGzip = require("express-static-gzip");
const app = express();
const path = require('path');

const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

app.use(expressStaticGzip(publicPath, {
  enableBrotli: true
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up');
});
