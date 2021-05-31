const mongoose = require('mongoose')
const schema = mongoose.Schema
const restaurantSchema = new schema({
  name: { type: String, required: true },
  name_en: { type: String },
  category: { type: String },
  image: { type: String },
  phone: { type: String },
  rating: { type: Number },
  description: { type: String }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)