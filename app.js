const express = require('express')
const app = express ()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const path = require('path')
const models = require('./models')
const bcrypt = require('bcrypt')
const session = require('express-session')

const SALT_ROUNDS = 10;
const PORT = 3000
const VIEWS_PATH = path.join(__dirname, '/views')

app.use(session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized: false
}))

app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials','.mustache'))
app.set('views',VIEWS_PATH)
app.set('view engine','mustache')

// GET METHOD

// Register
app.get('/register',(req,res) => {
    res.render('register')
})

// Login
app.get('/login',(req,res) => {
    res.render('login')
})

// POST METHOD
app.post('/login', async (req,res) => {
    // get username and password from form inputs
    let username = req.body.username
    let password = req.body.password

    // check if the username exists in database
    let user = await models.User.findOne({
        where: {
            username: username
        }
    })

    // if user exists
    if(user != null){
        bcrypt.compare(password, user.password,(error, result) => {
            if(result) {
                //create a session
                if(req.session) {
                    req.session.user = {userId: user.id}
                    res.redirect('user/products')
                }
            } else {
                res.render('/login', {message: 'Incorrect username or password'})
            }
        })
    } else {
        res.render('/login', {message: 'Username or password is invalid!'})
    }
})

app.post('/register',async (req,res) => {
    let username = req.body.username
    let password = req.body.password

    // check if the user exist
    let persistedUser = await models.User.findOne({
        where: {
            username: username
        }
    })

    // if user does not exist creat one
    if(persistedUser == null){

        bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
            if(error) {
                res.render('/register', {message: 'Error occured when registering'})
            } else {
                let user = models.User.build({
                    username : username,
                    password: hash
                })

                let savedUser = await user.save();

                // if user exists redirect them to login page
                if(savedUser != null) {
                    res.redirect('/login')
                } else {
                    res.render('/register', {message: "User already exists!"})
                }
            }
        })

    } else {
        res.render('/register', {message: "User already exists!"})
    }
})


app.listen(PORT, () => console.log('Server is running.'))