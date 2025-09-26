import fp from "fastify-plugin";

// Define the defaults plugin
async function defaultsPlugin(fastify) {
  fastify.addHook("preHandler", async (request, reply) => {
    // Set default values for template variables
    reply.locals = {
      applicationName: "SimpleShop",
      messages: [],
      items: [],
      user: null,
      item: null,
      basketCount: 0,
      statuses: {
        mongo: fastify.mongoStatus ? fastify.mongoStatus() : "unknown",
        mysql: fastify.mysqlStatus ? fastify.mysqlStatus() : "unknown",
        redis: fastify.redisStatus ? fastify.redisStatus() : "unknown"
      }
    };
  });
}

// Export as a Fastify plugin using fp
export default fp(defaultsPlugin);
