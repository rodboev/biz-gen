const mongoose = require('mongoose');

const api = require('./api');
const schema = require('./schema');
const boros = require('./boros.json');

const businessSchema = new mongoose.Schema(schema);
const Business = mongoose.model('Business', businessSchema);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
  let i = 0, savedRecords = 0, total;

  const cacheLength = await api.cache.length();
  console.log('Cache length: ' + cacheLength);

  let zips = boros.flatMap(boro => boro.zips);
  // zips.splice(0, zips.indexOf('10114')); // location not found

  for (zip of zips) {
    i = 0;
    do {
      const params = {
        location: zip,
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
          await Business.countDocuments(filter); // 0

          let doc = await Business.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true // Make this update into an upsert
          });
          savedRecords++;
        }
      }
      catch (err) {
        console.log(err.message);
      }
      i++;
    }
    while (i < Math.ceil(total / 50) && (i * 50 < 1000));
  }

  console.log(`Saved ${savedRecords} records to DB.`);
}

main().catch(err => console.log(err));
