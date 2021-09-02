const mongoose = require('mongoose');

const api = require('./api');
const schema = require('./schema');
const locations = require('./locations');

const categories = ["active", "arts", "auto", "beautysvc", "bicycles", "education", "eventservices", "financialservices", "food", "health", "homeservices", "hotelstravel", "localflavor", "localservices", "massmedia", "nightlife", "pets", "professional", "publicservicesgovt", "religiousorgs", "restaurants", "shopping"];

const businessSchema = new mongoose.Schema(schema);
const Business = mongoose.model('Business', businessSchema);

async function saveToDb(results) {
  try {
    for (const result of results) {
      const filter = { id: result.id };
      const update = result;

      let doc = await Business.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
      });
    }
  }
  catch (err) {
    console.log(err.message);
  }
}

async function searchYelp({ params }) {
  // const cacheLength = await api.cache.length();
  console.log(`Requesting: ${api.getUri({url: '', params })}`);
  
  try {
    const response = await api({ params });
    const results = response.data.businesses;
    const total = response.data.total;
    return { results, total };
  }
  catch (err) {
    console.log(err.message);
  }
}

(async function() {
  await mongoose.connect('mongodb://localhost:27017/yelp');
  for (location of locations) {
    let params = {
      location,
      limit: 50
    };

    const { results, total } = await searchYelp({ params });
    console.log(`Received ${total} results`);

    if (total > 5000) {
      // zip code is probably bad
      console.log('Skipping location');
      continue;
    }
    else if (total > 1000) {
      // break up into categories
      for (category of categories) {
        delete params.offset;
        params = {
          ...params,
          categories: category
        };

        const { results, total } = await searchYelp({ params });
        console.log(`Received ${total} results`);
        await saveToDb(results);

        for (let i = 1; (i < Math.ceil(total / 50)) && (i * 50 < 1000); i++) {
          params = {
            ...params,
            offset: i * 50
          };
          const { results } = await searchYelp({ params });
          await saveToDb(results);
        }
      }
    }
    else {
      // fetch normally
      await saveToDb(results);
      
      for (let i = 1; (i < Math.ceil(total / 50)) && (i * 50 < 1000); i++) {
        params = {
          ...params,
          offset: i * 50
        };
        let { results } = await searchYelp({ params });
        await saveToDb(results);
      }
    }
}

})();
