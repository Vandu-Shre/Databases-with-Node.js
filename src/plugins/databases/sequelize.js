import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { readdir } from "fs/promises";
import path from "path";

async function sequelizePlugin(fastify, config) {
  let mysqlStatus = "disconnected";
  let sequelize; // make it visible to onClose

  try {
    sequelize = new Sequelize(config.uri, config.options);
    await sequelize.authenticate();
    fastify.log.info("Connected to MySQL");
    mysqlStatus = "connected";

    // ✅ correct decoration key
    fastify.decorate("sequelize", sequelize);

    // Load models
    const models = {};
    const modelsPath = path.resolve("src/models/sequelize");
    const modelFiles = await readdir(modelsPath);

    for (const file of modelFiles) {
      if (file.endsWith(".js")) {
        const defineModel = (await import(path.join(modelsPath, file))).default;
        const model = defineModel(sequelize, Sequelize.DataTypes);
        models[model.name] = model;
        fastify.log.info(`Sequelize model ${model.name} loaded successfully`);
      }
    }

    // Setup associations if present
    for (const model of Object.values(models)) {
      if (typeof model.associate === "function") {
        model.associate(models);
      }
    }

    await sequelize.sync({ alter: false });
    fastify.log.info("Sequelize models synced successfully");

    // Expose models
    fastify.decorate("models", models);
  } catch (error) {
    fastify.log.error("Failed to connect to MySQL");
    throw error;
  }

  fastify.decorate("mysqlStatus", () => mysqlStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async () => {
    mysqlStatus = "disconnected";
    if (fastify.sequelize) {
      await fastify.sequelize.close(); // ✅ use decorated instance
      fastify.log.info("Sequelize connection closed");
    }
  });
}

export default fp(sequelizePlugin, { name: "sequelize-plugin" });
