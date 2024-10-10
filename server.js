const express = require ("express")
const app = express()
const mysql = require ("mysql2")
const cors = require ("cors")
const bcrypt = require ("bcrypt")
const nodemon = require ("nodemon")
const dotenv = require ("dotenv")
const path = require('path');
app.use (express.json())
app.use (cors())
dotenv.config();
// linking server to home page
app.get("/intro", function(request, response){
    response.sendfile (path.join (__dirname, "register.html"))
});
// connection to database
const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})
 //to check if connection works
 db.connect((err)=>{
    if (err) return console.log ("Error connecting to mysql")
    console.log ("connected to mysql as id :", db.threadId)
    //creating database
    db.query(`CREATE DATABASE IF NOT EXISTS Feeder_Project`, (err, result) => {
        // check if database was created
        if (err) return console.log (err)
        console.log ("database Feeder_Project created successfully");
        // to change our active database to feeder_project
        db.changeUser ({database: `Feeder_project`}, (err, result)=>{
            if (err) return console.log (err)
            console.log ("Feeder_Project is in use");
        //to create user table
        const usersTable = `
            CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR (100) NOT NULL UNIQUE,
            username VARCHAR (50) NOT NULL,
            password VARCHAR(200)
            )
            `;
            db. query (usersTable, (err,result)=>{
                if (err) return console.log(err)
                console.log("users table created successfully")
            })
        //create donation table
        const donationTable =`
            CREATE TABLE IF NOT EXISTS Donor(
            id INT AUTO_INCREMENT PRIMARY KEY,
            Donor_Name VARCHAR (100) NOT NULL,
            Food_Item VARCHAR (100) NOT NULL,
            Quantity VARCHAR (20),
            Expiration_Date DATE NOT NULL,
            Additional_Comment VARCHAR(400)
            )
            `;
            db. query (donationTable, (err,result)=>{
                if (err) return console.log(err)
                console.log("Donor table created successfully")
            })
             //create Request table
            const requestTable =`
            CREATE TABLE IF NOT EXISTS request(
            id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR (100) NOT NULL,
            Food_Item_eeded VARCHAR (100) NOT NULL,
            Quantity VARCHAR (20),
            urgency VARCHAR (20),
            Comment VARCHAR(400)
            )
            `;
            db. query (requestTable, (err,result)=>{
                if (err) return console.log(err)
                console.log("request table created successfully")
            })
        
        })

    })
})
//user registration route
app.post ('/api/register', async(req, res)=>{
    try{
        const users= `SELECT * FROM USERS WHERE email =?`
        // check if user exists
        db.query(users, [req.body.email], (err, data)=>{
            if (data.length > 0) return res.status (409).json ("user already exists")
            // to encript password
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync (req.body.password, salt)
            const newUser = `INSERT INTo users (email, username, Password) VALUES (?)`
            value = [req.body.email, req.body.username, hashedPassword]
            db.query (newUser, [value], (err,data)=>{
                if (err) return res.status (400).json ("unsuccessful")
                return res.status (200).json ("user account created successfully")
            })
        })
    }
    catch (err){
        res.status (500).json ("internet server error")
    }

})

// user login route
app.post ('/api/login', async (req, res)=>{
    try{
        const users= `SELECT * FROM users WHERE email= ?`
        // to check if user exist
        db.query(users, [req.body.email], (err, data)=>{
            if (data.length === 0) return res.status (404).json ('user not found');
            const isPasswordValid= bcrypt.compareSync(req.body.password, data[0].password)
            return res.status (200).json ("login successful")  
        })

    }

    catch (err){
        res.status(500).json('internal server error')
    }
})
// donation update route
app.post('/api/donate', async (req, res) => {
    try {
        const { donorName, foodItem, quantity, expirationDate, comments } = req.body;
        const newDonation = `
            INSERT INTO Donor (Donor_Name, Food_Item, Quantity, Expiration_Date, Additional_Comment) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [donorName, foodItem, quantity, expirationDate, comments];

        db.query(newDonation, values, (err) => {
            if (err) {
                console.error("Error adding donation: ", err);
                return res.status(400).json({ message: 'Something went wrong while adding the donation.' });
            }
            return res.status(200).json({ message: 'New donation added successfully.' });
        });
    } catch (err) {
        console.error("Server error: ", err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// donation request  route
app.post('/api/request', async (req, res) => {
    try {
        const { requesterName, foodItem, quantity, urgency, comments } = req.body;
        const newRequest = `
            INSERT INTO request (Name, Food_Item_Needed, Quantity, urgency,Comment) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [requesterName, foodItem, quantity, urgency, comments];

        db.query(newRequest, values, (err) => {
            if (err) {
                console.error("Error adding Request: ", err);
                return res.status(400).json({ message: 'Something went wrong while adding the Request.' });
            }
            return res.status(200).json({ message: 'your request was added successfully.' });
        });
    } catch (err) {
        console.error("Server error: ", err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// route to view our donations
app.get('/api/donations', (req, res) => {
  const query = 'SELECT Donor_Name, Food_Item, Quantity, Expiration_Date, Additional_Comment FROM donor';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.listen(3008, () => {
    console.log ("server is running on port 3008..")
})


