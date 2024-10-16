const Redis = require("redis");
require("dotenv").config();
//  "redis://localhost:6379"

const redisclient = Redis.createClient({
  url: process.env.REDIS_URL,
});

redisclient.on("error", (err) => {
  console.error("Redis error:", err);
});
async function connect() {
  try {
    await redisclient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
    process.exit(1);
  }
}
connect();
module.exports = redisclient;
