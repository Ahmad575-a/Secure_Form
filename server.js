const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000
require('dotenv').config()
const db = require('./models/dbConfig')

//  static
const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))

// body parser and parse json body
app.use(express.urlencoded({extended: false}))
app.use(express.json())
// cookie parser
app.use(cookieParser());

// setup HBS
app.set('view engine', 'hbs')

// Database Connection
db.dbConnection.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("MYSQL is successfully connected")
    }
})


// Routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(PORT,()=> console.log("server is running"))