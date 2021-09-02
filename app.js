const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const apiKey = process.env.API_KEY;

const instance = axios.create({
  baseURL: 'https://api.yelp.com/v3/businesses/search',
  headers: { 'Authorization': 'Bearer ' + apiKey }
});

(async () => {
  const response = await instance({
    params: {
      location: '11214'
    }
  })

  console.log(JSON.stringify(response.data, null, 4))
})();
