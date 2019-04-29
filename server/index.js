require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const authController = require('./AuthController/authController')

const PORT = 4000

const { CONNECTION_STRING, SESSION_SECRET} = process.env
const app = express()

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db Connected')
})

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.post('/auth/register', authController.register)
app.post('/auth/login', authController.login)
app.get('/auth/logout', authController.logout)

app.listen(PORT, () => {
    console.log(`flying ON port ${PORT}`)
})