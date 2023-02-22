const express = require('express')
const app = express ()
const mustache = require('mustache')
const path = require('path')

const PORT = 3000
const VIEWS_PATH = path.join(__dirname, '/views')

app.engine('mustache', mustacheExpress(VIEWS_PATH + 'partials/','.mustache'))
app.set('views',VIEWS_PATH)
app.set('view engine','mustache')

app.listen(PORT, () => console.log('Server is running.'))