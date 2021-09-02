const mongoose = require('mongoose');

const api = require('./api');
const schema = require('./schema');

const businessSchema = new mongoose.Schema(schema);
const Business = mongoose.model('Business', businessSchema);

const categories = ['debtrelief', 'travelagents', 'web_design', 'lifecoach', 'matchmakers', 'headshops', 'vapeshops', 'adultentertainment', 'stripclubs', 'pawn', 'paydayloans']

async function main() {
  await mongoose.connect('mongodb://localhost:27017/highrisk');
  let i = 0, savedNow = 0, savedTotal = 0, total = 0, droppedTotal = 0;

  const cacheLength = await api.cache.length();
  console.log('Cache length: ' + cacheLength);

  for (category of categories) {
    i = 0;
    savedNow = 0;
    droppedNow = 0;
    total = 0;

    do {
      const params = {
        categories: category,
        location: "New York, NY",
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
          savedNow++;
          savedTotal++;
        }
      }
      catch (err) {
        console.log(err.message);
      }

      console.log(`Saved ${savedNow} out of ${total} records to DB.`);
      i++;
    }
    while (i < Math.ceil(total / 50) && (i * 50 < 1000));

    droppedNow = total > 1000 ? total - 1000 : 0;
    droppedTotal += droppedNow;
    console.log(`Dropped ${droppedNow} records due to limit.`)
  }

  console.log(`Total saved records: ${savedTotal}`);
  console.log(`Total dropped records: ${droppedTotal}`);
}

main().catch(err => console.log(err));
