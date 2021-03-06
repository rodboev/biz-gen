const mongoose = require('mongoose');

const api = require('./api');
const schema = require('./schema');
const locations = require('./locations');

const businessSchema = new mongoose.Schema(schema);
const Business = mongoose.model('Business', businessSchema);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp');
  let i, saved, dropped, total;

  const cacheLength = await api.cache.length();
  console.log('Cache length: ' + cacheLength);

  for (location of locations) {
    i = 0;
    saved = 0;
    dropped = 0;
    total = 0;

    do {
      const params = {
        location,
        limit: 50,
        offset: (i * 50)
      };

      console.log('Requesting: ' + api.getUri({url: '', params }));

      try {
        const response = await api({ params });
        const results = response.data.businesses;
        total = response.data.total;

        for (const result of results) {
          const filter = { id: result.id };
          const update = result;

          let doc = await Business.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true // Make this update into an upsert
          });
          saved++;
        }
      }
      catch (err) {
        console.log(err.message);
      }

      console.log(`Saved ${saved} out of ${total} records to DB.`);
      i++;
    }
    while (i < Math.ceil(total / 50) && (i * 50 < 1000));

    dropped = total > 1000 ? total - 1000 : 0;
    dropped && console.log(`Dropped ${dropped} records due to limit.`)
  }

}

main().catch(err => console.log(err));
