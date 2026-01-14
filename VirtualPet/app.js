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

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.post('/signup', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || username === "" || !password || password === "") {
        throw new Error("Username or Password Missing")
    }
    if (password.length < 8) {
        throw new Error("Password Too Short")
    }
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('login', (req, res) => {
    //login logic here
})

app.get('adopt.ejs', (req, res) => {
    res.render('adopt.ejs');
});

app.post('adopt.ejs', (req, res) => {
});

app.get('petView.ejs', (req, res) => {
    res.render('petView.ejs');
});

app.listen(3000, () => {
    console.log("Started HTTP Server on port 3000");
});