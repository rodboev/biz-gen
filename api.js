const axios = require('axios-cache-adapter');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();
const apiKey = process.env.API_KEY;

const redisClient = redis.createClient({
	url: process.env.REDIS_URL || 'redis://localhost',
})
const redisStore = new axios.RedisStore(redisClient);

const api = axios.setup({
  baseURL: 'https://api.yelp.com/v3/businesses/search',
  headers: { 'Authorization': 'Bearer ' + apiKey },
	cache: {
		maxAge: 15 * 60 * 1000, // 15m
		exclude: { query: false }, // cache requests with query parameters
		redisStore
	}
});

module.exports = api;