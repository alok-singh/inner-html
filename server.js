const express = require('express');

const app = express();

app.use(express.static('htmls'));
app.listen(8000, (req, res) => {
    console.log(req);
});