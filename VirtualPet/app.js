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
    if (req.session.user && req.session.userID) next()
    else res.redirect(`/login`);
};

var savedMoney = 0;

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
        db.run(`INSERT INTO users(username, password, money) VALUES(?, ?, ?)`, [username, password, 0], function (err) {
            try {
                if (err) {
                    console.log(err.message);
                    throw new Error("Database insertion error");
                }
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                res.redirect('/login');

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
                savedMoney = row.money;
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
    const userID = req.session.userID;
    db.get(`SELECT * FROM Pets WHERE uID = ?`, [userID], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            res.redirect('/petView');
        } else {
            res.render('adopt.ejs');
        }
    });
});

app.post('/adopt', (req, res) => {
    var petName = req.body.petName;
    var uID = req.session.userID;

    db.run('INSERT INTO Pets (petName, uID, petHunger, petHappiness) VALUES (?, ?, ?, ?)', [petName, uID, 50, 50], function (err) {
        if (err) {
            throw err;
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.redirect('/');
        }
    });
});

app.get('/petView', isAuthenticated, (req, res) => {
    let userID = req.session.userID;
    let money = savedMoney;
    let petName = "Pet";
    let petHunger = 50;
    db.get(`SELECT * FROM Pets WHERE uID = ?`, [userID], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            petName = row.petName;
            petHunger = row.petHunger;
            petHappiness = row.petHappiness;
            petID = row.petID;
            res.render('petView.ejs', { petName: petName, petHunger: petHunger, petHappiness: petHappiness, money: money, petID: petID });
        } else {
            res.redirect('/adopt');
        }
    })
});

app.post('/petView', (req, res) => {
    let userID = req.session.userID;
    const hunger = req.body.petHunger;
    const happiness = req.body.petHappiness;
    const money = req.body.money;
    db.run(`UPDATE Pets SET petHunger = ?, petHappiness = ? WHERE uID = ?`, [hunger, happiness, userID], function (err) {
        if (err) {
            throw err;
        }
    });
    db.run(`UPDATE users SET money = ? WHERE uid = ?`, [money, userID], function (err) {
        if (err) {
            throw err;
        } else {
            savedMoney = money;
        }
    });
});

app.post('/abandonPet', (req, res) => {
    let petID = req.body.petID;
    let petAbandoned = false;
    db.run(`DELETE FROM Pets WHERE petID = ?`, [petID], function (err) {
        if (err) {
            throw err;
        } else {
            console.log("Pet Abandoned 1");
            petAbandoned = true;
            console.log(petAbandoned);
            if (petAbandoned) {
                console.log("Pet Abandoned 2");
            } else {
                console.log("Pet Abandon Failed");
            }
        }
    });
})

app.listen(3000, () => {
    console.log("Started HTTP Server on port 3000");
});