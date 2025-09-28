// plugins/databases/redis.js
import fp from "fastify-plugin";
import { createClient } from "redis";

async function redisPlugin(fastify, config) {
  const client = createClient({
    url: `redis://${config.host}:${config.port}`
  });

  client.on("error", (err) => fastify.log.error({ err }, "Redis error"));
  await client.connect();

  fastify.decorate("redis", client);
  fastify.decorate("redisStatus", () => "connected");

  fastify.addHook("onClose", async () => {
    await client.quit();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });
