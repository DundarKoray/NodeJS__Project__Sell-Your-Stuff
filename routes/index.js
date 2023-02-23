const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const models = require('../models')

const SALT_ROUNDS = 10;

// GET METHOD

// Register
router.get('/register',(req,res) => {
    res.render('register')
})

// Login
router.get('/login',(req,res) => {
    res.render('login')
})

// POST METHOD
router.post('/login', async (req,res) => {
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

router.post('/register',async (req,res) => {
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

module.exports = router

