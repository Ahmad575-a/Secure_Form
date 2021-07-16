const express = require('express')
const app = express()

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Home')
})

app.listen(PORT,()=> console.log("server is running"))