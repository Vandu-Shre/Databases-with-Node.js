export default async function (fastify) {
  fastify.get("/", async (request, reply) => {
    return reply.view("index.ejs", {
      title: "Home",
      currentPath: "/"
    });
  });
}
