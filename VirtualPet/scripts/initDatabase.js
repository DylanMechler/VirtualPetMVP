const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data/database.sqlite', (err) => {
    if (err) {
        console.error(`Error Connecting To Database: ${err.message}`);
    } else {
        console.log('Connected To Database');
    }
});

db.run(`CREATE TABLE "users" (
	"uid"	INTEGER NOT NULL UNIQUE,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("uid" AUTOINCREMENT)
)`, (err) => {
    if (err) {
        console.error(`Error Creating Users Table: ${err.message}`);
    } else {
        console.log("Users Table Created Successfully");
    }
});
db.run(`CREATE TABLE "Pets" (
	"petName"	TEXT NOT NULL,
	"petID"	INTEGER NOT NULL UNIQUE,
	"uID"	INTEGER NOT NULL UNIQUE,
	"petHunger"	INTEGER NOT NULL,
	PRIMARY KEY("petID" AUTOINCREMENT)
)`, (err) => {
    if (err) {
        console.error(`Error Creating Pets Table: ${err.message}`);
    } else {
        console.log("Pets Table Created Successfully");
    }
    db.close((err) => {
        if (err) {
            console.error(`Error Closing Database: ${err.message}`);
        } else {
            console.log("Database Connection Closed");
        }
    });
});