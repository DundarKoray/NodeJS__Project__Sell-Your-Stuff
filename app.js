const express = require('express')
const app = express ()
const mustacheExpress = require('mustache-express')
const path = require('path')

const PORT = 3000
const VIEWS_PATH = path.join(__dirname, '/views')

app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials','.mustache'))
app.set('views',VIEWS_PATH)
app.set('view engine','mustache')

// Register
app.get('/register',(req,res) => {
    res.render('register')
})

// Login
app.get('/login',(req,res) => {
    res.render('login')
})

app.listen(PORT, () => console.log('Server is running.'))