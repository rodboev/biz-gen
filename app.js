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

  // Make first query
  const params = {
    location: '11214',
    limit: 50
  };
  console.log('Requesting: ' + instance.getUri({url: '', params }));
  const response = await instance({ params });
  const results = response.data.businesses;

  // Save results
  for (const result of results) {
    const record = new Business(result);
    await record.save();
    savedRecords++;
  }
  console.log(`Saved ${savedRecords} records to DB.`);

  // Make additional queries
  const total = response.data.total;
  const additionalReqs = Math.ceil((total - 50) / 50);

  for (let i = 0; i < additionalReqs; i++) {
    const params = {
      location: '11214',
      limit: 50,
      offset: (i + 1) * 50
    }
    console.log('Requesting: ' + instance.getUri({url: '', params }));
    const response = await instance({ params });
    const results = response.data.businesses;
  
    // Save results
    for (const result of results) {
      const record = new Business(result);
      await record.save();
      savedRecords++;
    }
    console.log(`Saved ${savedRecords} records to DB.`);
  }
}

main().catch(err => console.log(err));