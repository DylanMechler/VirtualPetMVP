const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//add content here

app.listen(3000, () => {
    console.log("Started HTTP Server on port 3000");
});