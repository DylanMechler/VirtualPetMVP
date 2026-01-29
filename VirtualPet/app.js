const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const app = express();

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
                db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
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

app.post('/login', (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password || username === "" || password === "") {
            throw new Error("Username or password missing");
        }
        db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
            if (err) {
                throw err;
            }
            if (row) {
                req.session.user = username;
                req.session.userID = row.uid;
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        })
    } catch (error) {
        res.redirect('/login');
    }
})

app.get('/adopt', isAuthenticated, (req, res) => {
    res.render('adopt.ejs');
});

app.post('/adopt', (req, res) => {
    var petName = req.body.petName;
    var uID = req.session.userID;

    db.run('INSERT INTO Pets (petName, uID, petHunger, petHappiness) VALUES (?, ?, ?, ?)', [petName, uID, 50, 50], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.redirect('/');
    });
});

app.get('/petView', isAuthenticated, (req, res) => {
    let userID = req.session.userID;
    let petName = "Pet";
    let petHunger = 50;
    db.get(`SELECT * FROM Pets WHERE uID = ?`, [userID], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            petName = row.petName;
            petHunger = row.petHunger;
            res.render('petView.ejs', { petName: petName, petHunger: petHunger });
        } else {
            res.redirect('/adopt');
        }
    })
});

app.post('/petView', (req, res) => {
    let userID = req.session.userID;
    const hunger = req.body.petHunger;
    db.run(`UPDATE Pets SET petHunger = ? WHERE uID = ?`, [hunger, userID], function (err) {
        if (err) {
            return console.error(err.message);
        } else {
            console.log("Hunger Saved");
        }
    });
});

app.listen(3000, () => {
    console.log("Started HTTP Server on port 3000");
});