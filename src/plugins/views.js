import fp from "fastify-plugin";
import fastifyView from "@fastify/view";
import path from "path";
import ejs from "ejs";

// Define the plugin to register @fastify/view
async function viewPlugin(fastify) {
  fastify.register(fastifyView, {
    engine: {
      ejs
    },
    root: path.join(process.cwd(), "src/views"), // Path to your views
    layout: "layout.ejs" // Optional: Default layout
  });
}

// Export the plugin wrapped in fastify-plugin
export default fp(viewPlugin);
