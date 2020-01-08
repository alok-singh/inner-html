const express = require('express');
const port = 8080;
const app = express();

app.use(express.static('build'));
app.listen(port, (req, res) => {
    console.log(req);
});

console.log('server started at', port);