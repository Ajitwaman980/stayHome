const Redis = require("redis");
require("dotenv").config();
//  "redis://localhost:6379"

const redisclient = Redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    keepAlive: 10000,
  },
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
    setTimeout(connectRedis, 5000); // 5 seconds retry to connect
  }
}
connect();
module.exports = redisclient;
