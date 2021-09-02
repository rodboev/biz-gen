const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const schema = require('./schema.js');

dotenv.config();

// Yelp
const apiKey = process.env.API_KEY;
const instance = axios.create({
  baseURL: 'https://api.yelp.com/v3/businesses/search',
  headers: { 'Authorization': 'Bearer ' + apiKey }
});

async function searchYelp(params) {
  const response = await instance({ params });
  // console.log(JSON.stringify(response.data, null, 4))
  return response.data.businesses;
}

// MongoDB
const businessSchema = new mongoose.Schema(schema);

const Business = mongoose.model('Business', businessSchema);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');

  const results = await searchYelp({ location: '11214' });

  for (const result of results) {
    const record = new Business(result);
    await record.save();
  }
}

main().catch(err => console.log(err));