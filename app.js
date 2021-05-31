const express = require('express')
const exphbs = require('express-handlebars')
const bodyparser = require('body-parser')
const handlebars = require('handlebars')
const helpers = require('just-handlebars-helpers')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurantSchema')
const searchFilter = require('./public/javascripts/searchFilter.js').searchFilter
const app = express()
const port = 3000

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

helpers.registerHelpers(handlebars)

mongoose.connect('mongodb://localhost/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('error')
})

db.once('open', () => {
  console.log('DB is on')
})

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(error => console.error(error))
})

app.get('/details/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(details => res.render('details', { details }))
    .catch(error => console.error(error))
})

app.get('/add', (req, res) => {
  res.render('addNewRestaurant')
})

app.post('/search', (req, res) => {
  const searchValue = req.body.search
  Restaurant.find()
    .lean()
    .then(restaurants => searchFilter(searchValue, ...restaurants))
    .then(restaurants => res.render('search', { searchValue, restaurants }))
    .catch(error => console.error(error))
})



app.listen(port, () => {
  console.log('server on')
})

