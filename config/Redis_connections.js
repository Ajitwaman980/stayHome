const Redis = require("redis");
require("dotenv").config();
//  "redis://localhost:6379"
const redisUrl = process.env.NODE_ENV === "production";
("redis://red-cs7bff8gph6c73fhppmg:6379"); // Internal URL

const redisclient = Redis.createClient({
  url: redisUrl,
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
