import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import path from "path";

async function staticPlugin(fastify) {
  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), "public"),
    prefix: "/" // Serve static files from the root
  });

  fastify.log.info("Static files served from /public");
}

export default fp(staticPlugin, { name: "static-plugin" });
