const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const db = new sqlite3.Database('./data/database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

app.use(session({
    secret: 'secretString',
    resave: false,
    saveUninitialized: false
}));

function isAuthenticated(req, res, next) {
    if (req.session.user) next()
    else res.redirect(`/login`);
};

//Routes
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.post('/signup', (req, res) => {
    try {
        var username = req.body.username;
        var password = req.body.password;
        if (!username || username === "" || !password || password === "") {
            throw new Error("Username or Password Missing")
        }
        if (password.length < 8) {
            throw new Error("Password Too Short")
        }
        db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, password], function (err) {
            try {
                if (err) {
                    console.log(err.message);
                    throw new Error("Database insertion error");
                }
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                req.session.user = username;
                db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, hashedPassword], (err, row) => {
                    if (err) {
                        throw err;
                    }
                    if (row) {
                        req.session.userID = row.uid;
                    } else {
                        console.log("Error: Row Not Found After Signup");
                        res.redirect('/');
                    }
                })
                res.redirect('/');
            } catch (error) {
                res.redirect('/signup');
            }
        });
    } catch (error) {
        res.redirect('/signup');
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
    const db = sqlite3.Database('database.sqlite');
    var petName = req.body.petName;
    var uID = req.session.userID;


    db.run('INSERT INTO pets (petName, uID) VALUES (?, ?)', [petName, uID], function (err) {
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