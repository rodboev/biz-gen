const boros = require('./boros.json');

let locations = [];
for (boro of boros) {
  const name = boro.name;
  const zips = boro.zips;

  for (zip of zips) {
    locations.push(`${name}, NY ${zip}`);
  }
}

module.exports = locations;