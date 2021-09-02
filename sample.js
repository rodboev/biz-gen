const yelp = require('yelp-fusion');
const dotenv = require('dotenv').config();

const auth = {
  companyKey: process.env.COMPANY_KEY,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = process.env.API_KEY;

const searchRequest = {
  location: '11214'
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  const firstResult = response.jsonBody.businesses[0];
  const prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
}).catch(e => {
  console.log(e);
});
