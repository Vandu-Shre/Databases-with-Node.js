import indexRoutes from "../routes/index.js";
import basketRoutes from "../routes/basket.js";
import shopRoutes from "../routes/shop.js";
import userRoutes from "../routes/user.js";
import userAdminRoutes from "../routes/admin/user.js";
import itemAdminRoutes from "../routes/admin/item.js";
import ordersAdminRoutes from "../routes/admin/orders.js";

export default async function (fastify) {
  // Register routes with prefixes
  fastify.register(indexRoutes, { prefix: "/" });
  fastify.register(basketRoutes, { prefix: "/basket" });
  fastify.register(userRoutes, { prefix: "/user" });
  fastify.register(shopRoutes, { prefix: "/shop" });
  fastify.register(userAdminRoutes, { prefix: "/admin/user" });
  fastify.register(itemAdminRoutes, { prefix: "/admin/item" });
  fastify.register(ordersAdminRoutes, { prefix: "/admin/orders" });
}
