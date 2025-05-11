require('dotenv').config()
const { connectDB } = require('./config/db')
const cors = require('cors');
const express = require('express');

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', require('./router'))

app.listen(8080, () => {
    console.log('Server http://localhost:8080 da yurmoqda')
})
