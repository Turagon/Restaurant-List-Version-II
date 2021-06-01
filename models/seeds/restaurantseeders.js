const mongoose = require('mongoose')
const Restaurant = require('../restaurantSchema')
const seedData = require('./restaurant.json')["results"]

mongoose.connect('mongodb://localhost/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
  console.log('fail connect to db')
})

db.once('open', () => {
  console.log('db 2nd connecting success')
  for (let i of seedData) {
    Restaurant.create({ 
      name: i.name,
      name_en: i.name_en,
      category: i.category,
      image: i.image,
      location: i.location,
      phone: i.phone,
      rating: i.rating,
      description: i.description
     })
  }
  console.log('done')
})

