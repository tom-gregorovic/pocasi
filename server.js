const express = require("express");

const app = express();

app.use(express.static('public'));
app.use('/api/clouds', require('./api/clouds'));
app.use('/api/snow', require('./api/snow'));
app.use('/api/cams', require('./api/cams'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));