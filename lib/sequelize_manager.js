"use strict";

const Sequelize = require("sequelize");

class SequelizeManager {
	constructor(opts) {
		this.opts = opts;
		this.sequelizes = new Map();
	}

	get(database) {
		if (this.sequelizes.has(database)) {
			return this.sequelizes.get(database);
		}

		const config = this.opts[database];

		if (!config) {
			throw new Error(`database '${database}' not configured`);
		}

		const sequelize = this.buildSequelize(config);

		this.sequelizes.set(database, sequelize);

		return sequelize;
	}

	buildSequelize(config) {
		const sequelize = new Sequelize(
			config.database,
			config.username,
			config.password,
			{
				host: config.host,
				port: config.port,
				dialect: config.dialect || "mysql",
				pool: config.pool || {},
				timezone: "+08:00",
				operatorsAliases: false,
				dialectOptions: {
					dateStrings: true
				}
			}
		);

		return sequelize;
	}
}

module.exports = SequelizeManager;
