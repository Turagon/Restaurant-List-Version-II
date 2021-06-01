const express = require('express')
const exphbs = require('express-handlebars')
const bodyparser = require('body-parser')
const handlebars = require('handlebars')
const helpers = require('just-handlebars-helpers')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurantSchema')
const searchFilter = require('./public/javascripts/searchFilter.js').searchFilter
const newToVerify = require('./public/javascripts/newToVerify.js').verification
const app = express()
const port = 3000
let newAdd = ''

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
  newAdd = ''
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(error => console.error(error))
})

app.get('/details/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(details => res.render('details', { id, details }))
    .catch(error => console.error(error))
})

app.get('/add', (req, res) => {
  res.render('addNewRestaurant')
})

app.get('/edit/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { id, restaurant }))
    .catch(error => console.error(error))
})

app.get('/add/confirm', (req, res) => {
  return Restaurant.create({ 
    name: newAdd.name,
    name_en: newAdd.name_en,
    category: newAdd.category,
    location: newAdd.location,
    phone: newAdd.phone,
    rating: newAdd.rating,
    description: newAdd.description,
    image: newAdd.image
  })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

app.post('/search', (req, res) => {
  const searchValue = req.body.search
  Restaurant.find()
    .lean()
    .then(restaurants => searchFilter(searchValue, ...restaurants))
    .then(restaurants => res.render('search', { searchValue, restaurants }))
    .catch(error => console.error(error))
})

app.post('/add/confirm', (req, res) => {
  const data = req.body
  const verifyName = data.name
  const verifyCategory = data.category
  Restaurant.find()
    .lean()
    .then(restaurants => newToVerify(verifyName, verifyCategory, ...restaurants))
    .then(restaurants => {
      if (!restaurants[0]) {
        return Restaurant.create(data)
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
      } else {
        newAdd = data
        res.render('add-confirm', { restaurants })
      }
    })
})

app.post('/details/:id', (req, res) => {
  const id = req.params.id
  const newData = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = newData.name
      restaurant.name_en = newData.name_en
      restaurant.category = newData.category
      restaurant.location = newData.location
      restaurant.phone = newData.phone
      restaurant.rating = newData.rating
      restaurant.description = newData.description
      restaurant.image = newData.image
      return restaurant.save()
    })
    .then(() => res.redirect(`/details/${id}`))
    .catch(error => console.error(error))
})



app.listen(port, () => {
  console.log('server on')
})

