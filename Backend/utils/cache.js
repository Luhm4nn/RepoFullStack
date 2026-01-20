const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => console.error('Redis Client Error', err));
client.connect();

async function getCache(key) {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value, ttl) {
  await client.set(key, JSON.stringify(value), { EX: ttl });
}

async function delCache(key) {
  await client.del(key);
}

module.exports = { getCache, setCache, delCache, client };