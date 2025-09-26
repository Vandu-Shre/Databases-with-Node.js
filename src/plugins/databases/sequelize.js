import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { readdir } from 'fs/promises';
import path from "path";

async function sequelizePlugin(fastify, config) {
  let mysqlStatus = "disconnected";

  // TODO: Connect to MySQL via Sequelize and update the status
  try {
    const sequelize = new Sequelize(config.uri, config.options);
    await sequelize.authenticate();
    fastify.log.info("Connected to MySQL");
    mysqlStatus = "connected";
    fastify.decorate("sequellize", sequelize);

    //Models
    const models = {}
    const modelsPath = path.resolve("src/models/sequelize")
    const modelFiles = await readdir(modelsPath);

    for(const file of modelFiles) {
      if(file.endsWith(".js")){
        const model = (await import(path.join(modelsPath, file))).default(sequelize, Sequelize.DataTypes)
        models[model.name] = model;
        fastify.log.info(`Sequalize model ${model.name} loaded successfully`);
      }
    }

    Object.values(models).forEach((model)=>{
      if(model.associate){
        model.associate(models);
      }
    })

    await sequelize.sync({ alter: false })
    fastify.log.info("Sequalize models synced successfully")
    fastify.decorate("models", models)
  } catch (error) {
    fastify.log.error("Failed to connect to MySQL");
    throw error;
  }
  fastify.decorate("mysqlStatus", () => mysqlStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    mysqlStatus = "disconnected";
    // TODO: Close Sequelize connection
    await sequelize.close();
    done();
  });
}

export default fp(sequelizePlugin, { name: "sequelize-plugin" });
