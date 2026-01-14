const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//Routes
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('adopt.ejs', (req, res) => {
    res.render('adopt.ejs');
});

app.post('adopt.ejs', (req, res) => {
    const db = sqlite3.Database('database.sqlite');
    const { petName, petID, uID } = req.body;

    db.run('INSERT INTO pets (petName, petID, uID) VALUES (?, ?, ?)', [petName, petID, uID], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.redirect('/');
    });

    db.close();
});

app.get('petView.ejs', (req, res) => {
    res.render('petView.ejs');
});

app.listen(3000, () => {
    console.log("Started HTTP Server on port 3000");
});