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

// MongoDB
const businessSchema = new mongoose.Schema(schema);
const Business = mongoose.model('Business', businessSchema);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
  let savedRecords = 0;

  let i = 0;
  let total;
  do {
    const params = {
      location: '11214',
      limit: 50,
      offset: (i * 50)
    };
    console.log('Requesting: ' + instance.getUri({url: '', params }));
    const response = await instance({ params });
    const results = response.data.businesses;
    total = response.data.total;

    for (const result of results) {
      const filter = { id: result.id };
      const update = result;
      await Business.countDocuments(filter); // 0

      let doc = await Business.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      savedRecords++;
    }
    i++;
  }
  while (i < Math.ceil(total / 50));

  console.log(`Saved ${savedRecords} records to DB.`);
}

main().catch(err => console.log(err));