const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()


// view engine setup
app.engine('hbs', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'hbs')

// serve the files in /public
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.get('/', function(req, res){
  res.render('login', {title:"Bizzy Login"})
})

app.get('/register', function(req, res){
  res.render('register', {title:"Bizzy Page"})
})





// Exports app functions
module.exports = app
