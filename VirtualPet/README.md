Virtual Pets:
Web game that allows users, upon signing in, to adopt a pet, view their pet on the pet view page (while on the pet view page the pet's stats will decrease), interact with their pet by spending in-game currency to raise the pet's stat values, and allows users to abandon their pet. User can only adopt one pet at once, users get to name their pet. Pets have two stats, hunger and happiness. Pet's stats decrease by one every ten seconds. User's money will increase every 10 seconds, as long as all of the pet's stats are above 20. When any of the pet's stats drops below 20, the pet's color will change to red. When a pet is abandoned it will be permanently deleted from the database.

Install:
Install EJS, Express, Express-Session, and SQLite3
command: npm install ejs express express-session sqlite3

Database:
Initialize Database Containing User Data and Pet Data
command: npm run init-database

Start Server:
Start the server using node app.js
command: node app.js