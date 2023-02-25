const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const { appendFile } = require('fs');

const app = express();
const port = 6969;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get("/", (req, res) => {
    res.render(__dirname + "/public/index.ejs");
})

app.listen(port, () => {
    console.log("Hello world");
})
