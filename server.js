const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000
require('dotenv').config()

// mysql connection
const mysql = require('mysql')
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
})

db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("MYSQL is successfully connected")
    }
})

//  static
const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))

// setup HBS
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(PORT,()=> console.log("server is running"))